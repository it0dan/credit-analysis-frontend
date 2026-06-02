import React from 'react';
import type { CreditAnalysisStatus } from '@repo/types';

interface StatusBadgeProps {
  status: CreditAnalysisStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<CreditAnalysisStatus, React.CSSProperties> = {
    pending: {
      backgroundColor: '#FEF3C7',
      color: '#D97706',
      border: '1px solid #FCD34D',
    },
    analyzing: {
      backgroundColor: '#E0F2FE',
      color: '#0284C7',
      border: '1px solid #BAE6FD',
    },
    hitl_required: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
      border: '1px solid #FCA5A5',
      fontWeight: 'bold',
      animation: 'pulse 2s infinite',
    },
    approved: {
      backgroundColor: '#D1FAE5',
      color: '#059669',
      border: '1px solid #A7F3D0',
    },
    rejected: {
      backgroundColor: '#F3F4F6',
      color: '#4B5563',
      border: '1px solid #E5E7EB',
    },
    expired: {
      backgroundColor: '#E5E7EB',
      color: '#6B7280',
      border: '1px solid #D1D5DB',
    },
    error: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
      border: '1px solid #FCA5A5',
    },
  };

  const labels: Record<CreditAnalysisStatus, string> = {
    pending: 'Pendente',
    analyzing: 'Em Análise',
    hitl_required: 'Revisão Humana Requerida',
    approved: 'Aprovado',
    rejected: 'Reprovado',
    expired: 'Expirado',
    error: 'Erro',
  };

  const badgeStyle = styles[status] || styles.pending;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'all 0.2s ease',
        ...badgeStyle,
      }}
    >
      {labels[status] || status}
    </span>
  );
}
