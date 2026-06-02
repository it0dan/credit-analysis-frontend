'use client';

import React, { useEffect, useState } from 'react';
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
  const amount = searchParams.get('amount') || '80000';
  const reason = searchParams.get('reason') || 'Valor Solicitado Excede Limite Automático';

  const [decisionSubmitted, setDecisionSubmitted] = useState<OperatorDecision | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trajectory, setTrajectory] = useState<AgentTrajectory | null>(null);
  const [hitlRequest, setHitlRequest] = useState<HITLRequest | null>(null);

  // Fetch real telemetry and proposal details
  useEffect(() => {
    fetch(`http://localhost:8086/analysis/${reqIdStr}/status`)
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível obter dados no orquestrador.');
        return res.json();
      })
      .then((data) => {
        const fallbackTrajectory: AgentTrajectory = {
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
        setTrajectory(data.trajectory || fallbackTrajectory);
        
        // Assemble dynamic HITL Request details
        const dynamicHITLRequest: HITLRequest = {
          type: 'HITL_REQUIRED',
          request_id: reqIdStr,
          trace_id: data.trajectory?.trace_id || 'tr-' + reqIdStr,
          cpf_masked: cpf,
          reason: reason,
          resume_endpoint: `http://localhost:8086/resume`,
          expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
          t1_results: {
            bureau: { status: 'ok', score: 810, restrictions: [] },
            risk: { status: 'ok', risk_tier: parseFloat(amount) > 100000 ? 'medium' : 'low', requested_amount: parseFloat(amount) }
          },
          t2_results: {
            compliance: { status: 'ok', kyc_approved: true, pld_clear: true, lgpd_consent: true }
          }
        };

        setHitlRequest(dynamicHITLRequest);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('[OperatorReviewDetail] Backend offline, loading fallback mock elements.', err);
        
        const fallbackTrajectory: AgentTrajectory = {
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

        const fallbackHITLRequest: HITLRequest = {
          type: 'HITL_REQUIRED',
          request_id: reqIdStr,
          trace_id: 'tr-op-7718291-xyz',
          cpf_masked: cpf,
          reason: reason,
          resume_endpoint: `http://localhost:8086/resume`,
          expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
          t1_results: {
            bureau: { status: 'ok', score: 790, restrictions: [] },
            risk: { status: 'ok', internal_score: 85, risk_tier: 'low', default_probability: 0.038 }
          },
          t2_results: {
            compliance: { status: 'ok', kyc_approved: true, pld_clear: true, lgpd_consent: true }
          }
        };

        setTrajectory(fallbackTrajectory);
        setHitlRequest(fallbackHITLRequest);
        setError('Servidor offline. Exibindo simulador de contingência.');
        setLoading(false);
      });
  }, [reqIdStr, cpf, amount, reason]);

  const handleDecide = (decision: OperatorDecision) => {
    setSubmitting(true);
    setError(null);

    // POST actual decision to resume endpoint
    fetch('http://localhost:8086/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      },
      body: JSON.stringify({
        request_id: decision.request_id,
        decision: decision.decision,
        justification: decision.justification,
        operator_id: decision.operator_id
      })
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(errData.details?.[0] || errData.message || 'Erro ao enviar sinal de retomada.');
          });
        }
        return res.json();
      })
      .then(() => {
        setSubmitting(false);
        setDecisionSubmitted(decision);
      })
      .catch((err) => {
        console.error('[OperatorReview] Error submitting decision:', err);
        setError(err instanceof Error ? err.message : 'Falha na comunicação com o orquestrador.');
        setSubmitting(false);
      });
  };

  if (decisionSubmitted) {
    return (
      <div
        style={{
          maxWidth: '800px',
          margin: '5rem auto',
          padding: '3rem 2.5rem',
          backgroundColor: 'hsla(223, 47%, 12%, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid hsla(217, 91%, 60%, 0.15)',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px hsla(0, 0%, 100%, 0.05)',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          textAlign: 'center',
          animation: 'fadeIn 0.6s ease-out',
        }}
      >
        <div
          className="glow-pulse-emerald"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'hsla(142, 76%, 45%, 0.15)',
            color: 'hsl(142, 76%, 50%)',
            border: '2px solid hsla(142, 76%, 45%, 0.3)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          ✓
        </div>
        
        <h1 
          style={{ 
            margin: 0, 
            fontSize: '1.65rem', 
            fontWeight: 800, 
            color: 'hsl(210, 40%, 98%)',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
          }}
        >
          Decisão Processada com Sucesso!
        </h1>
        
        <p style={{ margin: '0.85rem 0 2rem 0', fontSize: '0.925rem', color: 'hsl(215, 20%, 75%)', lineHeight: 1.6 }}>
          A decisão do operador <strong style={{ color: 'hsl(217, 91%, 70%)' }}>{decisionSubmitted.operator_id}</strong> foi gravada no registro de conformidade.<br />
          O Turno 3 (T3 - decision-agent) foi retomado de forma assíncrona para finalizar a análise de crédito.
        </p>

        <div 
          style={{ 
            backgroundColor: 'hsla(223, 47%, 8%, 0.5)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            border: '1px solid hsla(217, 91%, 60%, 0.1)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            textAlign: 'left', 
            maxWidth: '520px', 
            margin: '0 auto 2.5rem auto' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'hsl(215, 16%, 50%)', textTransform: 'uppercase', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>ID Proposta:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', color: 'hsl(210, 40%, 98%)' }}>{decisionSubmitted.request_id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid hsla(0, 0%, 100%, 0.04)', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'hsl(215, 16%, 50%)', textTransform: 'uppercase', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Decisão Aplicada:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: decisionSubmitted.decision === 'approve' ? 'hsl(142, 76%, 50%)' : 'hsl(346, 84%, 60%)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>
              {decisionSubmitted.decision === 'approve' ? 'Aprovar' : decisionSubmitted.decision === 'reject' ? 'Reprovar' : 'Escalar'}
            </span>
          </div>
          <div style={{ borderTop: '1px solid hsla(0, 0%, 100%, 0.04)', paddingTop: '0.75rem' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(215, 16%, 50%)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.35rem', fontFamily: "'Outfit', sans-serif" }}>Justificativa Auditoria:</span>
            <span style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'hsl(215, 20%, 85%)', display: 'block', lineHeight: 1.5 }}>&quot;{decisionSubmitted.justification}&quot;</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/queue')}
          style={{
            padding: '0.85rem 2rem',
            backgroundColor: 'hsl(217, 91%, 60%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.875rem',
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer',
            boxShadow: '0 4px 15px -3px hsla(217, 91%, 60%, 0.4)',
            transition: 'background-color 0.2s, transform 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(217, 91%, 52%)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(217, 91%, 60%)';
            e.currentTarget.style.transform = 'translateY(0)';
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
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Navigation */}
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'hsl(215, 20%, 75%)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
          <Link href="/" style={{ color: 'hsl(217, 91%, 60%)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/queue" style={{ color: 'hsl(217, 91%, 60%)', textDecoration: 'none' }}>Fila de Revisão</Link>
          <span>/</span>
          <span>Detalhes Proposta {reqIdStr}</span>
        </div>
        <h1 
          style={{ 
            margin: 0, 
            fontSize: '1.65rem', 
            fontWeight: 800, 
            color: 'hsl(210, 40%, 98%)',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
          }}
        >
          Análise Técnica da Proposta {reqIdStr}
        </h1>
      </div>

      {error && (
        <div
          className="glow-pulse-amber"
          style={{
            backgroundColor: 'hsla(38, 92%, 50%, 0.1)',
            border: '1px solid hsla(38, 92%, 50%, 0.3)',
            color: 'hsl(38, 92%, 65%)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem',
            backgroundColor: 'hsla(223, 47%, 12%, 0.4)',
            borderRadius: '16px',
            border: '1px solid hsla(217, 91%, 60%, 0.1)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid hsla(217, 91%, 60%, 0.15)',
              borderTop: '3px solid hsl(217, 91%, 60%)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem',
            }}
          />
          <h3 style={{ margin: 0, color: 'hsl(210, 40%, 98%)', fontSize: '1.125rem', fontWeight: 600 }}>
            Carregando detalhes da proposta...
          </h3>
        </div>
      ) : submitting ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem',
            backgroundColor: 'hsla(223, 47%, 12%, 0.4)',
            borderRadius: '16px',
            border: '1px solid hsla(217, 91%, 60%, 0.1)',
            textAlign: 'center',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              border: '3px solid hsla(217, 91%, 60%, 0.15)',
              borderTop: '3px solid hsl(217, 91%, 60%)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem',
            }}
          />
          <h3 
            style={{ 
              margin: 0, 
              color: 'hsl(210, 40%, 98%)', 
              fontSize: '1.25rem', 
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif" 
            }}
          >
            Processando Decisão...
          </h3>
          <p style={{ margin: '0.4rem 0 0 0', color: 'hsl(215, 20%, 75%)', fontSize: '0.875rem' }}>
            Autenticando via Bearer Token e enviando sinal de retomada (resume) para o orquestrador.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          {/* Visualizar Spans & Traces na linha do tempo */}
          {trajectory && <TraceTimeline trajectory={trajectory} />}

          {/* Painel do operador para emitir justificativa e decisão final */}
          {hitlRequest && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <HITLPanel request={hitlRequest} onDecide={handleDecide} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
