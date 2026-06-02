'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TraceTimeline } from '@repo/ui/trace-timeline';
import { HITLPanel } from '@repo/ui/hitl-panel';
import type { HITLRequest, OperatorDecision, AgentTrajectory } from '@repo/types';

export default function OperatorReviewDetailPage() {
  const { request_id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const reqIdStr = (Array.isArray(request_id) ? request_id[0] : request_id) || 'be70725f';
  const cpf = searchParams.get('cpf') || '***.723.109-**';
  const reason = searchParams.get('reason') || 'Valor Solicitado Excede Limite Automático';

  const [decisionSubmitted, setDecisionSubmitted] = useState<OperatorDecision | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mock results of T1 and T2 to supply to the HITLPanel review
  const mockHITLRequest: HITLRequest = {
    type: 'HITL_REQUIRED',
    request_id: reqIdStr,
    trace_id: 'tr-op-7718291-xyz',
    cpf_masked: cpf,
    reason: reason,
    resume_endpoint: `/v1/analysis/${reqIdStr}/resume`,
    expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
    t1_results: {
      bureau: {
        status: 'ok',
        score: 790,
        restrictions: [],
        trace_id: 'tr-op-7718291-xyz',
      },
      risk: {
        status: 'ok',
        internal_score: 85,
        risk_tier: 'low',
        default_probability: 0.038,
        trace_id: 'tr-op-7718291-xyz',
      }
    },
    t2_results: {
      compliance: {
        status: 'ok',
        kyc_approved: true,
        pld_clear: true,
        lgpd_consent: true,
        trace_id: 'tr-op-7718291-xyz',
      }
    }
  };

  // Mock trajectory demonstrating that T1 and T2 executed successfully,
  // but T3 (decision) was never run yet (paused for HITL)
  const mockTrajectory: AgentTrajectory = {
    request_id: reqIdStr,
    trace_id: 'tr-op-7718291-xyz',
    phases: [
      { agent: 'bureau', phase: 'T1', status: 'success', latency_ms: 1100, span_id: 'span-op-bureau-1' },
      { agent: 'risk', phase: 'T1', status: 'success', latency_ms: 1450, span_id: 'span-op-risk-1' },
      { agent: 'compliance', phase: 'T2', status: 'success', latency_ms: 1980, span_id: 'span-op-compliance-2' },
    ],
    finops: {
      estimated_cost_brl: 0.0784
    }
  };

  const handleDecide = (decision: OperatorDecision) => {
    setSubmitting(true);
    
    // Simulate sending operator decision to the gateway's /resume endpoint
    setTimeout(() => {
      setSubmitting(false);
      setDecisionSubmitted(decision);
      console.log('[Operator] Decision sent successfully:', decision);
    }, 1500);
  };

  if (decisionSubmitted) {
    return (
      <div
        style={{
          maxWidth: '800px',
          margin: '4rem auto',
          padding: '3rem 2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            color: '#059669',
            fontSize: '2rem',
            marginBottom: '1.5rem',
          }}
        >
          ✓
        </div>
        
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
          Decisão Processada com Sucesso!
        </h1>
        
        <p style={{ margin: '0.75rem 0 2rem 0', fontSize: '0.925rem', color: '#6B7280', lineHeight: 1.6 }}>
          A decisão do operador <strong style={{ color: '#374151' }}>{decisionSubmitted.operator_id}</strong> foi enviada com sucesso para o endpoint de retomada de fluxo <code>/resume</code>.<br />
          O Turno 3 (T3 - decision-agent) foi disparado assincronamente e a proposta seguiu seu ciclo final.
        </p>

        <div style={{ backgroundColor: '#F9FAFB', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.825rem', color: '#6B7280' }}>ID Proposta:</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'monospace' }}>{decisionSubmitted.request_id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.825rem', color: '#6B7280' }}>Decisão Aplicada:</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: decisionSubmitted.decision === 'approve' ? '#059669' : '#DC2626', textTransform: 'uppercase' }}>
              {decisionSubmitted.decision === 'approve' ? 'Aprovar' : decisionSubmitted.decision === 'reject' ? 'Reprovar' : 'Escalar'}
            </span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.825rem', color: '#6B7280', marginBottom: '0.25rem' }}>Justificativa:</span>
            <span style={{ fontSize: '0.875rem', fontStyle: 'italic', color: '#374151' }}>&quot;{decisionSubmitted.justification}&quot;</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/queue')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
          }}
        >
          Voltar para a Fila de Revisão
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#FAFAFA',
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      {/* Navigation */}
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
          <Link href="/" style={{ color: '#4F46E5', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/queue" style={{ color: '#4F46E5', textDecoration: 'none' }}>Fila de Revisão</Link>
          <span>/</span>
          <span>Detalhes Proposta {reqIdStr}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
          Análise Técnica da Proposta {reqIdStr}
        </h1>
      </div>

      {submitting ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #4F46E5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem',
            }}
          />
          <h3 style={{ margin: 0, color: '#374151', fontSize: '1.125rem', fontWeight: 600 }}>
            Processando Decisão...
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.875rem' }}>
            Autenticando via Bearer Token e enviando sinal de retomada (resume) para o orquestrador.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          {/* Visualizar Spans & Traces na linha do tempo */}
          <TraceTimeline trajectory={mockTrajectory} />

          {/* Painel do operador para emitir justificativa e decisão final */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HITLPanel request={mockHITLRequest} onDecide={handleDecide} />
          </div>
        </div>
      )}
    </div>
  );
}
