import React from 'react';

interface TerminalShellProps {
  lines: string[];
  prompt?: string;
  title?: string;
  height?: string;
}

export function TerminalShell({ lines, prompt = '$ ', title = 'terminal', height = 'auto' }: TerminalShellProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line)',
        overflow: 'hidden',
        background: 'var(--bg)',
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1rem',
          background: 'var(--surf)',
          borderBottom: '1px solid var(--line)',
          flexShrink: 0,
        }}
      >
        {/* Traffic light dots */}
        {(['var(--alert)', 'var(--warn)', 'var(--ok)'] as const).map((c, i) => (
          <span
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: c,
              opacity: 0.8,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: '0.5rem',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--muted)',
          }}
        >
          {title}
        </span>
      </div>
      {/* Lines */}
      <div
        style={{
          padding: '0.75rem 1rem',
          overflowY: 'auto',
          flex: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.1rem',
        }}
      >
        {lines.map((line, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.35rem' }}>
            <span style={{ color: 'var(--ok)', userSelect: 'none', flexShrink: 0 }}>{prompt}</span>
            <span style={{ color: 'var(--text)' }}>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
