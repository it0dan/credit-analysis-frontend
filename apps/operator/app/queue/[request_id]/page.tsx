'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TraceTimeline } from '@repo/ui/trace-timeline';
import { CostDisplay } from '@repo/ui/cost-display';
import { ReasoningStream } from '@repo/ui/reasoning-stream';
import { HITLPanel } from '@repo/ui/hitl-panel';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Tag } from '@repo/ui/tag';
import { Pulse } from '@repo/ui/pulse';
import { useAgentStream } from '@repo/ag-ui-client';
import type { HITLRequest, OperatorDecision, AgentTrajectory, ReasoningChunk } from '@repo/types';


function reasoning(agent: string): ReasoningChunk[] {
  const matrix: Record<string, Omit<ReasoningChunk, 'timestamp_ms'>[]> = {
    bureau: [
      { kind: 'thought', text_human: 'Consultando seu CPF no bureau de crédito', text_debug: 'tool=bureau_get_score input=cpf_masked request_id' },
      { kind: 'tool_call', text_human: 'Score recuperado · histórico de 24 meses analisado', text_debug: 'result.score=790 restrictions=[] latency_budget=1500ms' },
      { kind: 'conclusion', text_human: 'Histórico de crédito confirmado', text_debug: 'bureau.status=ok span=bureau' },
    ],
    risk: [
      { kind: 'thought', text_human: 'Calculando seu perfil de risco', text_debug: 'tool=risk_evaluate inputs=bureau_score income_value requested_amount' },
      { kind: 'tool_call', text_human: 'Considerando histórico, perfil e valor solicitado', text_debug: 'default_probability=0.03 risk_tier=low' },
      { kind: 'conclusion', text_human: 'Avaliação concluída', text_debug: 'risk.status=ok internal_score=88' },
    ],
    compliance: [
      { kind: 'thought', text_human: 'Conferindo conformidade regulatória', text_debug: 'tool=compliance_check inputs=cpf_masked request_id' },
      { kind: 'tool_call', text_human: 'Verificações KYC e PLD em curso', text_debug: 'kyc=true pld=true lgpd=true' },
      { kind: 'conclusion', text_human: 'Conformidade aprovada', text_debug: 'compliance.status=ok tools=verify_kyc,check_pld,verify_lgpd_consent' },
    ],
    decision: [
      { kind: 'thought', text_human: 'Sintetizando a decisão final', text_debug: 'tool=decision_synthesize inputs=t1,t2,requested_amount' },
      { kind: 'tool_call', text_human: 'Cruzando todos os sinais', text_debug: 'decision_model=explainable_synthesis' },
      { kind: 'conclusion', text_human: 'Encaminhada para análise humana', text_debug: 'final.status=hitl_required reason=threshold_exceeded' },
    ],
  };
  return (matrix[agent] ?? []).map((chunk, index) => ({ ...chunk, timestamp_ms: [300, 900, 1500][index] ?? 1500 }));
}

