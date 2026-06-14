'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { AgentCall, CreditAnalysisStatus, ReasoningChunk } from '@repo/types';
import { useDebug } from './debug-context';

const AGENT_LABELS: Record<string, string> = {
  bureau: 'Verificando seu histórico',
  documents: 'Confirmando documentos',
  risk: 'Avaliando seu perfil',
  compliance: 'Conferindo conformidade',
  decision: 'Concluindo análise',
};

const AGENT_ORDER = ['bureau', 'documents', 'risk', 'compliance', 'decision'];

const KIND_COLOR: Record<ReasoningChunk['kind'], string> = {
  thought: 'var(--text)',
  tool_call: 'var(--blue)',
  result: 'var(--text)',
  conclusion: 'var(--acc)',
};


const STATUS_LABEL_PT: Record<CreditAnalysisStatus, string> = {
  pending: 'PENDENTE',
  analyzing: 'EM ANÁLISE',
  approved: 'APROVADO',
  rejected: 'NÃO APROVADA',
  hitl_required: 'EM ANÁLISE HUMANA',
  expired: 'EXPIRADO',
  error: 'ERRO',
};

const STATUS_SYMBOL: Record<AgentCall['status'] | 'queued', string> = {
  queued: '·',
  in_progress: '●',
  success: '✓',
  awaiting_human: '~',
  fail: '×',
  timeout: '~',
  error: '×',
};

function phaseLabel(agent: string): AgentCall['phase'] {
  if (agent === 'compliance') return 'T2';
  if (agent === 'decision') return 'T3';
  return 'T1';
}

function statusLabel(status: AgentCall['status'] | 'queued') {
  if (status === 'queued') return 'na fila';
  if (status === 'in_progress') return 'processando';
  if (status === 'success') return 'concluído';
  if (status === 'awaiting_human') return 'análise humana';
  if (status === 'timeout') return 'tempo excedido';
  return 'erro';
}

function shouldAnimateChunk(phase: AgentCall, chunk: ReasoningChunk, index: number) {
  const chunks = phase.reasoning ?? [];
  return phase.status === 'in_progress' && index === chunks.length - 1 && ['thought', 'tool_call'].includes(chunk.kind);
}

export function ReasoningStream({
  phases,
  analysisStatus,
  isLive,
}: { phases: AgentCall[]; analysisStatus: CreditAnalysisStatus; isLive: boolean }) {
  const { enabled: debug } = useDebug();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const chunkCount = phases.reduce((sum, phase) => sum + (phase.reasoning?.length ?? 0), 0);
  const orderedPhases = useMemo(() => {
    return AGENT_ORDER.map((agent) => phases.find((phase) => phase.agent === agent) ?? null);
  }, [phases]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || !shouldAutoScrollRef.current) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [chunkCount, phases.length, analysisStatus]);

  const onScroll = () => {
    const node = scrollerRef.current;
    if (!node) return;
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 48;
  };

  return (
    <section
      aria-label="Raciocínio dos agentes"
      style={{
        backgroundColor: 'var(--surf)',
        border: '1px solid var(--line)',
        borderLeft: '2px solid var(--acc)',
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ color: 'var(--acc)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: 'var(--ls-label)', textTransform: 'uppercase' }}>
            reasoning stream
          </span>
          <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 300, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
            Agentes explicando cada etapa
          </h2>
        </div>
        <span style={{ color: isLive ? 'var(--acc)' : 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: 'var(--ls-label)', textTransform: 'uppercase' }}>
          {isLive ? '● AO VIVO' : (STATUS_LABEL_PT[analysisStatus] ?? analysisStatus.toUpperCase())}
        </span>
      </div>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          paddingRight: '0.35rem',
        }}
      >
        {orderedPhases.map((phase, idx) => {
          const agent = AGENT_ORDER[idx] ?? 'bureau';
          const status = phase?.status ?? 'queued';
          const chunks = phase?.reasoning ?? [];
          return (
            <article
              key={agent}
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--line)',
                borderLeft: status === 'in_progress' ? '2px solid var(--acc)' : '1px solid var(--line2)',
                padding: '0.9rem 1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                  <span style={{ color: status === 'queued' ? 'var(--muted)' : status === 'error' || status === 'fail' ? 'var(--alert)' : 'var(--acc)', fontFamily: 'var(--font-mono)' }}>
                    {STATUS_SYMBOL[status]}
                  </span>
                  <span style={{ color: status === 'queued' ? 'var(--muted)' : 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    {AGENT_LABELS[agent]}
                  </span>
                </div>
                <span style={{ color: status === 'queued' ? 'var(--muted)' : 'var(--acc)', border: '1px solid var(--line2)', padding: '0.15rem 0.45rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: 'var(--ls-label)', textTransform: 'uppercase' }}>
                  {phase?.phase ?? phaseLabel(agent)} · {statusLabel(status)}
                </span>
              </div>

              {chunks.length > 0 && (
                <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
                  {chunks.map((chunk, chunkIndex) => (
                    <ChunkLine
                      key={`${agent}-${chunk.timestamp_ms}-${chunkIndex}`}
                      chunk={chunk}
                      animate={phase ? shouldAnimateChunk(phase, chunk, chunkIndex) : false}
                      debug={debug}
                      isLast={chunkIndex === chunks.length - 1}
                    />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ChunkLine({ chunk, animate, debug, isLast }: { chunk: ReasoningChunk; animate: boolean; debug: boolean; isLast: boolean }) {
  const [visibleChars, setVisibleChars] = useState(animate ? 0 : chunk.text_human.length);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduced);
    if (!animate || reduced) {
      setVisibleChars(chunk.text_human.length);
      return;
    }

    setVisibleChars(0);
    let i = 0;
    const step = Math.max(1, Math.ceil(chunk.text_human.length / 32));
    const id = window.setInterval(() => {
      i += step;
      if (i >= chunk.text_human.length) {
        setVisibleChars(chunk.text_human.length);
        window.clearInterval(id);
      } else {
        setVisibleChars(i);
      }
    }, 18);
    return () => window.clearInterval(id);
  }, [animate, chunk.text_human]);

  const visibleText = chunk.text_human.slice(0, visibleChars);
  const isTyping = animate && visibleChars < chunk.text_human.length && !reducedMotion;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2rem minmax(0, 1fr)',
        columnGap: '0.35rem',
        color: KIND_COLOR[chunk.kind],
        fontFamily: 'var(--font-mono)',
        fontSize: '0.82rem',
        lineHeight: 1.55,
        animation: reducedMotion ? 'fadeIn 200ms ease-out' : undefined,
      }}
    >
      <span style={{ color: 'var(--line2)', textAlign: 'right' }}>{isLast ? '└─' : '├─'}</span>
      <span style={{ minWidth: 0 }}>
        <span>{visibleText}</span>
        {isTyping && (
          <span aria-hidden="true" style={{ display: 'inline-block', width: '0.55em', marginLeft: '0.12rem', color: 'var(--acc)', animation: 'blink 0.8s steps(1) infinite' }}>
            ▌
          </span>
        )}
        {debug && (
          <span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', marginTop: '0.12rem' }}>
            {chunk.text_debug}
          </span>
        )}
      </span>
    </div>
  );
}
