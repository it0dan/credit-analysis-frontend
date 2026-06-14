'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Stat } from '@repo/ui/stat';
import { Card } from '@repo/ui/card';
import { Tag } from '@repo/ui/tag';

export default function OperatorHome() {
  const auth = useAuth();

  const stats: Array<{ label: string; value: string; sub: string }> = [
    { label: 'casos na fila', value: '12', sub: 'queue depth' },
    { label: 'custo médio por análise', value: 'R$ 0.04', sub: 'finops' },
    { label: 'latência mediana', value: '63s', sub: 'p50 runtime' },
    { label: 'análises concluídas hoje', value: '+2.847', sub: 'throughput' },
  ];

  return (
    <CockpitLayout activeLink="home" portalType="operator">
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
                Operador: <span style={{ color: 'var(--acc)' }}>{auth.user_id}</span>
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                Perfil: {auth.role}
              </div>
            </div>
          )}
        </Card>

        {/* Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {stats.map((stat, idx) => (
            <Card key={idx} style={{ padding: '1.25rem', borderLeft: '1px solid var(--acc)' }}>
              <Stat label={stat.label} value={stat.value} sub={stat.sub} />
            </Card>
          ))}
        </div>

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
