import { useEffect, useRef, useState } from 'react';
import type {
  AgentCall,
  AgentTrajectory,
  CreditAnalysisStatus,
  HITLRequest,
  ReasoningChunk,
} from '@repo/types';

export interface UseAgentStreamResult {
  status: CreditAnalysisStatus;
  trajectory: AgentTrajectory | null;
  hitlRequest: HITLRequest | null;
  error: string | null;
  connected: boolean;
}

interface StreamEvent {
  type: string;
  request_id: string;
  timestamp?: string;
  trace_id?: string;
  agent?: string;
  turn?: AgentCall['phase'];
  status?: string;
  latency_ms?: number;
  score?: number;
  risk_tier?: string;
  kyc_approved?: boolean;
  decision?: string;
  finops_cost_brl?: number;
  reason?: string;
  error?: string;
}

const EVENT_TYPES = [
  'analysis_started',
  'agent_started',
  'agent_completed',
  'analysis_done',
  'hitl_required',
  'analysis_error',
  'stream_end',
] as const;

const AGENT_NAMES: Record<string, string> = {
  bureau_get_score: 'bureau',
  documents_validate: 'documents',
  risk_evaluate: 'risk',
  compliance_check: 'compliance',
  decision_synthesize: 'decision',
  handoff_to_human: 'decision',
};

const AGENT_ORDER = ['bureau', 'documents', 'risk', 'compliance', 'decision'];

const COPY: Record<string, { started: string; completed: string }> = {
  bureau: { started: 'Consultando seu histórico no bureau de crédito', completed: 'Histórico de crédito confirmado' },
  documents: { started: 'Validando os documentos da proposta', completed: 'Documentos confirmados' },
  risk: { started: 'Calculando seu perfil de risco', completed: 'Avaliação de risco concluída' },
  compliance: { started: 'Conferindo conformidade regulatória', completed: 'Verificação de conformidade concluída' },
  decision: { started: 'Sintetizando a decisão final', completed: 'Decisão consolidada' },
};

