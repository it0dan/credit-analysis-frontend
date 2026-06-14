'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { StatusBadge } from '@repo/ui/status-badge';
import { TraceTimeline } from '@repo/ui/trace-timeline';
import { CostDisplay } from '@repo/ui/cost-display';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Tag } from '@repo/ui/tag';
import { Pulse } from '@repo/ui/pulse';
import { ReasoningStream } from '@repo/ui/reasoning-stream';
import { DebugOnly, HumanLabel } from '@repo/ui/debug-context';
import { getAnalysis, updateAnalysis } from '@repo/ui/analysis-history';
import type { AgentCall, AgentTrajectory, CreditAnalysisStatus, ReasoningChunk } from '@repo/types';

type FinalVerdict = 'approved' | 'rejected' | 'hitl_required';
type StreamTrajectory = AgentTrajectory;
type AgentName = 'bureau' | 'documents' | 'risk' | 'compliance' | 'decision';

const AGENTS: AgentName[] = ['bureau', 'documents', 'risk', 'compliance', 'decision'];

const finalMessage: Record<string, string> = {
  approved: 'Aprovado · seu crédito está pronto',
  rejected: 'Não foi possível aprovar agora',
  hitl_required: 'Em análise humana · retornamos em até 24h',
  error: 'Algo deu errado · tente novamente em instantes',
  pending: 'Preparando sua análise',
  analyzing: 'Análise em andamento',
  expired: 'Prazo expirado · inicie uma nova solicitação',
};

const baseReasoning: Record<Exclude<AgentName, 'decision'>, Omit<ReasoningChunk, 'timestamp_ms'>[]> = {
  bureau: [
    { kind: 'thought', text_human: 'Consultando seu CPF no bureau de crédito', text_debug: 'tool=bureau_get_score input=cpf_masked request_id' },
    { kind: 'tool_call', text_human: 'Score recuperado · histórico de 24 meses analisado', text_debug: 'result.score=780 restrictions=[] latency_budget=1500ms' },
    { kind: 'conclusion', text_human: 'Histórico de crédito confirmado', text_debug: 'bureau.status=ok span=bureau' },
  ],
  documents: [
    { kind: 'thought', text_human: 'Validando documentos enviados', text_debug: 'tool=documents_validate inputs=document_urls applicant_name' },
    { kind: 'tool_call', text_human: 'Cruzando dados com base federal', text_debug: 'identity_valid=true income_confirmed=true' },
    { kind: 'conclusion', text_human: 'Documentos confirmados', text_debug: 'documents.status=ok income_source=ocr' },
  ],
  risk: [
    { kind: 'thought', text_human: 'Calculando seu perfil de risco', text_debug: 'tool=risk_evaluate inputs=bureau_score income_value requested_amount' },
    { kind: 'tool_call', text_human: 'Considerando histórico, perfil e valor solicitado', text_debug: 'default_probability=0.04 risk_tier=low' },
    { kind: 'conclusion', text_human: 'Avaliação concluída', text_debug: 'risk.status=ok internal_score=82' },
  ],
  compliance: [
    { kind: 'thought', text_human: 'Conferindo conformidade regulatória', text_debug: 'tool=compliance_check inputs=cpf_masked request_id' },
    { kind: 'tool_call', text_human: 'Verificações KYC e PLD em curso', text_debug: 'kyc=true pld=true lgpd=true' },
    { kind: 'conclusion', text_human: 'Conformidade aprovada', text_debug: 'compliance.status=ok tools=verify_kyc,check_pld,verify_lgpd_consent' },
  ],
};

function decisionReasoning(finalStatus: FinalVerdict): Omit<ReasoningChunk, 'timestamp_ms'>[] {
  const conclusion = finalStatus === 'approved'
    ? { text_human: 'Decisão favorável', text_debug: 'final.status=approved approved_amount=requested_amount' }
    : finalStatus === 'rejected'
      ? { text_human: 'Não aprovada', text_debug: 'final.status=rejected approved_amount=0' }
      : { text_human: 'Encaminhada para análise humana', text_debug: 'final.status=hitl_required reason=threshold_exceeded' };
  return [
    { kind: 'thought', text_human: 'Sintetizando a decisão final', text_debug: 'tool=decision_synthesize inputs=t1,t2,requested_amount' },
    { kind: 'tool_call', text_human: 'Cruzando todos os sinais', text_debug: 'decision_model=explainable_synthesis' },
    { kind: 'conclusion', ...conclusion },
  ];
}

