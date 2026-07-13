import React from 'react';

type StatColor = 'ok' | 'warn' | 'alert' | 'blue' | 'acc' | 'text';

interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  sub?: string;
  color?: StatColor | string;
}

const colorVar: Record<StatColor, string> = {
  ok:    'var(--ok)',
  warn:  'var(--warn)',
  alert: 'var(--alert)',
  blue:  'var(--blue)',
  acc:   'var(--acc)',
  text:  'var(--text)',
};

export function Stat({ label, value, unit, delta, sub, color = 'var(--acc)' }: StatProps) {
  const isPositiveDelta = delta?.startsWith('+');
  const isNegativeDelta = delta?.startsWith('-');
  const resolvedColor = color in colorVar ? colorVar[color as StatColor] : color;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        borderLeft: `2px solid ${resolvedColor}`,
        paddingLeft: '16px',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--text)',
          maxWidth: '190px',
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '36px',
          fontWeight: 200,
          fontFamily: 'var(--font-mono)',
          color: resolvedColor,
          lineHeight: 1,
          order: -1,
          marginBottom: '5px',
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: '0.25rem', color: 'var(--muted)' }}>
            {unit}
          </span>
        )}
      </span>
      {sub && (
        <span style={{ fontSize: '10px', color: 'var(--text)', marginTop: '5px', fontFamily: 'var(--font-mono)' }}>
          {sub}
        </span>
      )}
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
