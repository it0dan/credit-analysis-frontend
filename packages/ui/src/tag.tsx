import React from 'react';

type TagVariant = 'ok' | 'warn' | 'alert' | 'blue' | 'acc' | 'muted';

interface TagProps {
  variant?: TagVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
  dim?: string;
  alert?: boolean;
  children: React.ReactNode;
}

const variantMap: Record<TagVariant, { color: string; border: string }> = {
  ok:    { color: 'var(--blue)',  border: 'var(--blue)'  },
  warn:  { color: 'var(--warn)',  border: 'var(--warn)'  },
  alert: { color: 'var(--alert)', border: 'var(--alert)' },
  blue:  { color: 'var(--blue)',  border: 'var(--blue)'  },
  acc:   { color: 'var(--acc)',   border: 'var(--acc)'   },
  muted: { color: 'var(--muted)', border: 'var(--line2)' },
};

export function Tag({ variant = 'acc', size = 'sm', dim, alert, children }: TagProps) {
  const v = variantMap[variant];
  const deckLabel = Boolean(dim || alert);

  return (
    <span
      style={{
        display: deckLabel ? 'inline-block' : 'inline-flex',
        alignItems: 'center',
        padding: deckLabel ? 0 : size === 'sm' ? '0.2rem 0.55rem' : '0.35rem 0.85rem',
        borderRadius: 0,
        fontSize: deckLabel ? '10px' : size === 'sm' ? '0.7rem' : '0.8rem',
        fontWeight: deckLabel ? 400 : 500,
        fontFamily: 'var(--font-mono)',
        letterSpacing: deckLabel ? 'var(--ls-label-strong)' : 'var(--ls-label)',
        textTransform: 'uppercase',
        color: alert ? 'var(--alert)' : v.color,
        background: 'transparent',
        border: deckLabel ? 'none' : `1px solid ${v.border}`,
        marginBottom: deckLabel ? '12px' : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      {dim && <span style={{ color: 'var(--muted)' }}> · {dim}</span>}
    </span>
  );
}
