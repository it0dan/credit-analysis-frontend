import React from 'react';

type StatColor = 'ok' | 'warn' | 'alert' | 'blue' | 'acc' | 'text';

interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  color?: StatColor;
}

const colorVar: Record<StatColor, string> = {
  ok:    'var(--ok)',
  warn:  'var(--warn)',
  alert: 'var(--alert)',
  blue:  'var(--blue)',
  acc:   'var(--acc)',
  text:  'var(--text)',
};

export function Stat({ label, value, unit, delta, color = 'text' }: StatProps) {
  const isPositiveDelta = delta?.startsWith('+');
  const isNegativeDelta = delta?.startsWith('-');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
      }}
    >
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          color: colorVar[color],
          lineHeight: 1,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: '0.25rem', color: 'var(--muted)' }}>
            {unit}
          </span>
        )}
      </span>
      {delta && (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: isPositiveDelta ? 'var(--ok)' : isNegativeDelta ? 'var(--alert)' : 'var(--muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {delta}
        </span>
      )}
    </div>
  );
}