function chunksFor(agent: AgentName, finalStatus: FinalVerdict): ReasoningChunk[] {
  const chunks = agent === 'decision' ? decisionReasoning(finalStatus) : baseReasoning[agent];
  return chunks.map((chunk, index) => ({ ...chunk, timestamp_ms: [300, 900, 1500][index] ?? 1500 }));
}

function phaseFor(agent: AgentName): AgentCall['phase'] {
  if (agent === 'compliance') return 'T2';
  if (agent === 'decision') return 'T3';
  return 'T1';
}

function inferFinalStatus(cpf: string, amount: string): FinalVerdict {
  if (cpf.includes('111') || cpf.includes('222')) return 'rejected';
  return parseFloat(amount) <= 50000 ? 'approved' : 'hitl_required';
}

function toStreamTrajectory(trajectory: AgentTrajectory | StreamTrajectory | null): StreamTrajectory | null {
  if (!trajectory) return null;
  return {
    ...trajectory,
    phases: trajectory.phases.map((phase) => ({ ...phase, reasoning: phase.reasoning ?? [] })),
  };
}

function addOrReplacePhase(trajectory: StreamTrajectory, phase: AgentCall, cost: number): StreamTrajectory {
  const phases = [...trajectory.phases.filter((item) => item.agent !== phase.agent), phase].sort(
    (a, b) => AGENTS.indexOf(a.agent as AgentName) - AGENTS.indexOf(b.agent as AgentName),
  );
  return { ...trajectory, phases, finops: { estimated_cost_brl: cost } };
}

function appendReasoning(trajectory: StreamTrajectory, agent: AgentName, chunk: ReasoningChunk, cost: number): StreamTrajectory {
  return {
    ...trajectory,
    phases: trajectory.phases.map((phase) => phase.agent === agent
      ? { ...phase, reasoning: [...(phase.reasoning ?? []), chunk] }
      : phase),
    finops: { estimated_cost_brl: cost },
  };
}

function completedTrajectory(request_id: string, finalStatus: FinalVerdict, amount: string): StreamTrajectory {
  const cost = finalStatus === 'approved' ? 0.121 : finalStatus === 'rejected' ? 0.104 : 0.132;
  return {
    request_id,
    trace_id: 'tr-local-history',
    finops: { estimated_cost_brl: cost },
    phases: AGENTS.map((agent, index) => ({
      agent,
      phase: phaseFor(agent),
      status: agent === 'decision' && finalStatus === 'hitl_required' ? 'awaiting_human' : 'success',
      latency_ms: 1200 + index * 180,
      span_id: `span-${agent}-retro`,
      reasoning: chunksFor(agent, finalStatus),
    })),
  };
}

