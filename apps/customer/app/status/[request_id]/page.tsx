'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAgentStream } from '@repo/ag-ui-client';
import { StatusBadge } from '@repo/ui/status-badge';
import { TraceTimeline } from '@repo/ui/trace-timeline';
import { CostDisplay } from '@repo/ui/cost-display';
import type { AgentTrajectory } from '@repo/types';

export default function CustomerStatusPage() {
  const { request_id } = useParams();
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf') || 'XXX.XXX.XXX-XX';
  const amount = searchParams.get('amount') || '50000';

  // Construct SSE endpoint
  const baseUrl = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL;
  const sseUrl = baseUrl ? `${baseUrl}/v1/analysis/${request_id}/stream` : '';

  // Retrieve streaming state from AG-UI SSE client
  const streamResult = useAgentStream(sseUrl);

  // local simulation state for previewing flow in development mode
  const [isSimulated, setIsSimulated] = useState(false);
  const [simState, setSimState] = useState({
    status: 'pending',
    trajectory: null as AgentTrajectory | null,
    error: null as string | null,
  });

  useEffect(() => {
    // If no orchestrator URL is provided, we simulate the SSE updates for frontend scaffolding preview
    if (!baseUrl) {
      setIsSimulated(true);
      console.warn('[AG-UI] NEXT_PUBLIC_ORCHESTRATOR_URL not defined. Starting local simulated SSE analysis stream.');
      
      const reqIdStr = (Array.isArray(request_id) ? request_id[0] : request_id) || 'req-xyz';
      
      // Step 1: Pending -> Analyzing T1
      const timer1 = setTimeout(() => {
        setSimState({
          status: 'analyzing',
          error: null,
          trajectory: {
            request_id: reqIdStr,
            trace_id: 'tr-mock-1002931',
            phases: [
              { agent: 'bureau', phase: 'T1', status: 'success', latency_ms: 1200, span_id: 'span-bureau-1' },
              { agent: 'risk', phase: 'T1', status: 'success', latency_ms: 1540, span_id: 'span-risk-1' }
            ],
            finops: { estimated_cost_brl: 0.0452 }
          }
        });
      }, 1500);

      // Step 2: Analyzing T2
      const timer2 = setTimeout(() => {
        setSimState(prev => ({
          ...prev,
          status: 'analyzing',
          trajectory: {
            request_id: reqIdStr,
            trace_id: 'tr-mock-1002931',
            phases: [
              ...(prev.trajectory?.phases || []),
              { agent: 'compliance', phase: 'T2', status: 'success', latency_ms: 2200, span_id: 'span-compliance-2' }
            ],
            finops: { estimated_cost_brl: 0.0894 }
          }
        }));
      }, 3500);

      // Step 3: Complete T3 (Approved / Rejected depending on amount)
      const timer3 = setTimeout(() => {
        const isApproved = parseFloat(amount) <= 50000;
        setSimState(prev => ({
          status: isApproved ? 'approved' : 'hitl_required',
          error: null,
          trajectory: {
            request_id: reqIdStr,
            trace_id: 'tr-mock-1002931',
            phases: [
              ...(prev.trajectory?.phases || []),
              ...(isApproved 
                ? [{ agent: 'decision', phase: 'T3' as const, status: 'success' as const, latency_ms: 850, span_id: 'span-decision-3' }] 
                : []
              )
            ],
            finops: { estimated_cost_brl: isApproved ? 0.1205 : 0.0894 }
          }
        }));
      }, 6000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [baseUrl, request_id, amount]);

  // Read active state (either real SSE stream or preview simulation)
  const activeStatus = isSimulated ? simState.status : streamResult.status;
  const activeTrajectory = isSimulated ? simState.trajectory : streamResult.trajectory;
  const activeError = isSimulated ? simState.error : streamResult.error;

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#FAFAFA',
        minHeight: '90vh',
      }}
    >
      {/* Header Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem 2rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
            Acompanhamento da Proposta
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            Solicitação: <strong style={{ color: '#374151' }}>{request_id}</strong> | CPF: {cpf} | Valor: R$ {parseFloat(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isSimulated && (
            <span style={{ fontSize: '0.75rem', color: '#6366F1', backgroundColor: '#EEF2FF', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
              Simulação Frontend
            </span>
          )}
          <StatusBadge status={activeStatus as CreditAnalysisStatus} />
        </div>
      </div>

      {activeError && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          ❌ {activeError}
        </div>
      )}

      {/* Trajectory Timeline section */}
      {activeTrajectory ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <TraceTimeline trajectory={activeTrajectory} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>
              {activeStatus === 'approved' && '🎉 Parabéns! Sua proposta foi pré-aprovada com sucesso pelos agentes de crédito.'}
              {activeStatus === 'rejected' && '❌ Proposta recusada em conformidade com as políticas regulatórias atuais.'}
              {activeStatus === 'hitl_required' && '⏳ Valor acima do limite automático. Sua proposta foi encaminhada para a mesa de crédito (revisão humana).'}
              {(activeStatus === 'pending' || activeStatus === 'analyzing') && '🔄 Processando dados nos turnos multiagentes em tempo real...'}
            </span>
            <CostDisplay cost_brl={activeTrajectory.finops.estimated_cost_brl} />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #4F46E5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem',
            }}
          />
          <h3 style={{ margin: 0, color: '#374151', fontSize: '1.125rem', fontWeight: 600 }}>
            Conectando aos Agentes...
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.875rem' }}>
            Aguardando sinal do orchestrator de crédito para iniciar a análise por turnos.
          </p>
        </div>
      )}
    </div>
  );
}