function eventTime(event: StreamEvent): number {
  const parsed = event.timestamp ? Date.parse(event.timestamp) : NaN;
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function chunk(event: StreamEvent, kind: ReasoningChunk['kind'], text: string): ReasoningChunk {
  return {
    kind,
    text_human: text,
    text_debug: [
      `event=${event.type}`,
      event.agent ? `agent=${event.agent}` : '',
      event.latency_ms !== undefined ? `latency_ms=${event.latency_ms}` : '',
    ].filter(Boolean).join(' '),
    timestamp_ms: eventTime(event),
  };
}

function completedCopy(event: StreamEvent, agent: string): string {
  if (agent === 'bureau' && event.score !== undefined) return `Score recuperado · ${event.score} pontos`;
  if (agent === 'risk' && event.risk_tier) return `Perfil de risco classificado como ${event.risk_tier}`;
  if (agent === 'compliance') return event.kyc_approved
    ? 'Identidade e conformidade confirmadas'
    : 'Verificação regulatória requer atenção';
  return COPY[agent]?.completed ?? 'Etapa concluída';
}

function upsertPhase(trajectory: AgentTrajectory, phase: AgentCall): AgentTrajectory {
  const phases = [...trajectory.phases.filter((item) => item.agent !== phase.agent), phase]
    .sort((a, b) => AGENT_ORDER.indexOf(a.agent) - AGENT_ORDER.indexOf(b.agent));
  return { ...trajectory, phases };
}

export function useAgentStream(endpoint: string, enabled = true): UseAgentStreamResult {
  const [status, setStatus] = useState<CreditAnalysisStatus>('pending');
  const [trajectory, setTrajectory] = useState<AgentTrajectory | null>(null);
  const [hitlRequest, setHitlRequest] = useState<HITLRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const attemptRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const seenRef = useRef(new Set<string>());
  const terminalRef = useRef(false);

  useEffect(() => {
    if (!enabled || !endpoint) return;

    let disposed = false;
    attemptRef.current = 0;
    seenRef.current.clear();
    terminalRef.current = false;
    setStatus('pending');
    setTrajectory(null);
    setHitlRequest(null);
    setError(null);
    setConnected(false);

    const consume = (message: MessageEvent<string>) => {
      try {
        const event = JSON.parse(message.data) as StreamEvent;
        const identity = JSON.stringify([event.type, event.agent, event.timestamp, event.status]);
        if (seenRef.current.has(identity)) return;
        seenRef.current.add(identity);

        if (event.type === 'stream_end') {
          eventSourceRef.current?.close();
          setConnected(false);
          return;
        }

        if (event.type === 'analysis_started') {
          setStatus('analyzing');
          setTrajectory({
            request_id: event.request_id,
            trace_id: event.trace_id ?? `tr-${event.request_id}`,
            phases: [],
            finops: { estimated_cost_brl: 0 },
          });
          return;
        }

        if (event.type === 'agent_started' && event.agent) {
          const agent = AGENT_NAMES[event.agent] ?? event.agent;
          setStatus('analyzing');
          setTrajectory((current) => {
            const base = current ?? {
              request_id: event.request_id,
              trace_id: event.trace_id ?? `tr-${event.request_id}`,
              phases: [],
              finops: { estimated_cost_brl: 0 },
            };
            const existing = base.phases.find((phase) => phase.agent === agent);
            return upsertPhase(base, {
              agent,
              phase: event.turn ?? existing?.phase ?? 'T1',
              status: 'in_progress',
              latency_ms: 0,
              reasoning: [
                ...(existing?.reasoning ?? []),
                chunk(event, 'thought', COPY[agent]?.started ?? 'Executando etapa da análise'),
              ],
            });
          });
          return;
        }

        if (event.type === 'agent_completed' && event.agent) {
          const agent = AGENT_NAMES[event.agent] ?? event.agent;
          setTrajectory((current) => {
            if (!current) return current;
            const existing = current.phases.find((phase) => phase.agent === agent);
            return upsertPhase(current, {
              agent,
              phase: event.turn ?? existing?.phase ?? 'T1',
              status: event.status === 'success' ? 'success' : 'error',
              latency_ms: event.latency_ms ?? 0,
              reasoning: [
                ...(existing?.reasoning ?? []),
                chunk(event, event.status === 'success' ? 'conclusion' : 'result', completedCopy(event, agent)),
              ],
            });
          });
          return;
        }

        if (event.type === 'analysis_done') {
          const finalStatus: CreditAnalysisStatus = event.status === 'approved' || event.decision === 'approved'
            ? 'approved'
            : event.status === 'pending_human_review'
              ? 'hitl_required'
              : 'rejected';
          terminalRef.current = true;
          setStatus(finalStatus);
          setTrajectory((current) => current ? {
            ...current,
            finops: { ...current.finops, estimated_cost_brl: event.finops_cost_brl ?? 0 },
          } : current);
          return;
        }

        if (event.type === 'hitl_required') {
          terminalRef.current = true;
          setStatus('hitl_required');
          setHitlRequest({
            type: 'HITL_REQUIRED',
            request_id: event.request_id,
            trace_id: event.trace_id ?? `tr-${event.request_id}`,
            reason: event.reason ?? 'Revisão humana necessária',
          } as HITLRequest);
          return;
        }

        if (event.type === 'analysis_error') {
          terminalRef.current = true;
          setStatus('error');
          setError('Não foi possível concluir a análise.');
        }
      } catch {
        setError('Não foi possível interpretar um evento da análise.');
      }
    };

    const connect = () => {
      if (disposed) return;
      eventSourceRef.current?.close();
      const source = new EventSource(endpoint);
      eventSourceRef.current = source;

      source.onopen = () => {
        attemptRef.current = 0;
        setConnected(true);
        setError(null);
      };
      EVENT_TYPES.forEach((type) => source.addEventListener(type, consume as EventListener));
      source.onerror = () => {
        source.close();
        setConnected(false);
        if (terminalRef.current || disposed) return;
        if (attemptRef.current < 3) {
          const delay = 2 ** attemptRef.current * 1000;
          attemptRef.current += 1;
          timeoutRef.current = setTimeout(connect, delay);
        } else {
          setError('Não foi possível conectar ao stream da análise.');
        }
      };
    };

    connect();
    return () => {
      disposed = true;
      eventSourceRef.current?.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, endpoint]);

  return { status, trajectory, hitlRequest, error, connected };
}
