import React from 'react';

type TagVariant = 'ok' | 'warn' | 'alert' | 'blue' | 'acc' | 'muted';

interface TagProps {
  variant?: TagVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
  children: React.ReactNode;
}

const variantMap: Record<TagVariant, { color: string; bg: string; border: string; glowClass: string }> = {
  ok:    { color: 'var(--ok)',    bg: 'var(--ok-glow)',    border: 'var(--ok)',    glowClass: 'glow-pulse-emerald' },
  warn:  { color: 'var(--warn)',  bg: 'var(--warn-glow)',  border: 'var(--warn)',  glowClass: 'glow-pulse-amber'   },
  alert: { color: 'var(--alert)', bg: 'var(--alert-glow)', border: 'var(--alert)', glowClass: 'glow-pulse-rose'    },
  blue:  { color: 'var(--blue)',  bg: 'var(--blue-glow)',  border: 'var(--blue)',  glowClass: ''                   },
  acc:   { color: 'var(--acc)',   bg: 'var(--acc-glow)',   border: 'var(--acc)',   glowClass: 'glow-pulse-primary' },
  muted: { color: 'var(--muted)', bg: 'rgba(107,114,128,0.15)', border: 'var(--muted)', glowClass: '' },
};

export function Tag({ variant = 'acc', size = 'sm', pulse = false, children }: TagProps) {
  const v = variantMap[variant];

  return (
    <span
      className={pulse ? v.glowClass : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '0.2rem 0.55rem' : '0.35rem 0.85rem',
        borderRadius: 'var(--radius-pill)',
        fontSize: size === 'sm' ? '0.7rem' : '0.8rem',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: v.color,
        background: v.bg,
        border: `1px solid ${v.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
