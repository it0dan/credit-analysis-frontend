import React, { useState } from 'react';
import type { HITLRequest, OperatorDecision } from '@repo/types';

interface HITLPanelProps {
  request: HITLRequest;
  onDecide: (decision: OperatorDecision) => void;
}

export function HITLPanel({ request, onDecide }: HITLPanelProps) {
  const [justification, setJustification] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (decisionType: 'approve' | 'reject' | 'escalate') => {
    const trimmed = justification.trim();

    if (!trimmed) {
      setError('A justificativa de auditoria é obrigatória para processar a decisão.');
      return;
    }
    if (trimmed.length < 50) {
      setError(`Sua justificativa é muito curta (${trimmed.length} caracteres). Mínimo: 50.`);
      return;
    }
    if (trimmed.length > 300) {
      setError(`Sua justificativa é muito longa (${trimmed.length} caracteres). Máximo: 300.`);
      return;
    }

    setError(null);
    onDecide({
      request_id: request.request_id,
      decision: decisionType,
      justification: trimmed,
      operator_id: 'OP-1002',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        padding: '2rem',
        backgroundColor: 'var(--surf)',
        borderLeft: '2px solid var(--acc)',
        border: '1px solid var(--line2)',
        borderLeftWidth: '2px',
        borderLeftColor: 'var(--acc)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text)',
        maxWidth: '780px',
        width: '100%',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: 300,
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.01em',
            }}
          >
            Painel de Revisão Humana (HITL)
          </h2>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '0.2rem 0.55rem',
              borderRadius: 0,
              backgroundColor: 'transparent',
              color: 'var(--warn)',
              border: '1px solid var(--warn)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--ls-label)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Aguardando Operador
          </span>
        </div>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          Solicitação: <strong style={{ color: 'var(--blue)' }}>{request.request_id}</strong>{' '}
          | Trace: <span style={{ fontSize: '0.8rem' }}>{request.trace_id}</span>
        </p>
      </div>

      {/* Overview Metadata */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          backgroundColor: 'var(--bg)',
          padding: '1.25rem',
          border: '1px solid var(--line)',
        }}
      >
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500, letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
            CPF do Solicitante
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
            {request.cpf_masked}
          </span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500, letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
            Gatilho de Intervenção
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--alert)' }}>
            {request.reason}
          </span>
        </div>
      </div>

      {/* T1 and T2 Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Relatório do Turno 1 (T1)', data: request.t1_results },
          { label: 'Relatório do Turno 2 (T2)', data: request.t2_results },
        ].map(({ label, data }) => (
          <div key={label}>
            <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
              {label}
            </h4>
            <pre
              style={{
                margin: 0,
                padding: '1rem',
                backgroundColor: 'var(--bg)',
                fontSize: '0.75rem',
                maxHeight: '160px',
                overflowY: 'auto',
                border: '1px solid var(--line)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text)',
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      {/* Operator input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="justification" style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
            Justificativa Técnica da Decisão *
          </label>
          <span style={{ fontSize: '0.75rem', color: justification.length >= 50 && justification.length <= 300 ? 'var(--acc)' : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            {justification.length} / 50-300
          </span>
        </div>
        <textarea
          id="justification"
          placeholder="Descreva o parecer de aprovação ou reprovação para fins de auditoria (mínimo 50 caracteres)..."
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            if (e.target.value.trim().length >= 50) setError(null);
          }}
          rows={4}
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg)',
            border: error ? '1px solid var(--alert)' : '1px solid var(--line2)',
            color: 'var(--text)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)',
            resize: 'vertical',
            outline: 'none',
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'var(--acc)';
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'var(--line2)';
          }}
        />
        {error && (
          <span style={{ fontSize: '0.8rem', color: 'var(--alert)', fontFamily: 'var(--font-mono)' }}>
            ! {error}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSubmit('approve')}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--acc)',
            border: '1px solid var(--acc)',
            fontWeight: 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--ls-label)',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(127,255,212,0.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Aprovar Proposta
        </button>

        <button
          onClick={() => handleSubmit('reject')}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--alert)',
            border: '1px solid var(--alert)',
            fontWeight: 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--ls-label)',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,70,85,0.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Reprovar Proposta
        </button>

        <button
          onClick={() => handleSubmit('escalate')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--warn)',
            border: '1px solid var(--warn)',
            fontWeight: 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--ls-label)',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,184,77,0.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Escalar Caso
        </button>
      </div>
    </div>
  );
}
