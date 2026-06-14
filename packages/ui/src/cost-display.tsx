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
        border: '1px solid var(--acc)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <span
        style={{
          fontSize: '0.65rem',
          fontWeight: 400,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--ls-label)',
        }}
      >
        Custo FinOps Estimado
      </span>
      <span
        style={{
          fontSize: '1.1rem',
          fontWeight: 200,
          color: 'var(--acc)',
          marginTop: '0.2rem',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {formatted}
      </span>
    </div>
  );
}
