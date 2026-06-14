import React from 'react';

type TagVariant = 'ok' | 'warn' | 'alert' | 'blue' | 'acc' | 'muted';

interface TagProps {
  variant?: TagVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
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

export function Tag({ variant = 'acc', size = 'sm', children }: TagProps) {
  const v = variantMap[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '0.2rem 0.55rem' : '0.35rem 0.85rem',
        borderRadius: 0,
        fontSize: size === 'sm' ? '0.7rem' : '0.8rem',
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
        letterSpacing: 'var(--ls-label)',
        textTransform: 'uppercase',
        color: v.color,
        background: 'transparent',
        border: `1px solid ${v.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
