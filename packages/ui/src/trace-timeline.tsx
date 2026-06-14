import React from 'react';
import type { AgentTrajectory, AgentCall } from '@repo/types';
import { AgentCard } from './agent-card';

interface TraceTimelineProps {
  trajectory: AgentTrajectory;
}

export function TraceTimeline({ trajectory }: TraceTimelineProps) {
  const phasesOrder: ('T1' | 'T2' | 'T3')[] = ['T1', 'T2', 'T3'];
  const groupedCalls = trajectory.phases.reduce((acc, call) => {
    if (!acc[call.phase]) acc[call.phase] = [];
    acc[call.phase].push(call);
    return acc;
  }, {} as Record<'T1' | 'T2' | 'T3', AgentCall[]>);

  const phaseNames = {
    T1: 'Turno 1 — Cadastro & Risco preliminar (Paralelo)',
    T2: 'Turno 2 — Segurança & Conformidade (Paralelo)',
    T3: 'Turno 3 — Síntese da Decisão Final (Serial)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '1.75rem',
        backgroundColor: 'var(--surf)',
        border: '1px solid var(--line)',
        borderLeft: '2px solid var(--blue)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text)',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '1rem',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 200,
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.01em',
            }}
          >
            Trajetória Executiva A2A
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--muted)' }}>
            Análise de spans e performance por turnos cognitivos
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg)',
              padding: '0.2rem 0.5rem',
              border: '1px solid var(--line)',
            }}
          >
            Trace: {trajectory.trace_id}
          </span>
          {trajectory.finops && (
            <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>
              R$ {trajectory.finops.estimated_cost_brl.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Vertical connector */}
        <div
          style={{
            position: 'absolute',
            left: '17px',
            top: '20px',
            bottom: '20px',
            width: '1px',
            background: 'var(--line2)',
            zIndex: 0,
          }}
        />

        {phasesOrder.map((phase) => {
          const calls = groupedCalls[phase] || [];
          if (calls.length === 0) return null;

          return (
            <div key={phase} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              {/* Phase marker */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--acc)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 400,
                  color: 'var(--acc)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}
              >
                {phase}
              </div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: '0.5rem 0 1rem 0',
                    fontSize: '0.85rem',
                    fontWeight: 300,
                    color: 'var(--text)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {phaseNames[phase]}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {calls.map((call, idx) => (
                    <AgentCard key={`${call.agent}-${idx}`} agent={call} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
