import React from 'react';
import { Pulse } from './pulse';

type HudStatus = 'ok' | 'warn' | 'alert' | 'blue' | 'acc';

interface HudItem {
  label: string;
  value: string;
  status?: HudStatus;
}

interface HudProps {
  items: HudItem[];
}

export function Hud({ items }: HudProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        fontSize: '0.8rem',
        color: 'var(--muted)',
        fontWeight: 600,
      }}
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <span
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: 'var(--muted)',
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {item.status && <Pulse color={item.status} size={7} />}
            <span>{item.label}:</span>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>{item.value}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
