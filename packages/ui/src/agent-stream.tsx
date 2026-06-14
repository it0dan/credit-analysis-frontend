'use client';

import React, { useMemo } from 'react';
import type { CreditAnalysisStatus } from '@repo/types';
import { Pulse } from './pulse';
import { useDebug } from './debug-context';

export type AgentStreamStatus =
  | 'queued'
  | 'in_progress'
  | 'thinking'
  | 'tool_call'
  | 'result'
  | 'success'
  | 'done'
  | 'awaiting_human'
  | 'fail'
  | 'timeout'
  | 'error';

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

type VisualStatus = 'queued' | 'in_progress' | 'success' | 'awaiting_human' | 'error';

const AGENTS = ['bureau', 'documents', 'risk', 'compliance', 'decision'];

const humanLabels: Record<string, string> = {
  bureau: 'Verificando seu histórico de crédito',
  documents: 'Confirmando documentos',
  risk: 'Avaliando seu perfil',
  compliance: 'Conferindo conformidade',
  decision: 'Concluindo análise',
};

const badgeText: Record<VisualStatus, string> = {
  queued: 'NA FILA',
  in_progress: 'PROCESSANDO',
  success: 'CONCLUÍDO',
  awaiting_human: 'AGUARDANDO HUMANO',
  error: 'ERRO',
};

function normalizeStatus(status: AgentStreamStatus): VisualStatus {
  if (status === 'in_progress' || status === 'thinking' || status === 'tool_call' || status === 'result') return 'in_progress';
  if (status === 'success' || status === 'done') return 'success';
  if (status === 'awaiting_human') return 'awaiting_human';
  if (status === 'fail' || status === 'timeout' || status === 'error') return 'error';
  return 'queued';
}

function colorFor(status: VisualStatus) {
  if (status === 'success' || status === 'in_progress') return 'var(--acc)';
  if (status === 'awaiting_human') return 'var(--warn)';
  if (status === 'error') return 'var(--alert)';
  return 'var(--muted)';
}

function iconFor(status: VisualStatus) {
  if (status === 'success') return <span style={{ color: 'var(--acc)' }}>✓</span>;
  if (status === 'awaiting_human') return <span style={{ color: 'var(--warn)' }}>~</span>;
  if (status === 'error') return <span style={{ color: 'var(--alert)' }}>×</span>;
  if (status === 'in_progress') return <Pulse color="acc" size={7} />;
  return <span style={{ color: 'var(--muted)' }}>·</span>;
}

function TypingCursor() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '2px',
        height: '10px',
        marginLeft: '8px',
        background: 'var(--acc)',
        animation: 'blink 700ms steps(2, start) infinite',
        verticalAlign: '-1px',
      }}
    />
  );
}

export function AgentStream({ phases, mode }: AgentStreamProps) {
  const { enabled } = useDebug();
  const showTechnical = mode === 'operator' || enabled;

  const rows = useMemo(() => {
    const latestByAgent = new Map<string, AgentStreamPhase>();
    phases.forEach((phase) => latestByAgent.set(phase.agent, phase));

    return AGENTS.map((agent) => {
      const phase = latestByAgent.get(agent);
      return { agent, phase, status: normalizeStatus(phase?.status ?? 'queued') };
    });
  }, [phases]);

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
        const labelColor = rowStatus === 'queued' ? 'var(--muted)' : 'var(--text)';
        return (
          <div
            key={agent}
            style={{
              display: 'grid',
              gridTemplateColumns: showTechnical ? '24px 120px 56px 72px 1fr 96px' : '24px minmax(0, 1fr) 156px',
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
                <span style={{ color: labelColor }}>{agent}</span>
                <span style={{ color: phase ? 'var(--acc)' : 'var(--line2)' }}>{phase?.phase ?? '--'}</span>
                <span style={{ color: phase?.latency_ms ? 'var(--text)' : 'var(--line2)' }}>{phase?.latency_ms ? `${phase.latency_ms}ms` : '--'}</span>
                <span style={{ color: phase?.span_id ? 'var(--muted)' : 'var(--line2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {phase?.span_id ?? 'span: pending'}
                </span>
                <span style={{ color: phase?.cost_brl ? 'var(--acc)' : 'var(--line2)' }}>
                  {phase?.cost_brl ? `R$ ${phase.cost_brl.toFixed(3)}` : badgeText[rowStatus]}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: labelColor, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {humanLabels[agent] ?? agent}
                </span>
                <span style={{ color: lineColor, textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontSize: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {badgeText[rowStatus]}
                  {rowStatus === 'in_progress' && <TypingCursor />}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
