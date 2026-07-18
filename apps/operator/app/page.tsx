'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Stat } from '@repo/ui/stat';
import { Card } from '@repo/ui/card';
import { Tag } from '@repo/ui/tag';

const systemStats = [
  { value: '12', label: 'casos aguardando HITL', sub: 'intervenção humana necessária', color: 'var(--warn)' },
  { value: '97.3%', label: 'taxa de automação', sub: 'decisões sem HITL hoje', color: 'var(--acc)' },
  { value: '8.4s', label: 'tempo médio de decisão', sub: 'p50 · análise completa', color: 'var(--blue)' },
  { value: 'R$ 0.04', label: 'custo por análise', sub: 'tokens + gateway · FinOps', color: 'var(--muted)' },
];

const portfolioStats = [
  { value: '2.847', label: 'análises hoje', sub: 'volume processado', color: 'var(--acc)' },
  { value: '68.2%', label: 'taxa de pré-aprovação', sub: 'pré-aprovados automáticos', color: 'var(--blue)' },
  { value: 'R$ 4.2M', label: 'volume pré-aprovado hoje', sub: 'soma dos créditos pré-aprovados', color: 'var(--text)' },
  { value: '3.1%', label: 'rejeições por compliance', sub: 'KYC / PLD / LGPD', color: 'var(--alert)' },
];

const recentDecisions = [
  { id: 'req-9f3a', cpf: '***.234.567-**', amount: 'R$ 45.000', status: 'pre_approved', agents: 5, latency: '7.2s', turn: 'T3' },
  { id: 'req-8b2c', cpf: '***.891.234-**', amount: 'R$ 120.000', status: 'hitl_required', agents: 4, latency: '6.8s', turn: 'T2' },
  { id: 'req-7e1d', cpf: '***.567.890-**', amount: 'R$ 28.000', status: 'rejected', agents: 3, latency: '4.1s', turn: 'T2' },
  { id: 'req-6d4e', cpf: '***.123.456-**', amount: 'R$ 15.000', status: 'pre_approved', agents: 5, latency: '8.9s', turn: 'T3' },
  { id: 'req-5c3f', cpf: '***.789.012-**', amount: 'R$ 75.000', status: 'hitl_required', agents: 4, latency: '5.3s', turn: 'T2' },
] as const;

const statusColor = {
  pre_approved: 'var(--blue)',
  approved: 'var(--acc)',
  hitl_required: 'var(--warn)',
  rejected: 'var(--alert)',
} as const;

export default function OperatorHome() {
  const auth = useAuth();

  return (
    <CockpitLayout activeLink="home" portalType="operator" liveState="idle" onSignOut={() => { window.location.href = 'http://localhost:3000/logout'; }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Welcome Panel */}
        <Card
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            borderLeft: '2px solid var(--acc)',
          }}
        >
          <div>
            <Tag dim="overview">cockpit</Tag>
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
              Cockpit de <span style={{ color: 'var(--acc)' }}>operações</span>
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--text)' }}>
              Central de Intervenção Humana (HITL) para propostas de crédito especiais
            </p>
          </div>
          {auth && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                Operador: <span style={{ color: 'var(--acc)' }}>{auth.id}</span>
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                Perfil: {auth.role.toUpperCase()}
              </div>
            </div>
          )}
        </Card>

        <section aria-labelledby="system-stats-title" style={{ marginBottom: '2rem' }}>
          <div id="system-stats-title">
            <Tag dim="sistema agêntico">eficiência operacional</Tag>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {systemStats.map((stat) => (
              <Card key={stat.label} style={{ padding: '1.25rem' }}>
                <Stat {...stat} />
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="portfolio-stats-title" style={{ marginBottom: '2rem' }}>
          <div id="portfolio-stats-title">
            <Tag dim="posição diária">portfólio de crédito</Tag>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {portfolioStats.map((stat) => (
              <Card key={stat.label} style={{ padding: '1.25rem' }}>
                <Stat {...stat} />
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="recent-decisions-title" style={{ marginBottom: '2.5rem' }}>
          <div id="recent-decisions-title">
            <Tag dim="amostra representativa">últimas decisões do sistema agêntico</Tag>
          </div>
          <Card style={{ overflowX: 'auto', borderLeft: '2px solid var(--acc)' }}>
            <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr>
                  {['ID', 'CPF', 'VALOR', 'STATUS', 'AGENTES', 'LATÊNCIA', 'TURNO'].map((heading) => (
                    <th key={heading} scope="col" style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--line2)', color: 'var(--text)', fontSize: '0.65rem', fontWeight: 400, letterSpacing: 'var(--ls-label)', textAlign: heading === 'AGENTES' ? 'center' : 'left' }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentDecisions.map((decision) => (
                  <tr key={decision.id}>
                    <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)', color: 'var(--acc)', fontSize: '0.75rem' }}>{decision.id}</td>
                    <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)', color: 'var(--text)', fontSize: '0.75rem' }}>{decision.cpf}</td>
                    <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)', color: 'var(--text)', fontSize: '0.75rem' }}>{decision.amount}</td>
                    <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.45rem', border: `1px solid ${statusColor[decision.status]}`, color: statusColor[decision.status], fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {decision.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)', color: 'var(--text)', fontSize: '0.75rem', textAlign: 'center' }}>{decision.agents}</td>
                    <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)', color: 'var(--blue)', fontSize: '0.75rem' }}>{decision.latency}</td>
                    <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)', color: 'var(--text)', fontSize: '0.75rem' }}>{decision.turn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        {/* Main Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Fila de Análise */}
          <Card
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '240px',
              borderLeft: '1px solid var(--acc)',
            }}
          >
            <div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  color: 'var(--warn)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--warn)',
                }}
              >
                ≡
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '-0.01em',
                }}
              >
                Fila de Análises Pendentes
              </h2>
              <p style={{ margin: '0.6rem 0 1.5rem 0', fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>
                Solicitações que exigem intervenção manual por limite excedido ou indisponibilidade de bureau.
              </p>
            </div>
            <Link
              href="/queue"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                color: 'var(--acc)',
                border: '1px solid var(--acc)',
                textDecoration: 'none',
                fontWeight: 400,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(127,255,212,0.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Visualizar Fila (Revisão HITL)
            </Link>
          </Card>

          {/* Dashboard de Métricas */}
          <Card
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '240px',
              borderLeft: '1px solid var(--line2)',
            }}
          >
            <div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  color: 'var(--blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--blue)',
                }}
              >
                ◈
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '-0.01em',
                }}
              >
                Dashboard de Métricas
              </h2>
              <p style={{ margin: '0.6rem 0 1.5rem 0', fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>
                Relatórios de performance, FinOps do Gateway e estatísticas de rejeições regulatórias.
              </p>
            </div>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                color: 'var(--muted)',
                border: '1px solid var(--line2)',
                textDecoration: 'none',
                fontWeight: 400,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--acc)';
                e.currentTarget.style.color = 'var(--acc)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--line2)';
                e.currentTarget.style.color = 'var(--muted)';
              }}
            >
              Acessar Métricas & FinOps
            </Link>
          </Card>
        </div>
      </div>
    </CockpitLayout>
  );
}
