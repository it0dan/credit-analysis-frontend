'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Tag } from '@repo/ui/tag';
import { Pulse } from '@repo/ui/pulse';

interface QueueItem {
  request_id: string;
  cpf_masked: string;
  reason: string;
  amount: number;
  date: string;
  status: string;
  trace_id?: string;
  current_phase?: 'T1' | 'T2' | 'T3';
  latency_ms?: number;
  cost_brl?: number;
}

export default function OperatorQueue() {
  const auth = useAuth();

  const [pendingRequests, setPendingRequests] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8086/queue')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao obter lista de propostas na fila.');
        return res.json();
      })
      .then((data) => {
        setPendingRequests(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.warn('[OperatorQueue] Could not reach backend queue, loading mock simulation.', err);
        setPendingRequests([
          { request_id: 'be70725f', cpf_masked: '***.723.109-**', reason: 'Valor Solicitado Excede Limite Automático', amount: 80000, date: new Date(Date.now() - 3600 * 1000).toISOString(), status: 'pending_human_review', trace_id: 'tr-op-7718291-xyz', current_phase: 'T2', latency_ms: 1980, cost_brl: 0.078 },
          { request_id: '3e49e394', cpf_masked: '***.990.221-**', reason: 'Indisponibilidade Técnica do Bureau', amount: 10000, date: new Date(Date.now() - 1800 * 1000).toISOString(), status: 'pending_human_review', trace_id: 'tr-op-8831002-abc', current_phase: 'T1', latency_ms: 1450, cost_brl: 0.044 },
          { request_id: '7acf5b19', cpf_masked: '***.103.882-**', reason: 'Valor Solicitado Excede Limite Automático', amount: 120000, date: new Date(Date.now() - 900 * 1000).toISOString(), status: 'pending_human_review', trace_id: 'tr-op-9917742-def', current_phase: 'T3', latency_ms: 2410, cost_brl: 0.096 },
        ]);
        setError('Servidor offline. Exibindo propostas em cache de simulação.');
        setLoading(false);
      });
  }, []);

  return (
    <CockpitLayout activeLink="queue" portalType="operator" liveState="idle">
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
              <Link href="/" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <span>Fila de Revisão</span>
            </div>
            <Tag dim={pendingRequests.length + ' casos'}>fila</Tag>
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
              Fila de <span style={{ color: 'var(--acc)' }}>análise</span>
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--muted)' }}>
              Selecione uma proposta para analisar spans e processar a decisão de retomada.
            </p>
          </div>
          {auth && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted)',
                border: '1px solid var(--line)',
                padding: '0.5rem 1rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Operador: <span style={{ color: 'var(--acc)' }}>{auth.id}</span>
            </span>
          )}
        </div>

        {error && (
          <div
            style={{
              border: '1px solid var(--warn)',
              borderLeft: '2px solid var(--warn)',
              color: 'var(--warn)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ~ {error}
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
              backgroundColor: 'var(--surf)',
              border: '1px solid var(--line)',
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
                marginBottom: '1rem',
              }}
            />
            <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '0.9rem', fontWeight: 200, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pulse color="acc" size={7} />
              Carregando propostas pendentes...
            </h3>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem',
              backgroundColor: 'var(--surf)',
              border: '1px solid var(--line)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: 0, color: 'var(--acc)', fontSize: '1rem', fontWeight: 200, fontFamily: 'var(--font-mono)' }}>
              Fila limpa. Nenhuma proposta pendente.
            </h3>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--muted)', fontSize: '0.875rem' }}>
              Todas as decisões automáticas e manuais estão em dia.
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--surf)',
              border: '1px solid var(--line)',
              borderLeft: '1px solid var(--acc)',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1040px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--line2)' }}>
                    {['ID Proposta', 'Trace', 'Fase', 'Latência', 'Custo', 'Gatilho / Razão', 'Valor Solicitado', 'Ações'].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.65rem',
                          fontWeight: 400,
                          color: 'var(--muted)',
                          textTransform: 'uppercase',
                          letterSpacing: 'var(--ls-label)',
                          fontFamily: 'var(--font-mono)',
                          textAlign: i === 7 ? 'right' : 'left',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((item) => (
                    <tr
                      key={item.request_id}
                      style={{ borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line2)' }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--acc)'; e.currentTarget.style.borderLeftColor = 'var(--acc)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.borderLeftColor = 'var(--line2)'; }}
                    >
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Pulse color="acc" size={6} />
                          {item.request_id}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                        {(item.trace_id || 'tr-pending').slice(0, 14)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>
                        {item.current_phase || 'T1'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                        {item.latency_ms ?? 0}ms
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>
                        R$ {(item.cost_brl ?? 0).toFixed(3)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--warn)' }}>
                        {item.reason}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                        R$ {item.amount.toLocaleString('pt-BR')}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>
                        <Link
                          href={`/queue/${item.request_id}?cpf=${encodeURIComponent(item.cpf_masked)}&amount=${item.amount}&reason=${encodeURIComponent(item.reason)}`}
                          style={{
                            display: 'inline-flex',
                            padding: '0.45rem 1rem',
                            backgroundColor: 'transparent',
                            color: 'var(--acc)',
                            border: '1px solid var(--acc)',
                            textDecoration: 'none',
                            fontWeight: 400,
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--ls-label)',
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(127,255,212,0.05)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          Analisar & Decidir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CockpitLayout>
  );
}
