import React from 'react';

interface BrandProps {
  variant?: 'full' | 'glyph' | 'footer';
}

export function Brand({ variant = 'full' }: BrandProps) {
  if (variant === 'glyph') {
    return (
      <span style={{ color: 'var(--acc)', fontFamily: 'var(--font-mono)', fontWeight: 200 }}>
        ◇
      </span>
    );
  }

  if (variant === 'footer') {
    return (
      <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
        crédito·a2a · demo
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.95rem',
        fontWeight: 300,
        letterSpacing: 'var(--ls-label)',
        textTransform: 'uppercase',
        color: 'var(--text)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'var(--acc)', fontSize: '1.1rem', lineHeight: 1 }}>◇</span>
      <span>CRÉDITO·A2A</span>
    </span>
  );
}
