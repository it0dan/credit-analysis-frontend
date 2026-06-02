import React from 'react';
import type { CreditAnalysisStatus } from '@repo/types';

interface StatusBadgeProps {
  status: CreditAnalysisStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<CreditAnalysisStatus, React.CSSProperties> = {
    pending: {
      backgroundColor: 'hsla(38, 92%, 50%, 0.1)',
      color: 'hsl(38, 92%, 65%)',
      border: '1px solid hsla(38, 92%, 50%, 0.3)',
      boxShadow: '0 0 10px hsla(38, 92%, 50%, 0.1)',
    },
    analyzing: {
      backgroundColor: 'hsla(217, 91%, 60%, 0.1)',
      color: 'hsl(217, 91%, 70%)',
      border: '1px solid hsla(217, 91%, 60%, 0.3)',
      boxShadow: '0 0 10px hsla(217, 91%, 60%, 0.15)',
    },
    hitl_required: {
      backgroundColor: 'hsla(346, 84%, 61%, 0.15)',
      color: 'hsl(346, 84%, 70%)',
      border: '1px solid hsla(346, 84%, 61%, 0.4)',
      boxShadow: '0 0 15px hsla(346, 84%, 61%, 0.25)',
      fontWeight: 'bold',
    },
    approved: {
      backgroundColor: 'hsla(142, 76%, 45%, 0.15)',
      color: 'hsl(142, 76%, 55%)',
      border: '1px solid hsla(142, 76%, 45%, 0.4)',
      boxShadow: '0 0 15px hsla(142, 76%, 45%, 0.25)',
      fontWeight: 'bold',
    },
    rejected: {
      backgroundColor: 'hsla(215, 16%, 50%, 0.15)',
      color: 'hsl(215, 20%, 75%)',
      border: '1px solid hsla(215, 16%, 50%, 0.3)',
    },
    expired: {
      backgroundColor: 'hsla(215, 16%, 50%, 0.1)',
      color: 'hsl(215, 16%, 60%)',
      border: '1px solid hsla(215, 16%, 50%, 0.2)',
    },
    error: {
      backgroundColor: 'hsla(346, 84%, 61%, 0.15)',
      color: 'hsl(346, 84%, 70%)',
      border: '1px solid hsla(346, 84%, 61%, 0.3)',
      boxShadow: '0 0 10px hsla(346, 84%, 61%, 0.15)',
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
      className={status === 'hitl_required' ? 'glow-pulse-rose' : status === 'analyzing' ? 'glow-pulse-primary' : status === 'approved' ? 'glow-pulse-emerald' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.35rem 0.9rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontFamily: "'Outfit', system-ui, sans-serif",
        transition: 'all 0.3s ease',
        ...badgeStyle,
      }}
    >
      {status === 'analyzing' && (
        <span 
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'hsl(217, 91%, 70%)',
            marginRight: '0.5rem',
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
          }}
        />
      )}
      {labels[status] || status}
    </span>
  );
}