export default function OperatorReviewDetailPage() {
  const { request_id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const reqIdStr = (Array.isArray(request_id) ? request_id[0] : request_id) || 'be70725f';
  const cpf = searchParams.get('cpf') || '***.723.109-**';
  const amount = searchParams.get('amount') || '80000';
  const reason = searchParams.get('reason') || 'Valor Solicitado Excede Limite Automático';
  const orchestratorUrl = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL ?? 'http://localhost:8086';
  const stream = useAgentStream(`${orchestratorUrl}/analysis/${reqIdStr}/events`);

  const [decisionSubmitted, setDecisionSubmitted] = useState<OperatorDecision | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trajectory, setTrajectory] = useState<AgentTrajectory | null>(null);
  const [hitlRequest, setHitlRequest] = useState<HITLRequest | null>(null);

  useEffect(() => {
    if (stream.trajectory) setTrajectory(stream.trajectory);
    if (stream.hitlRequest) {
      setHitlRequest((current) => current ? { ...current, reason: stream.hitlRequest?.reason ?? current.reason } : stream.hitlRequest);
    }
  }, [stream.hitlRequest, stream.trajectory]);

  useEffect(() => {
    const fallbackTrajectory: AgentTrajectory = {
      request_id: reqIdStr,
      trace_id: 'tr-op-7718291-xyz',
      phases: [
        { agent: 'bureau', phase: 'T1', status: 'success', latency_ms: 1100, span_id: 'span-op-bureau-1', reasoning: reasoning('bureau') },
        { agent: 'risk', phase: 'T1', status: 'success', latency_ms: 1450, span_id: 'span-op-risk-1', reasoning: reasoning('risk') },
        { agent: 'compliance', phase: 'T2', status: 'success', latency_ms: 1980, span_id: 'span-op-compliance-2', reasoning: reasoning('compliance') },
      ],
      finops: { estimated_cost_brl: 0.0784 },
    };

    const buildHITL = (traceId: string): HITLRequest => ({
      type: 'HITL_REQUIRED',
      request_id: reqIdStr,
      trace_id: traceId,
      cpf_masked: cpf,
      reason,
      resume_endpoint: 'http://localhost:8086/resume',
      expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
      t1_results: {
        bureau: { status: 'ok', score: 790, restrictions: [] },
        risk: { status: 'ok', risk_tier: parseFloat(amount) > 100000 ? 'medium' : 'low', requested_amount: parseFloat(amount) },
      },
      t2_results: {
        compliance: { status: 'ok', kyc_approved: true, pld_clear: true, lgpd_consent: true },
      },
    });

    fetch(`${orchestratorUrl}/analysis/${reqIdStr}/status`)
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao obter dados.');
        return res.json();
      })
      .then((data) => {
        setTrajectory(data.trajectory || fallbackTrajectory);
        setHitlRequest(buildHITL(data.trajectory?.trace_id || 'tr-' + reqIdStr));
        setLoading(false);
      })
      .catch((err) => {
        console.warn('[OperatorReviewDetail] Backend offline, loading fallback.', err);
        setTrajectory(fallbackTrajectory);
        setHitlRequest(buildHITL('tr-op-7718291-xyz'));
        setError('Servidor offline. Exibindo simulador de contingência.');
        setLoading(false);
      });
  }, [reqIdStr, cpf, amount, reason, orchestratorUrl]);

  const handleDecide = (decision: OperatorDecision) => {
    setSubmitting(true);
    setError(null);

    fetch(`${orchestratorUrl}/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer mock-token' },
      body: JSON.stringify({
        request_id: decision.request_id,
        decision: decision.decision,
        justification: decision.justification,
        operator_id: decision.operator_id,
      }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => { throw new Error(e.details?.[0] || e.message || 'Erro ao enviar decisão.'); });
        return res.json();
      })
      .then(() => {
        setSubmitting(false);
        setDecisionSubmitted(decision);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Falha na comunicação com o orquestrador.');
        setSubmitting(false);
      });
  };

  const spinnerEl = (
    <div
      style={{
        width: '32px',
        height: '32px',
        border: '1px solid var(--line2)',
        borderTop: '1px solid var(--acc)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem',
      }}
    />
  );

  return (
    <CockpitLayout activeLink="queue" portalType="operator" onSignOut={() => { window.location.href = 'http://localhost:3000/logout'; }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
            <Link href="/" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/queue" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Fila de Revisão</Link>
            <span>/</span>
            <span>{reqIdStr}</span>
          </div>
          <Tag dim="caso em análise">decisão pendente</Tag>
          <h1
            style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 200,
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.02em',
            }}
          >
            Análise de <span style={{ color: 'var(--acc)' }}>caso</span> — {reqIdStr}
          </h1>
        </div>

        {error && (
          <div
            style={{
              border: '1px solid var(--warn)',
              borderLeft: '2px solid var(--warn)',
              color: 'var(--warn)',
              padding: '0.85rem 1.25rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1.5rem',
            }}
          >
            ~ {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem', backgroundColor: 'var(--surf)', border: '1px solid var(--line)', textAlign: 'center' }}>
            {spinnerEl}
            <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '0.9rem', fontWeight: 200, fontFamily: 'var(--font-mono)' }}>
              Carregando detalhes da proposta...
            </h3>
          </div>
        ) : submitting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem', backgroundColor: 'var(--surf)', border: '1px solid var(--line)', textAlign: 'center' }}>
            {spinnerEl}
            <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '0.9rem', fontWeight: 200, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pulse color="acc" size={7} />
              Processando Decisão...
            </h3>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
              Enviando sinal de retomada para o orquestrador.
            </p>
          </div>
        ) : decisionSubmitted ? (
          <div
            style={{
              maxWidth: '680px',
              margin: '3rem auto',
              padding: '2.5rem',
              backgroundColor: 'var(--surf)',
              border: '1px solid var(--line)',
              borderLeft: '2px solid var(--acc)',
              textAlign: 'center',
              animation: 'fadeIn 0.4s ease-out',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                color: 'var(--acc)',
                border: '1px solid var(--acc)',
                fontSize: '1.5rem',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ✓
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 200,
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-0.01em',
              }}
            >
              Decisão Processada com Sucesso
            </h1>

            <p style={{ margin: '0.75rem 0 1.5rem 0', fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              A decisão do operador <strong style={{ color: 'var(--acc)' }}>{decisionSubmitted.operator_id}</strong> foi gravada.{' '}
              O T3 (decision-agent) foi retomado de forma assíncrona.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg)',
                padding: '1.25rem',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                textAlign: 'left',
                maxWidth: '440px',
                margin: '0 auto 2rem auto',
              }}
            >
              {[
                { label: 'ID Proposta', value: decisionSubmitted.request_id },
                { label: 'Decisão', value: decisionSubmitted.decision === 'approve' ? 'Aprovado' : decisionSubmitted.decision === 'reject' ? 'Reprovado' : 'Escalado' },
                { label: 'Justificativa', value: `"${decisionSubmitted.justification}"` },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ borderTop: i > 0 ? '1px solid var(--line)' : undefined, paddingTop: i > 0 ? '0.6rem' : undefined }}>
                  <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: label === 'Decisão' ? 'var(--acc)' : 'var(--text)', fontFamily: 'var(--font-mono)', fontStyle: label === 'Justificativa' ? 'italic' : 'normal' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/queue')}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: 'transparent',
                color: 'var(--acc)',
                border: '1px solid var(--acc)',
                fontWeight: 400,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label)',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(127,255,212,0.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Voltar para a Fila
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {trajectory && (
              <>
                <ReasoningStream phases={trajectory.phases} analysisStatus="hitl_required" isLive={false} />
                <TraceTimeline trajectory={trajectory} />
                <CostDisplay cost_brl={trajectory.finops.estimated_cost_brl} />
              </>
            )}
            {hitlRequest && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HITLPanel request={hitlRequest} onDecide={handleDecide} />
              </div>
            )}
          </div>
        )}
      </div>
    </CockpitLayout>
  );
}
