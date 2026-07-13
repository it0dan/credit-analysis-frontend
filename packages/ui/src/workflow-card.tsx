'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { AgentCall, ReasoningChunk } from '@repo/types';
import { useDebug } from './debug-context';

type VisualStatus = 'queued' | 'active' | 'done' | 'error' | 'waiting';

const STATUS_MAP: Record<string, VisualStatus> = {
  queued: 'queued',
  in_progress: 'active',
  thinking: 'active',
  tool_call: 'active',
  result: 'active',
  success: 'done',
  done: 'done',
  awaiting_human: 'waiting',
  fail: 'error',
  timeout: 'error',
  error: 'error',
};

const KIND_COLOR: Record<string, string> = {
  thought: 'var(--text)',
  tool_call: 'var(--blue)',
  result: 'var(--text)',
  conclusion: 'var(--acc)',
};

interface WorkflowCardProps {
  index: number;
  total: number;
  label: string;
  phase?: AgentCall;
  isLast?: boolean;
}

export function WorkflowCard({ index, total, label, phase, isLast = false }: WorkflowCardProps) {
  const { enabled: debug } = useDebug();
  const status: VisualStatus = phase ? (STATUS_MAP[phase.status] ?? 'queued') : 'queued';
  const chunks: ReasoningChunk[] = phase?.reasoning ?? [];
  const isActive = status === 'active';
  const isSettled = status === 'done' || status === 'waiting' || status === 'error';
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (!contentRef.current) return;
    setMaxHeight(isActive || isSettled ? `${contentRef.current.scrollHeight + 120}px` : '0px');
  }, [isActive, isSettled, chunks.length, debug]);

  const borderColor = status === 'active' ? 'var(--acc)'
    : status === 'waiting' ? 'var(--warn)'
      : status === 'error' ? 'var(--alert)'
        : status === 'done' ? 'var(--line2)'
          : 'var(--line)';
  const iconColor = status === 'waiting' ? 'var(--warn)'
    : status === 'error' ? 'var(--alert)'
      : status === 'queued' ? 'var(--text)'
        : 'var(--acc)';
  const badgeLabel = status === 'queued' ? 'Aguardando'
    : status === 'active' ? 'Verificando'
      : status === 'done' ? '✓ Concluído'
        : status === 'waiting' ? 'Em revisão'
          : 'Erro';

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }} data-workflow-status={status}>
      <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            border: `1px solid ${borderColor}`,
            background: status === 'done' ? 'var(--acc)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color 0.3s ease, background 0.3s ease',
            position: 'relative',
          }}
        >
          {status === 'active' && (
            <span
              data-workflow-spinner
              style={{
                width: '8px',
                height: '8px',
                border: '2px solid var(--acc)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                display: 'block',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          )}
          {status === 'done' && <span style={{ color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700 }}>✓</span>}
          {status === 'queued' && <span style={{ width: '6px', height: '6px', background: 'var(--line2)', display: 'block' }} />}
          {status === 'waiting' && <span style={{ color: 'var(--warn)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>~</span>}
          {status === 'error' && <span style={{ color: 'var(--alert)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>×</span>}
        </div>
        {!isLast && (
          <div
            style={{
              flex: 1,
              width: '1px',
              minHeight: '20px',
              background: isSettled ? 'var(--acc)' : 'var(--line)',
              transition: 'background 0.4s ease 0.2s',
              marginTop: '2px',
            }}
          />
        )}
      </div>

      <article
        aria-label={`Etapa ${index + 1} de ${total}: ${label}`}
        style={{
          flex: 1,
          marginBottom: isLast ? 0 : '0.5rem',
          border: `1px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
          background: isActive ? 'var(--surf)' : 'var(--bg)',
          transition: 'border-color 0.3s ease, background 0.3s ease',
          padding: '0.75rem 1rem',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text)', transition: 'color 0.3s ease' }}>
            {label}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: iconColor, whiteSpace: 'nowrap', border: '1px solid var(--line2)', padding: '0.15rem 0.45rem', transition: 'color 0.3s ease' }}>
            {badgeLabel}
          </span>
        </div>

        <div ref={contentRef} style={{ maxHeight, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {chunks.length > 0 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }} aria-live="polite">
              {chunks.map((chunk, chunkIndex) => (
                <FadeChunk key={`${chunk.timestamp_ms}-${chunkIndex}`} chunk={chunk} debug={debug} isLast={chunkIndex === chunks.length - 1} />
              ))}
            </div>
          )}
          {debug && phase && (
            <div style={{ marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
              {phase.phase} · {phase.latency_ms}ms · {phase.span_id}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function FadeChunk({ chunk, debug, isLast }: { chunk: ReasoningChunk; debug: boolean; isLast: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const id = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5rem minmax(0, 1fr)',
        columnGap: '0.35rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        color: KIND_COLOR[chunk.kind] ?? 'var(--text)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      <span aria-hidden="true" style={{ color: 'var(--line2)', textAlign: 'right' }}>{isLast ? '└─' : '├─'}</span>
      <span>
        {chunk.text_human}
        {debug && chunk.text_debug && <span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.68rem', marginTop: '2px' }}>{chunk.text_debug}</span>}
      </span>
    </div>
  );
}
