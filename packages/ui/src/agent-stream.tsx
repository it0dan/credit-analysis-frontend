'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { CreditAnalysisStatus } from '@repo/types';
import { Pulse } from './pulse';
import { useDebug } from './debug-context';

export type AgentStreamStatus = 'queued' | 'thinking' | 'tool_call' | 'result' | 'success' | 'done' | 'fail' | 'timeout' | 'error';

export interface AgentStreamPhase {
  agent: string;
  phase: 'T1' | 'T2' | 'T3';
  status: AgentStreamStatus;
  latency_ms?: number;
  span_id?: string;
  cost_brl?: number;
  detail?: string;
}

interface AgentStreamProps {
  phases: AgentStreamPhase[];
  status: CreditAnalysisStatus;
  mode: 'customer' | 'operator';
  isLive: boolean;
}

const AGENTS = ['bureau', 'documents', 'risk', 'compliance', 'decision'];

const humanLabels: Record<string, string> = {
  bureau: 'Verificando seu histórico de crédito',
  documents: 'Confirmando documentos',
  risk: 'Avaliando seu perfil',
  compliance: 'Conferindo conformidade',
  decision: 'Concluindo análise',
};

const statusText: Record<string, string> = {
  queued: 'na fila',
  thinking: 'analisando',
  tool_call: 'consultando dados',
  result: 'resultado recebido',
  success: 'concluído',
  done: 'concluído',
  fail: 'atenção',
  timeout: 'tempo excedido',
  error: 'erro',
};

function normalizeStatus(status: AgentStreamStatus, isNewest: boolean, isLive: boolean): AgentStreamStatus {
  if (isLive && isNewest && (status === 'success' || status === 'done')) return 'thinking';
  if (status === 'success') return 'done';
  if (status === 'fail' || status === 'timeout') return 'error';
  return status;
}

function iconFor(status: AgentStreamStatus) {
  if (status === 'done') return <span style={{ color: 'var(--acc)' }}>✓</span>;
  if (status === 'error') return <span style={{ color: 'var(--alert)' }}>×</span>;
  if (status === 'thinking' || status === 'tool_call') return <Pulse color={status === 'tool_call' ? 'blue' : 'acc'} size={7} />;
  if (status === 'result') return <span style={{ color: 'var(--acc)' }}>→</span>;
  return <span style={{ color: 'var(--line2)' }}>·</span>;
}

function colorFor(status: AgentStreamStatus) {
  if (status === 'done' || status === 'result') return 'var(--acc)';
  if (status === 'tool_call') return 'var(--blue)';
  if (status === 'error') return 'var(--alert)';
  if (status === 'thinking') return 'var(--text)';
  return 'var(--muted)';
}

export function AgentStream({ phases, status, mode, isLive }: AgentStreamProps) {
  const { enabled } = useDebug();
  const [tick, setTick] = useState(0);
  const showTechnical = mode === 'operator' || enabled;

  useEffect(() => {
    if (!isLive) return;
    const id = window.setInterval(() => setTick((value) => value + 1), 1500);
    return () => window.clearInterval(id);
  }, [isLive]);

  const rows = useMemo(() => {
    const latestByAgent = new Map<string, AgentStreamPhase>();
    phases.forEach((phase) => latestByAgent.set(phase.agent, phase));
    const newest = phases[phases.length - 1];
    const completed = AGENTS.filter((agent) => latestByAgent.has(agent)).length;
    const optimisticAgent = isLive ? AGENTS[Math.min(completed, AGENTS.length - 1)] : undefined;

    return AGENTS.map((agent) => {
      const phase = latestByAgent.get(agent);
      const isNewest = Boolean(newest && newest.agent === agent);
      const optimistic = !phase && optimisticAgent === agent && tick > 0;
      const rawStatus = optimistic ? 'thinking' : phase?.status ?? 'queued';
      const normalized = normalizeStatus(rawStatus, isNewest, isLive);
      return { agent, phase, status: normalized };
    });
  }, [phases, isLive, tick]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'var(--surf)',
        border: '1px solid var(--line)',
        borderLeft: '2px solid var(--acc)',
        padding: '1.25rem',
      }}
    >
      {rows.map(({ agent, phase, status: rowStatus }) => {
        const lineColor = colorFor(rowStatus);
        return (
          <div
            key={agent}
            style={{
              display: 'grid',
              gridTemplateColumns: showTechnical ? '24px 120px 56px 72px 1fr 80px' : '24px minmax(0, 1fr) 140px',
              gap: '0.75rem',
              alignItems: 'center',
              padding: '0.7rem 0.85rem',
              border: '1px solid var(--line)',
              borderLeft: `1px solid ${lineColor}`,
              color: lineColor,
              fontFamily: 'var(--font-mono)',
              animation: 'fadeIn 0.28s ease-out',
              minHeight: '48px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{iconFor(rowStatus)}</span>
            {showTechnical ? (
              <>
                <span style={{ color: 'var(--text)' }}>{agent}</span>
                <span style={{ color: phase ? 'var(--acc)' : 'var(--line2)' }}>{phase?.phase ?? '--'}</span>
                <span style={{ color: phase?.latency_ms ? 'var(--text)' : 'var(--line2)' }}>{phase?.latency_ms ? `${phase.latency_ms}ms` : '--'}</span>
                <span style={{ color: phase?.span_id ? 'var(--muted)' : 'var(--line2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {phase?.span_id ?? 'span: pending'}
                </span>
                <span style={{ color: phase?.cost_brl ? 'var(--acc)' : 'var(--line2)' }}>
                  {phase?.cost_brl ? `R$ ${phase.cost_brl.toFixed(3)}` : '--'}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: rowStatus === 'queued' ? 'var(--muted)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {humanLabels[agent] ?? agent}
                  {(rowStatus === 'thinking' || rowStatus === 'tool_call') && (
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '11px',
                        marginLeft: '8px',
                        background: 'var(--acc)',
                        animation: 'blink 700ms steps(2, start) infinite',
                        verticalAlign: '-1px',
                      }}
                    />
                  )}
                </span>
                <span style={{ color: lineColor, textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontSize: '10px', textAlign: 'right' }}>
                  {statusText[rowStatus] ?? rowStatus}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
