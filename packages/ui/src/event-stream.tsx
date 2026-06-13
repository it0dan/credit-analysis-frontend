import React from 'react';
import { Tag } from './tag';
import { Pulse } from './pulse';

type EventType = 'AGENT_UPDATE' | 'HITL_REQUIRED' | 'ANALYSIS_COMPLETE' | 'ERROR' | string;

interface StreamEvent {
  type: EventType;
  label: string;
  ts?: string;
  data?: unknown;
}

interface EventStreamProps {
  events: StreamEvent[];
  maxVisible?: number;
  live?: boolean;
}

type TagVariant = 'ok' | 'warn' | 'alert' | 'blue' | 'acc' | 'muted';

function eventVariant(type: EventType): TagVariant {
  switch (type) {
    case 'ANALYSIS_COMPLETE': return 'ok';
    case 'HITL_REQUIRED':     return 'warn';
    case 'ERROR':             return 'alert';
    case 'AGENT_UPDATE':      return 'blue';
    default:                  return 'muted';
  }
}

function formatTs(ts: string) {
  try {
    return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}

export function EventStream({ events, maxVisible = 20, live = false }: EventStreamProps) {
  const visible = events.slice(-maxVisible);

  return (
    <div
      style={{
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line)',
        overflow: 'hidden',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1rem',
          background: 'var(--surf)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Event Stream
        </span>
        {live && <Pulse color="ok" size={7} label="ao vivo" />}
      </div>
      {/* Events */}
      <div
        style={{
          overflowY: 'auto',
          maxHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {visible.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Aguardando eventos…
          </div>
        ) : (
          visible.map((ev, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 1rem',
                borderBottom: idx < visible.length - 1 ? '1px solid var(--line)' : undefined,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
              }}
            >
              <Tag variant={eventVariant(ev.type)} size="sm">{ev.type}</Tag>
              <span style={{ flex: 1, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ev.label}
              </span>
              {ev.ts && (
                <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{formatTs(ev.ts)}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
