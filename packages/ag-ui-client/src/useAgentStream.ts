import { useState, useEffect, useRef } from 'react';
import type { CreditAnalysisStatus, AgentTrajectory, HITLRequest } from '@repo/types';

export interface UseAgentStreamResult {
  status: CreditAnalysisStatus;
  trajectory: AgentTrajectory | null;
  hitlRequest: HITLRequest | null;
  error: string | null;
}

export function useAgentStream(endpoint: string): UseAgentStreamResult {
  const [status, setStatus] = useState<CreditAnalysisStatus>('pending');
  const [trajectory, setTrajectory] = useState<AgentTrajectory | null>(null);
  const [hitlRequest, setHitlRequest] = useState<HITLRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const attemptRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!endpoint) {
      setError('Endpoint not provided');
      setStatus('error');
      return;
    }

    function connect() {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      console.log(`[AG-UI] Connecting to SSE endpoint: ${endpoint} (Attempt ${attemptRef.current + 1})`);
      const es = new EventSource(endpoint);
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log('[AG-UI] SSE connection established successfully.');
        attemptRef.current = 0; // Reset attempts on successful connection
        setError(null);
      };

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          console.log('[AG-UI] Event received:', payload);

          // Support both flat structure and nested data format
          const eventType = payload.type || '';
          const data = payload.data || payload;

          switch (eventType) {
            case 'HITL_REQUIRED':
              setStatus('hitl_required');
              setHitlRequest(data as HITLRequest);
              if (data.trajectory) {
                setTrajectory(data.trajectory as AgentTrajectory);
              }
              break;

            case 'AGENT_UPDATE':
              setStatus('analyzing');
              setTrajectory(data as AgentTrajectory);
              break;

            case 'ANALYSIS_COMPLETE':
              setStatus(data.decision === 'approved' ? 'approved' : 'rejected');
              if (data.trajectory) {
                setTrajectory(data.trajectory as AgentTrajectory);
              }
              break;

            case 'ERROR':
              setStatus('error');
              setError(data.message || 'An error occurred during analysis');
              break;

            default:
              console.warn('[AG-UI] Unknown event type received:', eventType);
              break;
          }
        } catch (err) {
          console.error('[AG-UI] Failed to parse message data:', err);
          setError('Failed to parse orchestrator message');
        }
      };

      es.onerror = () => {
        console.error('[AG-UI] SSE connection error.');
        es.close();

        if (attemptRef.current < 3) {
          const delay = Math.pow(2, attemptRef.current) * 1000;
          attemptRef.current += 1;
          console.log(`[AG-UI] Reconnecting in ${delay}ms...`);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          console.error('[AG-UI] Max reconnection attempts reached.');
          setStatus('error');
          setError('Connection lost. Max reconnection attempts reached.');
        }
      };
    }

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [endpoint]);

  return {
    status,
    trajectory,
    hitlRequest,
    error
  };
}
