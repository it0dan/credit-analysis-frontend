'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { StatusBadge } from '@repo/ui/status-badge';
import { TraceTimeline } from '@repo/ui/trace-timeline';
import { CostDisplay } from '@repo/ui/cost-display';
import type { AgentTrajectory, CreditAnalysisStatus } from '@repo/types';

export default function CustomerStatusPage() {
  const { request_id } = useParams();
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf') || 'XXX.XXX.XXX-XX';
  const amount = searchParams.get('amount') || '50000';

  const reqIdStr = (Array.isArray(request_id) ? request_id[0] : request_id) || 'req-xyz';

  // Live polling state
  const [status, setStatus] = useState<CreditAnalysisStatus>('pending');
  const [trajectory, setTrajectory] = useState<AgentTrajectory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  // local simulation state for fallback previewing flow in development mode
  const [simState, setSimState] = useState({
    status: 'pending',
    trajectory: null as AgentTrajectory | null,
    error: null as string | null,
  });

  // Effect for live polling from Python backend on port 8086
  useEffect(() => {
    let active = true;
    let pollTimer: NodeJS.Timeout;
    let failureCount = 0;

    const poll = () => {
      fetch(`http://localhost:8086/analysis/${reqIdStr}/status`)
        .then((res) => {
          if (!res.ok) throw new Error('Falha ao consultar status.');
          return res.json();
        })
        .then((data) => {
          if (!active) return;
          failureCount = 0; // reset
          setStatus(data.status);
          setTrajectory(data.trajectory);
          setError(null);
          setIsSimulated(false);

          if (data.status === 'pending' || data.status === 'analyzing') {
            pollTimer = setTimeout(poll, 2000);
          }
        })
        .catch((err) => {
          if (!active) return;
          console.warn('[Status] Polling failed, retrying...', err);
          failureCount++;
          
          // If server fails 3 times, fall back to simulated experience
          if (failureCount >= 3) {
            console.warn('[Status] Backend unreachable. Activating simulated fallback.');
            setIsSimulated(true);
            setError(null); // Clear connection error to show smooth mock
          } else {
            pollTimer = setTimeout(poll, 2000);
          }
        });
    };

    poll();

    return () => {
      active = false;
      clearTimeout(pollTimer);
    };
  }, [reqIdStr]);

  // Fallback Simulation Scaffolding
  useEffect(() => {
    if (isSimulated) {
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
  }, [isSimulated, reqIdStr, amount]);

  // Read active state (either real polling or preview simulation fallback)
  const activeStatus = isSimulated ? simState.status : status;
  const activeTrajectory = isSimulated ? simState.trajectory : trajectory;
  const activeError = isSimulated ? simState.error : error;

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '3rem 2rem',
        minHeight: '90vh',
        animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Header Info - Premium Glass Panel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'hsla(223, 47%, 12%, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '1.75rem 2.25rem',
          borderRadius: '16px',
          border: '1px solid hsla(217, 91%, 60%, 0.15)',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px hsla(0, 0%, 100%, 0.05)',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <h1 
            style={{ 
              margin: 0, 
              fontSize: '1.65rem', 
              fontWeight: 800, 
              color: 'hsl(210, 40%, 98%)',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            Acompanhamento da Proposta
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.9rem', color: 'hsl(215, 20%, 75%)' }}>
            ID Proposta: <strong style={{ color: 'hsl(217, 91%, 70%)', fontFamily: 'monospace' }}>{reqIdStr}</strong> | CPF: <span style={{ fontFamily: 'monospace' }}>{cpf}</span> | Valor: <strong style={{ color: 'hsl(210, 40%, 98%)' }}>R$ {parseFloat(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isSimulated && (
            <span 
              style={{ 
                fontSize: '0.7rem', 
                color: 'hsl(217, 91%, 65%)', 
                backgroundColor: 'hsla(217, 91%, 60%, 0.12)', 
                border: '1px solid hsla(217, 91%, 60%, 0.25)', 
                padding: '0.3rem 0.6rem', 
                borderRadius: '6px', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: "'Outfit', sans-serif" 
              }}
            >
              Simulação Fallback
            </span>
          )}
          <StatusBadge status={activeStatus as CreditAnalysisStatus} />
        </div>
      </div>

      {activeError && (
        <div
          className="glow-pulse-rose"
          style={{
            backgroundColor: 'hsla(346, 84%, 61%, 0.1)',
            border: '1px solid hsla(346, 84%, 61%, 0.35)',
            color: 'hsl(346, 84%, 70%)',
            padding: '1.25rem 1.75rem',
            borderRadius: '12px',
            marginBottom: '2.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          ❌ {activeError}
        </div>
      )}

      {/* Trajectory Timeline section */}
      {activeTrajectory ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <TraceTimeline trajectory={activeTrajectory} />
          
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: 'hsla(223, 47%, 12%, 0.5)', 
              padding: '1.25rem 2rem', 
              borderRadius: '16px', 
              border: '1px solid hsla(217, 91%, 60%, 0.12)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <span style={{ fontSize: '0.9rem', color: 'hsl(215, 20%, 85%)', fontWeight: 500, flex: 1, minWidth: '280px' }}>
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
            padding: '6rem 4rem',
            backgroundColor: 'hsla(223, 47%, 12%, 0.4)',
            borderRadius: '16px',
            border: '1px solid hsla(217, 91%, 60%, 0.1)',
            textAlign: 'center',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              border: '3px solid hsla(217, 91%, 60%, 0.15)',
              borderTop: '3px solid hsl(217, 91%, 60%)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem',
              boxShadow: '0 0 15px hsla(217, 91%, 60%, 0.15)',
            }}
          />
          <h3 
            style={{ 
              margin: 0, 
              color: 'hsl(210, 40%, 98%)', 
              fontSize: '1.25rem', 
              fontWeight: 700, 
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Conectando aos Agentes...
          </h3>
          <p style={{ margin: '0.4rem 0 0 0', color: 'hsl(215, 20%, 75%)', fontSize: '0.875rem' }}>
            Aguardando sinal do orquestrador de crédito para iniciar a análise por turnos cognitivos.
          </p>
        </div>
      )}
    </div>
  );
}
