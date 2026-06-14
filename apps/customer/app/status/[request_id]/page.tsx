'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { StatusBadge } from '@repo/ui/status-badge';
import { TraceTimeline } from '@repo/ui/trace-timeline';
import { CostDisplay } from '@repo/ui/cost-display';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Tag } from '@repo/ui/tag';
import { Pulse } from '@repo/ui/pulse';
import type { AgentTrajectory, CreditAnalysisStatus } from '@repo/types';

export default function CustomerStatusPage() {
  const { request_id } = useParams();
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf') || 'XXX.XXX.XXX-XX';
  const amount = searchParams.get('amount') || '50000';

  const reqIdStr = (Array.isArray(request_id) ? request_id[0] : request_id) || 'req-xyz';

  const [status, setStatus] = useState<CreditAnalysisStatus>('pending');
  const [trajectory, setTrajectory] = useState<AgentTrajectory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  const [simState, setSimState] = useState({
    status: 'pending',
    trajectory: null as AgentTrajectory | null,
    error: null as string | null,
  });

  useEffect(() => {
    let active = true;
    let pollTimer: NodeJS.Timeout;
    let failureCount = 0;

    const poll = () => {
      fetch(`http://localhost:8086/analysis/${reqIdStr}/status`)
        .then((res) => {
          if (!res.ok) throw new Error('Falha ao consultar status.');
          return res.json();
        })
        .then((data) => {
          if (!active) return;
          failureCount = 0;
          setStatus(data.status);
          setTrajectory(data.trajectory);
          setError(null);
          setIsSimulated(false);
          if (data.status === 'pending' || data.status === 'analyzing') {
            pollTimer = setTimeout(poll, 2000);
          }
        })
        .catch((err) => {
          if (!active) return;
          console.warn('[Status] Polling failed, retrying...', err);
          failureCount++;
          if (failureCount >= 3) {
            setIsSimulated(true);
            setError(null);
          } else {
            pollTimer = setTimeout(poll, 2000);
          }
        });
    };

    poll();
    return () => {
      active = false;
      clearTimeout(pollTimer);
    };
  }, [reqIdStr]);

  useEffect(() => {
    if (isSimulated) {
      const timer1 = setTimeout(() => {
        setSimState({
          status: 'analyzing',
          error: null,
          trajectory: {
            request_id: reqIdStr,
            trace_id: 'tr-mock-1002931',
            phases: [
              { agent: 'bureau', phase: 'T1', status: 'success', latency_ms: 1200, span_id: 'span-bureau-1' },
              { agent: 'risk', phase: 'T1', status: 'success', latency_ms: 1540, span_id: 'span-risk-1' },
            ],
            finops: { estimated_cost_brl: 0.0452 },
          },
        });
      }, 1500);

      const timer2 = setTimeout(() => {
        setSimState((prev) => ({
          ...prev,
          status: 'analyzing',
          trajectory: {
            request_id: reqIdStr,
            trace_id: 'tr-mock-1002931',
            phases: [
              ...(prev.trajectory?.phases || []),
              { agent: 'compliance', phase: 'T2', status: 'success', latency_ms: 2200, span_id: 'span-compliance-2' },
            ],
            finops: { estimated_cost_brl: 0.0894 },
          },
        }));
      }, 3500);

      const timer3 = setTimeout(() => {
        const isApproved = parseFloat(amount) <= 50000;
        setSimState((prev) => ({
          status: isApproved ? 'approved' : 'hitl_required',
          error: null,
          trajectory: {
            request_id: reqIdStr,
            trace_id: 'tr-mock-1002931',
            phases: [
              ...(prev.trajectory?.phases || []),
              ...(isApproved
                ? [{ agent: 'decision', phase: 'T3' as const, status: 'success' as const, latency_ms: 850, span_id: 'span-decision-3' }]
                : []),
            ],
            finops: { estimated_cost_brl: isApproved ? 0.1205 : 0.0894 },
          },
        }));
      }, 6000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isSimulated, reqIdStr, amount]);

  const activeStatus = isSimulated ? simState.status : status;
  const activeTrajectory = isSimulated ? simState.trajectory : trajectory;
  const activeError = isSimulated ? simState.error : error;

  return (
    <CockpitLayout activeLink="status" portalType="customer" request_id={reqIdStr}>
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--surf)',
            padding: '1.5rem 2rem',
            border: '1px solid var(--line)',
            borderLeft: '2px solid var(--acc)',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <Tag dim="live">análise em curso</Tag>
            <h1
              style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: 200,
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-0.02em',
              }}
            >
              Análise em <span style={{ color: 'var(--acc)' }}>tempo real</span>
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              ID: <strong style={{ color: 'var(--blue)' }}>{reqIdStr}</strong>
              {' | '}CPF: {cpf}
              {' | '}Valor: <strong style={{ color: 'var(--text)' }}>R$ {parseFloat(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(activeStatus === 'pending' || activeStatus === 'analyzing') && <Pulse color="acc" size={7} label="processando" />}
            {isSimulated && (
              <span
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--warn)',
                  border: '1px solid var(--warn)',
                  padding: '0.2rem 0.5rem',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--ls-label)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Simulação Fallback
              </span>
            )}
            <StatusBadge status={activeStatus as CreditAnalysisStatus} />
          </div>
        </div>

        {activeError && (
          <div
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--alert)',
              borderLeft: '2px solid var(--alert)',
              color: 'var(--alert)',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ! {activeError}
          </div>
        )}

        {/* Trajectory / Loading */}
        {activeTrajectory ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <TraceTimeline trajectory={activeTrajectory} />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--surf)',
                padding: '1.25rem 1.75rem',
                border: '1px solid var(--line)',
                borderLeft: '2px solid var(--acc)',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '0.875rem', color: 'var(--muted)', flex: 1, minWidth: '280px' }}>
                {activeStatus === 'approved' && '→ Proposta pré-aprovada com sucesso pelos agentes de crédito.'}
                {activeStatus === 'rejected' && '! Proposta recusada em conformidade com as políticas regulatórias.'}
                {activeStatus === 'hitl_required' && '~ Valor acima do limite automático. Encaminhado para revisão humana.'}
                {(activeStatus === 'pending' || activeStatus === 'analyzing') && <><span style={{ color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>→</span> Processando nos turnos multiagentes em tempo real...</>}
              </span>
              <CostDisplay cost_brl={activeTrajectory.finops.estimated_cost_brl} />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem 4rem',
              backgroundColor: 'var(--surf)',
              border: '1px solid var(--line)',
              borderLeft: '2px solid var(--acc)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid var(--line2)',
                borderTop: '1px solid var(--acc)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1.25rem',
              }}
            />
            <h3
              style={{
                margin: 0,
                color: 'var(--text)',
                fontSize: '1rem',
                fontWeight: 200,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Conectando aos Agentes...
            </h3>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
              Aguardando sinal do orquestrador para iniciar a análise por turnos cognitivos.
            </p>
          </div>
        )}
      </div>
    </CockpitLayout>
  );
}
