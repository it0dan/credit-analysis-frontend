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
        padding: '2rem',
        backgroundColor: 'hsla(223, 47%, 12%, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid hsla(217, 91%, 60%, 0.15)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.05)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: 'hsl(210, 40%, 98%)',
        animation: 'fadeIn 0.6s ease-out',
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid hsla(217, 91%, 60%, 0.1)', 
          paddingBottom: '1.25rem' 
        }}
      >
        <div>
          <h3 
            style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              color: 'hsl(210, 40%, 98%)',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em'
            }}
          >
            Trajetória Executiva A2A
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'hsl(215, 20%, 75%)' }}>
            Análise de spans e performance por turnos cognitivos
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'hsl(215, 16%, 50%)', fontFamily: 'monospace', background: 'hsla(223, 47%, 8%, 0.5)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid hsla(217, 91%, 60%, 0.08)' }}>
            Trace ID: {trajectory.trace_id}
          </span>
          {trajectory.finops && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'hsl(142, 76%, 45%)', textShadow: '0 0 10px hsla(142, 76%, 45%, 0.2)' }}>
              Custo: R$ {trajectory.finops.estimated_cost_brl.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Vertical timeline connector line with a glowing gradient */}
        <div
          style={{
            position: 'absolute',
            left: '21px',
            top: '20px',
            bottom: '20px',
            width: '2px',
            background: 'linear-gradient(to bottom, hsl(217, 91%, 60%) 30%, hsla(217, 91%, 60%, 0.2))',
            zIndex: 0,
            opacity: 0.8
          }}
        />

        {phasesOrder.map((phase) => {
          const calls = groupedCalls[phase] || [];
          if (calls.length === 0) return null;

          return (
            <div key={phase} style={{ display: 'flex', gap: '1.75rem', position: 'relative', zIndex: 1 }}>
              {/* Timeline circle icon with a premium glowing border */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'hsl(223, 47%, 8%)',
                  border: '2px solid hsl(217, 91%, 60%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: 'hsl(217, 91%, 60%)',
                  boxShadow: '0 0 15px hsla(217, 91%, 60%, 0.4)',
                  fontFamily: "'Outfit', sans-serif",
                  flexShrink: 0,
                }}
              >
                {phase}
              </div>

              {/* Phase content */}
              <div style={{ flex: 1 }}>
                <h4 
                  style={{ 
                    margin: '0.6rem 0 1.25rem 0', 
                    fontSize: '1.05rem', 
                    fontWeight: 700, 
                    color: 'hsl(210, 40%, 98%)',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {phaseNames[phase]}
                </h4>
                
                {/* Horizontal row of AgentCards */}
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
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
