import React from 'react';
import type { AgentTrajectory, AgentCall } from '@repo/types';
import { AgentCard } from './agent-card';

interface TraceTimelineProps {
  trajectory: AgentTrajectory;
}

export function TraceTimeline({ trajectory }: TraceTimelineProps) {
  // Group calls by phase
  const phasesOrder: ('T1' | 'T2' | 'T3')[] = ['T1', 'T2', 'T3'];
  const groupedCalls = trajectory.phases.reduce((acc, call) => {
    if (!acc[call.phase]) {
      acc[call.phase] = [];
    }
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
        padding: '1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
            Trajetória Executiva A2A
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            Análise de spans e performance por turnos cognitivos
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'monospace' }}>
            Trace ID: {trajectory.trace_id}
          </span>
          {trajectory.finops && (
            <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}>
              Custo: R$ {trajectory.finops.estimated_cost_brl.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Vertical timeline connector line */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            backgroundColor: '#E5E7EB',
            zIndex: 0,
          }}
        />

        {phasesOrder.map((phase) => {
          const calls = groupedCalls[phase] || [];
          if (calls.length === 0) return null;

          return (
            <div key={phase} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              {/* Timeline circle icon */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #6366F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#4F46E5',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flexShrink: 0,
                }}
              >
                {phase}
              </div>

              {/* Phase content */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0.5rem 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
                  {phaseNames[phase]}
                </h4>
                
                {/* Horizontal row of AgentCards */}
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
