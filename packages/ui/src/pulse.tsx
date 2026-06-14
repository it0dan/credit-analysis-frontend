import React from 'react';

type PulseColor = 'ok' | 'warn' | 'alert' | 'blue' | 'acc';

interface PulseProps {
  color?: PulseColor;
  size?: number;
  label?: string;
}

const colorMap: Record<PulseColor, string> = {
  ok:    'var(--blue)',
  warn:  'var(--warn)',
  alert: 'var(--alert)',
  blue:  'var(--blue)',
  acc:   'var(--acc)',
};

export function Pulse({ color = 'ok', size = 6, label }: PulseProps) {
  const dotColor = colorMap[color];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <span
        style={{
          display: 'inline-block',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: dotColor,
          flexShrink: 0,
          animation: 'pulse-opacity 2s infinite ease-in-out',
        }}
      />
      {label && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: 'var(--ls-label)' }}>
          {label}
        </span>
      )}
    </span>
  );
}
