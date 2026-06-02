import React from 'react';

interface CostDisplayProps {
  cost_brl: number;
}

export function CostDisplay({ cost_brl }: CostDisplayProps) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(cost_brl);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        padding: '0.75rem 1.25rem',
        borderRadius: '8px',
        backgroundColor: '#ECFDF5',
        border: '1px solid #A7F3D0',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Custo FinOps Estimado
      </span>
      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065F46', marginTop: '0.25rem', fontFamily: 'monospace' }}>
        {formatted}
      </span>
    </div>
  );
}
