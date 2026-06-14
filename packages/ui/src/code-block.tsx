'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  copyable?: boolean;
  maxHeight?: string;
}

export function CodeBlock({ code, language, copyable = true, maxHeight = '320px' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 0,
        border: '1px solid var(--line)',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid var(--line)',
          background: 'var(--surf)',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--muted)',
            textTransform: 'lowercase',
          }}
        >
          {language ?? 'code'}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              padding: '0.2rem 0.6rem',
              borderRadius: 0,
              border: '1px solid var(--line2)',
              background: copied ? 'rgba(127,255,212,0.08)' : 'transparent',
              color: copied ? 'var(--acc)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'color 0.15s, background 0.15s',
            }}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        )}
      </div>
      {/* Code body */}
      <pre
        style={{
          margin: 0,
          padding: '1rem',
          overflowY: 'auto',
          maxHeight,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          color: 'var(--text)',
          whiteSpace: 'pre',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
