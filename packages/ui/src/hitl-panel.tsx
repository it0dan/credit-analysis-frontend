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
    if (!justification.trim()) {
      setError('A justificativa é obrigatória para processar a decisão.');
      return;
    }

    setError(null);
    onDecide({
      request_id: request.request_id,
      decision: decisionType,
      justification: justification.trim(),
      operator_id: 'OP-1002', // Fictional mock operator id
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
        fontFamily: 'Inter, system-ui, sans-serif',
        maxWidth: '750px',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
            Painel de Revisão Humana (HITL)
          </h2>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              border: '1px solid #FCD34D',
            }}
          >
            Aguardando Operador
          </span>
        </div>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
          Solicitação: <strong style={{ color: '#374151' }}>{request.request_id}</strong> | Trace: {request.trace_id}
        </p>
      </div>

      {/* Overview Metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '8px' }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>CPF do Solicitante</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', fontFamily: 'monospace' }}>{request.cpf_masked}</span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>Gatilho de Intervenção</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#DC2626' }}>{request.reason}</span>
        </div>
      </div>

      {/* T1 and T2 Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#4B5563' }}>Relatório do Turno 1 (T1)</h4>
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              fontSize: '0.75rem',
              maxHeight: '150px',
              overflowY: 'auto',
              border: '1px solid #E5E7EB',
              fontFamily: 'monospace',
              color: '#1F2937',
            }}
          >
            {JSON.stringify(request.t1_results, null, 2)}
          </pre>
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#4B5563' }}>Relatório do Turno 2 (T2)</h4>
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              fontSize: '0.75rem',
              maxHeight: '150px',
              overflowY: 'auto',
              border: '1px solid #E5E7EB',
              fontFamily: 'monospace',
              color: '#1F2937',
            }}
          >
            {JSON.stringify(request.t2_results, null, 2)}
          </pre>
        </div>
      </div>

      {/* Operator input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="justification" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4B5563' }}>
          Justificativa Técnica da Decisão *
        </label>
        <textarea
          id="justification"
          placeholder="Descreva detalhadamente o parecer de aprovação, reprovação ou escalonamento desta proposta..."
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            if (e.target.value.trim()) setError(null);
          }}
          rows={4}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: error ? '1px solid #EF4444' : '1px solid #D1D5DB',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
          }}
        />
        {error && (
          <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 500 }}>
            ⚠️ {error}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSubmit('approve')}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
        >
          Aprovar Crédito
        </button>

        <button
          onClick={() => handleSubmit('reject')}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}
        >
          Reprovar Proposta
        </button>

        <button
          onClick={() => handleSubmit('escalate')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#FFFBEB',
            color: '#D97706',
            border: '1px solid #FCD34D',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF3C7';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFBEB';
          }}
        >
          Escalar Caso
        </button>
      </div>
    </div>
  );
}
