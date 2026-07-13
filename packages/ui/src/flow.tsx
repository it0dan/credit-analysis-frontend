import React from 'react';

type FlowStatus = 'done' | 'active' | 'pending' | 'error';

interface FlowStep {
  label: string;
  sublabel?: string;
  status: FlowStatus;
  parallel?: boolean;
}

interface FlowProps {
  steps: FlowStep[];
  orientation?: 'horizontal' | 'vertical';
}

const statusColor: Record<FlowStatus, string> = {
  done:    'var(--ok)',
  active:  'var(--acc)',
  pending: 'var(--muted)',
  error:   'var(--alert)',
};

const statusBg: Record<FlowStatus, string> = {
  done:    'transparent',
  active:  'transparent',
  pending: 'transparent',
  error:   'transparent',
};

const statusLabel: Record<FlowStatus, string> = {
  done:    '✓',
  active:  '●',
  pending: '○',
  error:   '✕',
};

function StepNode({ step }: { step: FlowStep }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        minWidth: '80px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: statusBg[step.status],
          border: `2px solid ${statusColor[step.status]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: statusColor[step.status],
          fontWeight: 800,
          outline: step.status === 'active' ? '2px solid var(--acc)' : undefined,
        }}
      >
        {statusLabel[step.status]}
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)', textAlign: 'center' }}>
        {step.label}
      </span>
      {step.sublabel && (
        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', textAlign: 'center' }}>
          {step.sublabel}
        </span>
      )}
    </div>
  );
}

function Connector() {
  return (
    <div
      style={{
        flex: 1,
        height: '2px',
        background: 'var(--line2)',
        minWidth: '24px',
        alignSelf: 'center',
        marginBottom: '28px',
      }}
    />
  );
}

export function Flow({ steps, orientation = 'horizontal' }: FlowProps) {
  if (orientation === 'vertical') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
            <StepNode step={step} />
            {idx < steps.length - 1 && (
              <div style={{ width: '2px', height: '24px', background: statusColor[step.status], marginLeft: '19px', opacity: 0.5 }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Group parallel steps
  const groups: FlowStep[][] = [];
  let i = 0;
  while (i < steps.length) {
    const cur = steps[i];
    if (cur && cur.parallel && i + 1 < steps.length) {
      const next = steps[i + 1];
      if (next) groups.push([cur, next]);
      i += 2;
    } else if (cur) {
      groups.push([cur]);
      i++;
    } else {
      i++;
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', flexWrap: 'wrap' }}>
      {groups.map((group, gIdx) => {
        const prevGroup = groups[gIdx - 1];
        const prevFirst = prevGroup?.[0];
        return (
        <React.Fragment key={gIdx}>
          {gIdx > 0 && prevFirst && <Connector />}
          {group.length === 1 && group[0] ? (
            <StepNode step={group[0]} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {group.map((step, sIdx) => (
                <StepNode key={sIdx} step={step} />
              ))}
            </div>
          )}
        </React.Fragment>
        );
      })}
    </div>
  );
}
