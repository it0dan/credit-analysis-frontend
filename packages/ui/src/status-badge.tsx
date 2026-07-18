import React from 'react';
import type { CreditAnalysisStatus } from '@repo/types';

interface StatusBadgeProps {
  status: CreditAnalysisStatus;
}

const statusStyles: Record<CreditAnalysisStatus, React.CSSProperties> = {
  pending: {
    color: 'var(--warn)',
    border: '1px solid var(--warn)',
  },
  analyzing: {
    color: 'var(--blue)',
    border: '1px solid var(--blue)',
  },
  hitl_required: {
    color: 'var(--alert)',
    border: '1px solid var(--alert)',
    fontWeight: 700,
  },
  pre_approved: {
    color: 'var(--blue)',
    border: '1px solid var(--blue)',
    fontWeight: 700,
  },
  approved: {
    color: 'var(--acc)',
    border: '1px solid var(--acc)',
    fontWeight: 700,
  },
  rejected: {
    color: 'var(--muted)',
    border: '1px solid var(--line2)',
  },
  expired: {
    color: 'var(--muted)',
    border: '1px solid var(--line)',
  },
  error: {
    color: 'var(--alert)',
    border: '1px solid var(--alert)',
  },
};

const labels: Record<CreditAnalysisStatus, string> = {
  pending:       'Pendente',
  analyzing:     'Em Análise',
  hitl_required: 'Revisão Humana Requerida',
  pre_approved:  'Pré-aprovado',
  approved:      'Aprovado',
  rejected:      'Reprovado',
  expired:       'Expirado',
  error:         'Erro',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.7rem',
        borderRadius: 0,
        fontSize: '0.75rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-label)',
        fontFamily: 'var(--font-mono)',
        background: 'transparent',
        ...statusStyles[status],
      }}
    >
      {status === 'analyzing' && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--blue)',
            flexShrink: 0,
            animation: 'pulse-opacity 1.2s infinite ease-in-out',
          }}
        />
      )}
      {labels[status] ?? status}
    </span>
  );
}
