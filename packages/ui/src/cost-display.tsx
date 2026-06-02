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
        padding: '0.85rem 1.5rem',
        borderRadius: '12px',
        backgroundColor: 'hsla(142, 76%, 45%, 0.06)',
        border: '1px solid hsla(142, 76%, 45%, 0.25)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        boxShadow: '0 0 15px hsla(142, 76%, 45%, 0.1)',
      }}
    >
      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'hsl(142, 76%, 60%)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Outfit', sans-serif" }}>
        Custo FinOps Estimado
      </span>
      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(142, 76%, 50%)', marginTop: '0.25rem', fontFamily: 'monospace', textShadow: '0 0 10px hsla(142, 76%, 45%, 0.25)' }}>
        {formatted}
      </span>
    </div>
  );
}
