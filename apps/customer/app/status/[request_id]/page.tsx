'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { StatusBadge } from '@repo/ui/status-badge';
import { TraceTimeline } from '@repo/ui/trace-timeline';
import { CostDisplay } from '@repo/ui/cost-display';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Tag } from '@repo/ui/tag';
import { Pulse } from '@repo/ui/pulse';
import { AgentStream, type AgentStreamPhase } from '@repo/ui/agent-stream';
import { DebugOnly, HumanLabel } from '@repo/ui/debug-context';
import type { AgentTrajectory, CreditAnalysisStatus } from '@repo/types';

type StreamTrajectory = Omit<AgentTrajectory, 'phases'> & { phases: AgentStreamPhase[] };

const finalMessage: Record<string, string> = {
  approved: 'Aprovado · seu crédito está pronto',
  rejected: 'Não foi possível aprovar agora',
  hitl_required: 'Em análise humana · retornamos em até 24h',
  error: 'Algo deu errado · tente novamente em instantes',
  pending: 'Preparando sua análise',
  analyzing: 'Análise em andamento',
  expired: 'Prazo expirado · inicie uma nova solicitação',
};

function toStreamTrajectory(trajectory: AgentTrajectory | StreamTrajectory | null): StreamTrajectory | null {
  if (!trajectory) return null;
  return {
    ...trajectory,
    phases: trajectory.phases.map((phase) => ({ ...phase, status: phase.status as AgentStreamPhase['status'] })),
  };
}

function toDebugTrajectory(trajectory: StreamTrajectory): AgentTrajectory {
  return {
    ...trajectory,
    phases: trajectory.phases
      .map((phase) => ({
        agent: phase.agent,
        phase: phase.phase,
        status: phase.status as AgentTrajectory['phases'][number]['status'],
        latency_ms: phase.latency_ms ?? 0,
        span_id: phase.span_id,
      })),
  };
}

