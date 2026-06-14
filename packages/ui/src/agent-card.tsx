import React from 'react';
import type { AgentCall } from '@repo/types';

interface AgentCardProps {
  agent: AgentCall;
}

const statusColors: Record<string, { dot: string; border: string; text: string }> = {
  success: { dot: 'var(--acc)',   border: 'var(--acc)',   text: 'var(--acc)'   },
  fail:    { dot: 'var(--alert)', border: 'var(--alert)', text: 'var(--alert)' },
  timeout: { dot: 'var(--warn)',  border: 'var(--warn)',  text: 'var(--warn)'  },
};

const DEFAULT_COLORS = { dot: 'var(--acc)', border: 'var(--acc)', text: 'var(--acc)' };

export function AgentCard({ agent }: AgentCardProps) {
  const colors = statusColors[agent.status] ?? DEFAULT_COLORS;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        border: `1px solid var(--line2)`,
        borderLeft: `2px solid ${colors.border}`,
        minWidth: '200px',
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'var(--surf)',
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = colors.border; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--line2)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
          {agent.agent}
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 400,
            padding: '0.15rem 0.4rem',
            border: '1px solid var(--line2)',
            color: 'var(--blue)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--ls-label)',
          }}
        >
          {agent.phase}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: colors.dot,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: colors.text, letterSpacing: 'var(--ls-label)' }}>
          {agent.status}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid var(--line)', paddingTop: '0.6rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Latência:</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
          {agent.latency_ms} ms
        </span>
      </div>

      {agent.span_id && (
        <div style={{ marginTop: '0.4rem', fontSize: '0.65rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          span: {agent.span_id}
        </div>
      )}
    </div>
  );
}
