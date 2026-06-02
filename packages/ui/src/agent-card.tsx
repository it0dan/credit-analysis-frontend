import React from 'react';
import type { AgentCall } from '@repo/types';

interface AgentCardProps {
  agent: AgentCall;
}

export function AgentCard({ agent }: AgentCardProps) {
  const statusColors = {
    success: {
      dot: 'hsl(142, 76%, 45%)',
      bg: 'hsla(142, 76%, 45%, 0.06)',
      border: 'hsla(142, 76%, 45%, 0.2)',
      text: 'hsl(142, 76%, 60%)',
      glow: '0 0 15px hsla(142, 76%, 45%, 0.2)',
    },
    fail: {
      dot: 'hsl(346, 84%, 61%)',
      bg: 'hsla(346, 84%, 61%, 0.06)',
      border: 'hsla(346, 84%, 61%, 0.2)',
      text: 'hsl(346, 84%, 70%)',
      glow: '0 0 15px hsla(346, 84%, 61%, 0.2)',
    },
    timeout: {
      dot: 'hsl(38, 92%, 50%)',
      bg: 'hsla(38, 92%, 50%, 0.06)',
      border: 'hsla(38, 92%, 50%, 0.2)',
      text: 'hsl(38, 92%, 65%)',
      glow: '0 0 15px hsla(38, 92%, 50%, 0.2)',
    },
  };

  const colors = statusColors[agent.status] || statusColors.success;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        borderRadius: '12px',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.glow,
        minWidth: '220px',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
        cursor: 'default',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 10px 20px -5px rgba(0, 0, 0, 0.4), ${colors.glow}`;
        e.currentTarget.style.borderColor = colors.text;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = colors.glow;
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span 
          style={{ 
            fontWeight: 700, 
            fontSize: '1rem', 
            color: 'hsl(210, 40%, 98%)',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {agent.agent}
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            backgroundColor: 'hsla(223, 47%, 8%, 0.6)',
            border: '1px solid hsla(217, 91%, 60%, 0.15)',
            color: 'hsl(217, 91%, 60%)',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {agent.phase}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colors.dot,
            display: 'inline-block',
            boxShadow: `0 0 8px ${colors.dot}`,
          }}
        />
        <span style={{ fontSize: '0.825rem', textTransform: 'capitalize', color: colors.text, fontWeight: 600 }}>
          {agent.status}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px solid hsla(0, 0%, 100%, 0.05)', paddingTop: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'hsl(215, 20%, 75%)' }}>Latência:</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'hsl(210, 40%, 98%)' }}>
          {agent.latency_ms} ms
        </span>
      </div>

      {agent.span_id && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'hsl(215, 16%, 50%)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: 'hsla(223, 47%, 8%, 0.4)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
          Span: {agent.span_id}
        </div>
      )}
    </div>
  );
}
