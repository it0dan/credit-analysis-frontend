import React from 'react';

type PulseColor = 'ok' | 'warn' | 'alert' | 'blue' | 'acc';

interface PulseProps {
  color?: PulseColor;
  size?: number;
  label?: string;
}

const colorMap: Record<PulseColor, { dot: string; glow: string; glowClass: string }> = {
  ok:    { dot: 'var(--ok)',    glow: 'var(--ok-glow)',    glowClass: 'glow-pulse-emerald' },
  warn:  { dot: 'var(--warn)',  glow: 'var(--warn-glow)',  glowClass: 'glow-pulse-amber'   },
  alert: { dot: 'var(--alert)', glow: 'var(--alert-glow)', glowClass: 'glow-pulse-rose'    },
  blue:  { dot: 'var(--blue)',  glow: 'var(--blue-glow)',  glowClass: ''                   },
  acc:   { dot: 'var(--acc)',   glow: 'var(--acc-glow)',   glowClass: 'glow-pulse-primary' },
};

export function Pulse({ color = 'ok', size = 8, label }: PulseProps) {
  const c = colorMap[color];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <span
        className={c.glowClass}
        style={{
          display: 'inline-block',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: c.dot,
          boxShadow: `0 0 ${size}px ${c.glow}`,
          flexShrink: 0,
        }}
      />
      {label && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 600 }}>
          {label}
        </span>
      )}
    </span>
  );
}
