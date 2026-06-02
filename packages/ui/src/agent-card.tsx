import React from 'react';
import type { AgentCall } from '@repo/types';

interface AgentCardProps {
  agent: AgentCall;
}

export function AgentCard({ agent }: AgentCardProps) {
  const statusColors = {
    success: {
      dot: '#10B981',
      bg: '#F0FDF4',
      border: '#E6F4EA',
      text: '#065F46',
    },
    fail: {
      dot: '#EF4444',
      bg: '#FEF2F2',
      border: '#FCE8E6',
      text: '#991B1B',
    },
    timeout: {
      dot: '#F59E0B',
      bg: '#FFFBEB',
      border: '#FEF3C7',
      text: '#92400E',
    },
  };

  const colors = statusColors[agent.status] || statusColors.success;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        minWidth: '200px',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 600, fontSize: '1rem', color: '#111827' }}>
          {agent.agent}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.125rem 0.375rem',
            borderRadius: '4px',
            backgroundColor: '#E5E7EB',
            color: '#374151',
          }}
        >
          {agent.phase}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colors.dot,
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '0.875rem', textTransform: 'capitalize', color: colors.text, fontWeight: 500 }}>
          {agent.status}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Latency:</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937' }}>
          {agent.latency_ms} ms
        </span>
      </div>

      {agent.span_id && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#9CA3AF', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Span: {agent.span_id}
        </div>
      )}
    </div>
  );
}
