'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Stat } from '@repo/ui/stat';
import { Card } from '@repo/ui/card';

export default function OperatorHome() {
  const auth = useAuth();

  const stats: Array<{ label: string; value: string; color: 'warn' | 'ok' | 'alert' | 'acc' }> = [
    { label: 'Em Fila de Revisão',     value: '4',    color: 'warn' },
    { label: 'Aprovados Hoje',          value: '18',   color: 'ok'   },
    { label: 'Rejeitados Hoje',         value: '7',    color: 'alert'},
    { label: 'Tempo Médio Decisão',     value: '4.2m', color: 'acc'  },
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
          glass
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2rem 2.5rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.02em',
              }}
            >
              Mesa de Análise de Crédito
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--muted)' }}>
              Central de Intervenção Humana (HITL) para propostas de crédito especiais
            </p>
          </div>
          {auth && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                Operador: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--acc)' }}>{auth.user_id}</span>
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem', fontWeight: 600 }}>
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
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {stats.map((stat, idx) => (
            <Card key={idx} glass style={{ padding: '1.5rem' }}>
              <Stat label={stat.label} value={stat.value} color={stat.color} />
            </Card>
          ))}
        </div>

        {/* Main Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Fila de Análise */}
          <Card
            glass
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--warn-glow)',
                  color: 'var(--warn)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--warn)',
                }}
              >
                📋
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.02em',
                }}
              >
                Fila de Análises Pendentes
              </h3>
              <p
                style={{
                  margin: '0.6rem 0 1.5rem 0',
                  fontSize: '0.875rem',
                  color: 'var(--muted)',
                  lineHeight: 1.6,
                }}
              >
                Acesse a fila de solicitações que exigem intervenção manual por limite excedido ou indisponibilidade de bureau.
              </p>
            </div>
            <Link
              href="/queue"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--acc)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)',
                boxShadow: 'var(--shadow-acc)',
                transition: 'filter 0.2s, transform 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.filter = 'brightness(1.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.filter = '';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Visualizar Fila (Revisão HITL)
            </Link>
          </Card>

          {/* Dashboard de Métricas */}
          <Card
            glass
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--ok-glow)',
                  color: 'var(--ok)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--ok)',
                }}
              >
                📊
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.02em',
                }}
              >
                Dashboard de Métricas
              </h3>
              <p
                style={{
                  margin: '0.6rem 0 1.5rem 0',
                  fontSize: '0.875rem',
                  color: 'var(--muted)',
                  lineHeight: 1.6,
                }}
              >
                Visualize relatórios de performance, contabilidade de tokens de FinOps do Gateway e estatísticas de rejeições regulatórias.
              </p>
            </div>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--surf2)',
                color: 'var(--text)',
                border: '1px solid var(--line2)',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--acc-glow)';
                e.currentTarget.style.borderColor = 'var(--acc)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surf2)';
                e.currentTarget.style.borderColor = 'var(--line2)';
                e.currentTarget.style.transform = 'translateY(0)';
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
