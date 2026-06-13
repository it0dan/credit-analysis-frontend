import React from 'react';

type BulletVariant = 'check' | 'dot' | 'arrow';

interface BulletListProps {
  items: string[];
  variant?: BulletVariant;
  color?: string;
}

const icons: Record<BulletVariant, string> = {
  check: '✓',
  dot:   '●',
  arrow: '→',
};

export function BulletList({ items, variant = 'check', color = 'var(--acc)' }: BulletListProps) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            fontSize: '0.9rem',
            color: 'var(--text)',
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              color,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              flexShrink: 0,
              marginTop: '0.05em',
            }}
          >
            {icons[variant]}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