export default function CustomerStatusPage() {
  const { request_id } = useParams();
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf') || 'XXX.XXX.XXX-XX';
  const amount = searchParams.get('amount') || '50000';

  const reqIdStr = (Array.isArray(request_id) ? request_id[0] : request_id) || 'req-xyz';

  const [status, setStatus] = useState<CreditAnalysisStatus>('pending');
  const [trajectory, setTrajectory] = useState<StreamTrajectory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  const [simState, setSimState] = useState({
    status: 'pending' as CreditAnalysisStatus,
    trajectory: null as StreamTrajectory | null,
    error: null as string | null,
  });

  useEffect(() => {
    let active = true;
    let pollTimer: NodeJS.Timeout;
    let failureCount = 0;

    if (reqIdStr.startsWith('test-')) {
      setStatus('analyzing');
      setTrajectory(null);
      setError(null);
      setIsSimulated(true);
      return () => {
        active = false;
        clearTimeout(pollTimer);
      };
    }

    const poll = () => {
      fetch(`http://localhost:8086/analysis/${reqIdStr}/status`)
        .then((res) => {
          if (!res.ok) throw new Error('Falha ao consultar status.');
          return res.json();
        })
        .then((data) => {
          if (!active) return;
          failureCount = 0;
          setStatus(data.status);
          setTrajectory(toStreamTrajectory(data.trajectory));
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
          if (failureCount >= 3) {
            setIsSimulated(true);
            setError(null);
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

  useEffect(() => {
    if (!isSimulated) return;

    const approved = parseFloat(amount) <= 50000;
    const base: StreamTrajectory = {
      request_id: reqIdStr,
      trace_id: 'tr-mock-1002931',
      phases: [],
      finops: { estimated_cost_brl: 0 },
    };
    const sequence = ['bureau', 'documents', 'risk', 'compliance', 'decision'] as const;
    const timings: Record<(typeof sequence)[number], { start: number; duration: number; cost: number }> = {
      bureau: { start: 0, duration: 1400, cost: 0.012 },
      documents: { start: 1500, duration: 1200, cost: 0.018 },
      risk: { start: 2800, duration: 1600, cost: 0.045 },
      compliance: { start: 4500, duration: 2000, cost: 0.089 },
      decision: { start: 6600, duration: 1100, cost: approved ? 0.121 : 0.104 },
    };
    const phaseFor = (index: number): AgentStreamPhase['phase'] => (index < 3 ? 'T1' : index === 3 ? 'T2' : 'T3');
    const addOrReplacePhase = (trajectory: StreamTrajectory, phase: AgentStreamPhase, cost: number): StreamTrajectory => ({
      ...trajectory,
      phases: [...trajectory.phases.filter((item) => item.agent !== phase.agent), phase],
      finops: { estimated_cost_brl: cost },
    });

    setSimState({ status: 'analyzing', error: null, trajectory: base });

    const timers: number[] = [];
    sequence.forEach((agent, index) => {
      const timing = timings[agent];
      const phase = phaseFor(index);
      const spanId = `span-${agent}-${index}`;

      timers.push(window.setTimeout(() => {
        setSimState((prev) => {
          const current = prev.trajectory ?? base;
          return {
            status: 'analyzing',
            error: null,
            trajectory: addOrReplacePhase(current, {
              agent,
              phase,
              status: 'in_progress',
              latency_ms: 0,
              span_id: spanId,
              cost_brl: timing.cost,
            }, timing.cost),
          };
        });
      }, timing.start));

      timers.push(window.setTimeout(() => {
        setSimState((prev) => {
          const current = prev.trajectory ?? base;
          return {
            status: 'analyzing',
            error: null,
            trajectory: addOrReplacePhase(current, {
              agent,
              phase,
              status: 'success',
              latency_ms: timing.duration,
              span_id: spanId,
              cost_brl: timing.cost,
            }, timing.cost),
          };
        });
      }, timing.start + timing.duration));
    });

    timers.push(window.setTimeout(() => {
      setSimState((prev) => {
        const current = prev.trajectory ?? base;
        const finalTrajectory = approved ? current : addOrReplacePhase(current, {
          agent: 'decision',
          phase: 'T3',
          status: 'awaiting_human',
          latency_ms: timings.decision.duration,
          span_id: 'span-decision-4',
          cost_brl: timings.decision.cost,
        }, timings.decision.cost);
        return {
          status: approved ? 'approved' : 'hitl_required',
          error: null,
          trajectory: finalTrajectory,
        };
      });
    }, 8000));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isSimulated, reqIdStr, amount]);

  const activeStatus = isSimulated ? simState.status : status;
  const activeTrajectory = isSimulated ? simState.trajectory : trajectory;
  const activeError = isSimulated ? simState.error : error;
  const isTerminal = !['pending', 'analyzing'].includes(activeStatus);
  const debugTrajectory = useMemo(() => activeTrajectory ? toDebugTrajectory(activeTrajectory) : null, [activeTrajectory]);

  return (
    <CockpitLayout activeLink="status" portalType="customer" request_id={reqIdStr} liveState={isTerminal ? 'concluded' : 'live'}>
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--surf)',
            padding: '1.5rem 2rem',
            border: '1px solid var(--line)',
            borderLeft: '2px solid var(--acc)',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <Tag dim="live">análise em curso</Tag>
            <h1
              style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: 200,
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-0.02em',
              }}
            >
              Análise em <span style={{ color: 'var(--acc)' }}>tempo real</span>
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              <HumanLabel
                human={<span>CPF: {cpf} · Valor solicitado confirmado</span>}
                debug={<span>ID: <strong style={{ color: 'var(--blue)' }}>{reqIdStr}</strong>{' | '}CPF: {cpf}{' | '}Valor: <strong style={{ color: 'var(--text)' }}>R$ {parseFloat(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>}
              />
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(activeStatus === 'pending' || activeStatus === 'analyzing') && <Pulse color="acc" size={7} label="ao vivo" />}
            {isSimulated && (
              <DebugOnly>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--warn)',
                    border: '1px solid var(--warn)',
                    padding: '0.2rem 0.5rem',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--ls-label)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Simulação Fallback
                </span>
              </DebugOnly>
            )}
            <StatusBadge status={activeStatus as CreditAnalysisStatus} />
          </div>
        </div>

        {activeError && (
          <div
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--alert)',
              borderLeft: '2px solid var(--alert)',
              color: 'var(--alert)',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ! Algo deu errado · tente novamente em instantes
          </div>
        )}

        {activeTrajectory ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AgentStream phases={activeTrajectory.phases} status={activeStatus as CreditAnalysisStatus} mode="customer" isLive={activeStatus === 'analyzing'} />

            <DebugOnly>
              {debugTrajectory && <TraceTimeline trajectory={debugTrajectory} />}
            </DebugOnly>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--surf)',
                padding: '1.25rem 1.75rem',
                border: '1px solid var(--line)',
                borderLeft: '2px solid var(--acc)',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '0.875rem', color: 'var(--text)', flex: 1, minWidth: '280px' }}>
                <span style={{ color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>→</span>{' '}
                {finalMessage[activeStatus] ?? 'Análise em andamento'}
              </span>
              <DebugOnly>
                <CostDisplay cost_brl={activeTrajectory.finops.estimated_cost_brl} />
              </DebugOnly>
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
              backgroundColor: 'var(--surf)',
              border: '1px solid var(--line)',
              borderLeft: '2px solid var(--acc)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid var(--line2)',
                borderTop: '1px solid var(--acc)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1.25rem',
              }}
            />
            <h3
              style={{
                margin: 0,
                color: 'var(--text)',
                fontSize: '1rem',
                fontWeight: 200,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Preparando sua análise...
            </h3>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text)', fontSize: '0.85rem' }}>
              Estamos conectando as etapas de verificação para acompanhar tudo em tempo real.
            </p>
          </div>
        )}
      </div>
    </CockpitLayout>
  );
}
