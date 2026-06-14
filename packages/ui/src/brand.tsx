'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface BrandProps {
  variant?: 'full' | 'glyph' | 'footer';
}

export function Brand({ variant = 'full' }: BrandProps) {
  const [hovered, setHovered] = useState(false);

  if (variant === 'footer') {
    return (
      <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
        crédito·a2a · demo
      </span>
    );
  }

  const content = (
    <>
      <span style={{ color: 'var(--acc)', fontSize: variant === 'glyph' ? '1.1rem' : '1.1rem', lineHeight: 1 }}>◇</span>
      {variant === 'full' && <span>CRÉDITO·A2A</span>}
    </>
  );

  return (
    <Link
      href="/"
      aria-label="Voltar para o início"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'inherit',
        textDecoration: 'none',
        cursor: 'pointer',
        opacity: hovered ? 0.8 : 1,
        transition: 'opacity 150ms ease',
        fontFamily: 'var(--font-mono)',
        fontSize: variant === 'glyph' ? '1rem' : '0.95rem',
        fontWeight: 300,
        letterSpacing: variant === 'glyph' ? 0 : 'var(--ls-label)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {content}
    </Link>
  );
}