export default function CustomerStatusPage() {
  const { request_id } = useParams();
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf') || 'XXX.XXX.XXX-XX';
  const amount = searchParams.get('amount') || '50000';
  const reqIdStr = (Array.isArray(request_id) ? request_id[0] : request_id) || 'req-xyz';
  const amountValue = Number.isFinite(parseFloat(amount)) ? parseFloat(amount) : 0;
  const amountLabel = amountValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const [status, setStatus] = useState<CreditAnalysisStatus>('pending');
  const [trajectory, setTrajectory] = useState<StreamTrajectory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [instantFinal, setInstantFinal] = useState<FinalVerdict | null>(null);

  const [simState, setSimState] = useState({
    status: 'pending' as CreditAnalysisStatus,
    trajectory: null as StreamTrajectory | null,
    error: null as string | null,
  });

  useEffect(() => {
    let active = true;
    let pollTimer: NodeJS.Timeout;
    let failureCount = 0;

    if (reqIdStr.startsWith('test-') || reqIdStr.startsWith('polish-')) {
      setStatus('analyzing');
      setTrajectory(null);
      setError(null);
      setInstantFinal(null);
      setIsSimulated(true);
      return () => {
        active = false;
        clearTimeout(pollTimer);
      };
    }

    const hydrateFromLocalFinal = () => {
      const stored = getAnalysis(reqIdStr);
      if (stored?.final_verdict) {
        setInstantFinal(stored.final_verdict);
        setIsSimulated(true);
        setError(null);
        return true;
      }
      return false;
    };

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
          updateAnalysis(reqIdStr, {
            last_status: data.status,
            ...(['approved', 'rejected', 'hitl_required'].includes(data.status) ? { final_verdict: data.status } : {}),
          });
          if (data.status === 'pending' || data.status === 'analyzing') {
            pollTimer = setTimeout(poll, 2000);
          }
        })
        .catch((err) => {
          if (!active) return;
          console.warn('[Status] Polling failed, retrying...', err);
          if (hydrateFromLocalFinal()) return;
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

    const finalStatus = instantFinal ?? inferFinalStatus(cpf, amount);
    const finalCost = finalStatus === 'approved' ? 0.121 : finalStatus === 'rejected' ? 0.104 : 0.132;
    const base: StreamTrajectory = {
      request_id: reqIdStr,
      trace_id: instantFinal ? 'tr-local-history' : 'tr-mock-1002931',
      phases: [],
      finops: { estimated_cost_brl: 0 },
    };

    if (instantFinal) {
      setSimState({ status: instantFinal, error: null, trajectory: completedTrajectory(reqIdStr, instantFinal, amount) });
      return;
    }

    const timings: Record<AgentName, { start: number; cost: number }> = {
      bureau: { start: 0, cost: 0.012 },
      documents: { start: 1800, cost: 0.030 },
      risk: { start: 3600, cost: 0.058 },
      compliance: { start: 5400, cost: 0.089 },
      decision: { start: 7200, cost: finalCost },
    };

    setSimState({ status: 'analyzing', error: null, trajectory: base });

    const timers: number[] = [];
    AGENTS.forEach((agent, index) => {
      const timing = timings[agent];
      const spanId = `span-${agent}-${index}`;
      timers.push(window.setTimeout(() => {
        setSimState((prev) => {
          const current = prev.trajectory ?? base;
          return {
            status: 'analyzing',
            error: null,
            trajectory: addOrReplacePhase(current, {
              agent,
              phase: phaseFor(agent),
              status: 'in_progress',
              latency_ms: 0,
              span_id: spanId,
              reasoning: [],
            }, timing.cost),
          };
        });
      }, timing.start));

      chunksFor(agent, finalStatus).forEach((chunk) => {
        timers.push(window.setTimeout(() => {
          setSimState((prev) => {
            const current = prev.trajectory ?? base;
            return {
              status: 'analyzing',
              error: null,
              trajectory: appendReasoning(current, agent, chunk, timing.cost),
            };
          });
        }, timing.start + chunk.timestamp_ms));
      });

      timers.push(window.setTimeout(() => {
        setSimState((prev) => {
          const current = prev.trajectory ?? base;
          const nextStatus = agent === 'decision' && finalStatus === 'hitl_required' ? 'awaiting_human' : 'success';
          return {
            status: 'analyzing',
            error: null,
            trajectory: addOrReplacePhase(current, {
              agent,
              phase: phaseFor(agent),
              status: nextStatus,
              latency_ms: 1700,
              span_id: spanId,
              reasoning: current.phases.find((phase) => phase.agent === agent)?.reasoning ?? chunksFor(agent, finalStatus),
            }, timing.cost),
          };
        });
      }, timing.start + 1700));
    });

    timers.push(window.setTimeout(() => {
      setSimState((prev) => ({
        status: finalStatus,
        error: null,
        trajectory: prev.trajectory ?? completedTrajectory(reqIdStr, finalStatus, amount),
      }));
    }, 9500));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isSimulated, reqIdStr, amount, cpf, instantFinal]);

  const activeStatus = isSimulated ? simState.status : status;
  const activeTrajectory = isSimulated ? simState.trajectory : trajectory;
  const activeError = isSimulated ? simState.error : error;
  const isTerminal = !['pending', 'analyzing'].includes(activeStatus);
  const debugTrajectory = useMemo(() => activeTrajectory ? activeTrajectory : null, [activeTrajectory]);

  useEffect(() => {
    updateAnalysis(reqIdStr, {
      last_status: activeStatus,
      ...(['approved', 'rejected', 'hitl_required'].includes(activeStatus) ? { final_verdict: activeStatus as FinalVerdict } : {}),
    });
  }, [activeStatus, reqIdStr]);

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
              }}
            >
              Análise em <span style={{ color: 'var(--acc)' }}>tempo real</span>
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              <HumanLabel
                human={<span>CPF: {cpf} · Valor: {amountLabel}</span>}
                debug={<span>ID: <strong style={{ color: 'var(--blue)' }}>{reqIdStr}</strong>{' | '}CPF: {cpf}{' | '}Valor: <strong style={{ color: 'var(--text)' }}>{amountLabel}</strong></span>}
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
            <ReasoningStream phases={activeTrajectory.phases} analysisStatus={activeStatus as CreditAnalysisStatus} isLive={activeStatus === 'analyzing'} />

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
