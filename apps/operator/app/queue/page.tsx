'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';
import { CockpitLayout } from '@repo/ui/cockpit-layout';

interface QueueItem {
  request_id: string;
  cpf_masked: string;
  reason: string;
  amount: number;
  date: string;
  status: string;
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
        
        // Dynamic simulated queue that matches realistic requirements
        const fallbackRequests: QueueItem[] = [
          {
            request_id: 'be70725f',
            cpf_masked: '***.723.109-**',
            reason: 'Valor Solicitado Excede Limite Automático',
            amount: 80000,
            date: new Date(Date.now() - 3600 * 1000).toISOString(),
            status: 'pending_human_review',
          },
          {
            request_id: '3e49e394',
            cpf_masked: '***.990.221-**',
            reason: 'Indisponibilidade Técnica do Bureau',
            amount: 10000,
            date: new Date(Date.now() - 1800 * 1000).toISOString(),
            status: 'pending_human_review',
          },
          {
            request_id: '7acf5b19',
            cpf_masked: '***.103.882-**',
            reason: 'Valor Solicitado Excede Limite Automático',
            amount: 120000,
            date: new Date(Date.now() - 900 * 1000).toISOString(),
            status: 'pending_human_review',
          }
        ];

        setPendingRequests(fallbackRequests);
        setError('Servidor offline. Exibindo propostas em cache de simulação.');
        setLoading(false);
      });
  }, []);

  return (
    <CockpitLayout activeLink="queue" portalType="operator">
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header and navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-heading)", fontWeight: 700 }}>
              <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <span>Fila de Revisão</span>
            </div>
            <h1 
              style={{ 
                margin: 0, 
                fontSize: '1.65rem', 
                fontWeight: 800, 
                color: 'var(--text-primary)',
                fontFamily: "var(--font-heading)",
                letterSpacing: '-0.02em',
              }}
            >
              Fila de Solicitações Pendentes
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Selecione uma proposta abaixo para analisar spans de turnos e processar a decisão de retomada (resume).
            </p>
          </div>
          {auth && (
            <span 
              style={{ 
                fontSize: '0.825rem', 
                color: 'var(--text-primary)', 
                backgroundColor: 'var(--bg-card)', 
                backdropFilter: 'blur(8px)',
                padding: '0.6rem 1.25rem', 
                borderRadius: '8px', 
                border: 'var(--border-glass)', 
                fontWeight: 700,
                fontFamily: "var(--font-heading)"
              }}
            >
              👤 Operador: {auth.user_id}
            </span>
          )}
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
              marginBottom: '2rem',
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
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: 'var(--border-glass)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-glass)',
                borderTop: '3px solid var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem',
              }}
            />
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 600 }}>
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
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: 'var(--border-glass)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, fontFamily: "var(--font-heading)" }}>
              Fila limpa! Nenhuma proposta pendente.
            </h3>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Todas as decisões automáticas e manuais estão em dia.
            </p>
          </div>
        ) : (
          /* Main Table Content - Glassmorphism Table Container */
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: 'var(--border-glass)',
              boxShadow: 'var(--shadow-main), inset 0 1px 1px hsla(0, 0%, 100%, 0.05)',
              overflow: 'hidden',
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.02)', borderBottom: '1px solid var(--border-glass)' }}>
                    <th style={{ padding: '1.25rem 1.75rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "var(--font-heading)" }}>ID Proposta</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "var(--font-heading)" }}>CPF Mascarado</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "var(--font-heading)" }}>Gatilho / Razão</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "var(--font-heading)" }}>Valor Solicitado</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "var(--font-heading)" }}>Vencimento</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "var(--font-heading)", textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((item) => (
                    <tr
                      key={item.request_id}
                      style={{
                        borderBottom: '1px solid hsla(0, 0%, 100%, 0.05)',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-glow)')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '1.25rem 1.75rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                        {item.request_id}
                      </td>
                      <td style={{ padding: '1.25rem 1.75rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                        {item.cpf_masked}
                      </td>
                      <td style={{ padding: '1.25rem 1.75rem', fontSize: '0.875rem', color: 'var(--color-secondary)', fontWeight: 700 }}>
                        {item.reason}
                      </td>
                      <td style={{ padding: '1.25rem 1.75rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        R$ {item.amount.toLocaleString('pt-BR')}
                      </td>
                      <td style={{ padding: '1.25rem 1.75rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {new Date(item.date).toLocaleString('pt-BR')}
                      </td>
                      <td style={{ padding: '1.25rem 1.75rem', fontSize: '0.875rem', textAlign: 'right' }}>
                        <Link
                          href={`/queue/${item.request_id}?cpf=${encodeURIComponent(item.cpf_masked)}&amount=${item.amount}&reason=${encodeURIComponent(item.reason)}`}
                          style={{
                            display: 'inline-flex',
                            padding: '0.55rem 1.25rem',
                            backgroundColor: 'var(--color-primary)',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            fontFamily: "var(--font-heading)",
                            transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 10px -3px var(--color-primary-glow)',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'hsl(262, 80%, 52%)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 15px -3px var(--color-primary-glow)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 10px -3px var(--color-primary-glow)';
                          }}
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
