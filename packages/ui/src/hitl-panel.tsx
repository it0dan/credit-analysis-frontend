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
      setError(`Sua justificativa é muito curta (${trimmed.length} caracteres). É obrigatório conter no mínimo 50 caracteres para fins de auditoria de conformidade.`);
      return;
    }

    if (trimmed.length > 300) {
      setError(`Sua justificativa é muito longa (${trimmed.length} caracteres). Deve conter no máximo 300 caracteres.`);
      return;
    }

    setError(null);
    onDecide({
      request_id: request.request_id,
      decision: decisionType,
      justification: trimmed,
      operator_id: 'OP-1002', // Fictional mock operator id
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        padding: '2rem',
        backgroundColor: 'hsla(223, 47%, 12%, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid hsla(217, 91%, 60%, 0.15)',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px hsla(0, 0%, 100%, 0.05)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: 'hsl(210, 40%, 98%)',
        maxWidth: '780px',
        width: '100%',
        animation: 'fadeIn 0.6s ease-out',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '1px solid hsla(0, 0%, 100%, 0.05)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 
            style={{ 
              margin: 0, 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              color: 'hsl(210, 40%, 98%)',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            Painel de Revisão Humana (HITL)
          </h2>
          <span
            className="glow-pulse-amber"
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'hsla(38, 92%, 50%, 0.1)',
              color: 'hsl(38, 92%, 65%)',
              border: '1px solid hsla(38, 92%, 50%, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Aguardando Operador
          </span>
        </div>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'hsl(215, 20%, 75%)' }}>
          Solicitação: <strong style={{ color: 'hsl(217, 91%, 70%)', fontFamily: 'monospace' }}>{request.request_id}</strong> | Trace: <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{request.trace_id}</span>
        </p>
      </div>

      {/* Overview Metadata */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.25rem', 
          backgroundColor: 'hsla(223, 47%, 8%, 0.5)', 
          padding: '1.25rem', 
          borderRadius: '12px',
          border: '1px solid hsla(217, 91%, 60%, 0.08)'
        }}
      >
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'hsl(215, 16%, 50%)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>CPF do Solicitante</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(210, 40%, 98%)', fontFamily: 'monospace' }}>{request.cpf_masked}</span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'hsl(215, 16%, 50%)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Gatilho de Intervenção</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'hsl(346, 84%, 61%)', textShadow: '0 0 10px hsla(346, 84%, 61%, 0.15)' }}>{request.reason}</span>
        </div>
      </div>

      {/* T1 and T2 Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'hsl(215, 20%, 75%)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Relatório do Turno 1 (T1)</h4>
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              backgroundColor: 'hsla(223, 47%, 8%, 0.6)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              maxHeight: '160px',
              overflowY: 'auto',
              border: '1px solid hsla(217, 91%, 60%, 0.1)',
              fontFamily: 'monospace',
              color: 'hsl(217, 91%, 85%)',
            }}
          >
            {JSON.stringify(request.t1_results, null, 2)}
          </pre>
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'hsl(215, 20%, 75%)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Relatório do Turno 2 (T2)</h4>
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              backgroundColor: 'hsla(223, 47%, 8%, 0.6)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              maxHeight: '160px',
              overflowY: 'auto',
              border: '1px solid hsla(217, 91%, 60%, 0.1)',
              fontFamily: 'monospace',
              color: 'hsl(217, 91%, 85%)',
            }}
          >
            {JSON.stringify(request.t2_results, null, 2)}
          </pre>
        </div>
      </div>

      {/* Operator input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="justification" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'hsl(215, 20%, 75%)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>
            Justificativa Técnica da Decisão *
          </label>
          <span style={{ fontSize: '0.75rem', color: justification.length >= 50 && justification.length <= 300 ? 'hsl(142, 76%, 55%)' : 'hsl(215, 16%, 50%)' }}>
            {justification.length} / 50-300 caracteres
          </span>
        </div>
        <textarea
          id="justification"
          placeholder="Descreva detalhadamente o parecer de aprovação ou reprovação para fins de auditoria obrigatória de crédito (mínimo 50 caracteres)..."
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            if (e.target.value.trim().length >= 50) setError(null);
          }}
          rows={4}
          style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'hsla(223, 47%, 8%, 0.5)',
            border: error ? '1px solid hsl(346, 84%, 61%)' : '1px solid hsla(217, 91%, 60%, 0.15)',
            color: 'hsl(210, 40%, 98%)',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'hsl(217, 91%, 60%)';
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'hsla(217, 91%, 60%, 0.15)';
          }}
        />
        {error && (
          <span style={{ fontSize: '0.8rem', color: 'hsl(346, 84%, 65%)', fontWeight: 600 }}>
            ⚠️ {error}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSubmit('approve')}
          style={{
            flex: 1,
            padding: '0.85rem 1.5rem',
            backgroundColor: 'hsl(142, 76%, 45%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif",
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            boxShadow: '0 4px 15px -3px hsla(142, 76%, 45%, 0.4)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(142, 76%, 38%)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(142, 76%, 45%)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Aprovar Proposta
        </button>

        <button
          onClick={() => handleSubmit('reject')}
          style={{
            flex: 1,
            padding: '0.85rem 1.5rem',
            backgroundColor: 'hsl(346, 84%, 61%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif",
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            boxShadow: '0 4px 15px -3px hsla(346, 84%, 61%, 0.4)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(346, 84%, 53%)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(346, 84%, 61%)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Reprovar Proposta
        </button>

        <button
          onClick={() => handleSubmit('escalate')}
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: 'hsla(38, 92%, 50%, 0.1)',
            color: 'hsl(38, 92%, 65%)',
            border: '1px solid hsla(38, 92%, 50%, 0.3)',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif",
            transition: 'background-color 0.2s ease, transform 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'hsla(38, 92%, 50%, 0.18)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'hsla(38, 92%, 50%, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Escalar Caso
        </button>
      </div>
    </div>
  );
}
