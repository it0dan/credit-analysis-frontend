'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';
import { CockpitLayout } from '@repo/ui/cockpit-layout';

export default function OperatorHome() {
  const auth = useAuth();

  const stats = [
    { label: 'Em Fila de Revisão', value: '4', color: 'var(--color-secondary)', bg: 'hsla(24, 100%, 50%, 0.08)', border: 'hsla(24, 100%, 50%, 0.25)' },
    { label: 'Aprovados Hoje', value: '18', color: 'var(--color-emerald)', bg: 'hsla(142, 76%, 45%, 0.08)', border: 'hsla(142, 76%, 45%, 0.25)' },
    { label: 'Rejeitados Hoje', value: '7', color: 'var(--color-rose)', bg: 'hsla(346, 84%, 61%, 0.08)', border: 'hsla(346, 84%, 61%, 0.25)' },
    { label: 'Tempo Médio Decisão', value: '4.2m', color: 'var(--color-primary)', bg: 'hsla(262, 80%, 60%, 0.08)', border: 'hsla(262, 80%, 60%, 0.25)' },
  ];

  return (
    <CockpitLayout activeLink="home" portalType="operator">
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Top Welcome Panel */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '2rem 2.5rem',
            borderRadius: '16px',
            border: 'var(--border-glass)',
            boxShadow: 'var(--shadow-main), inset 0 1px 1px hsla(0, 0%, 100%, 0.05)',
            marginBottom: '2.5rem',
            transition: 'background 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div>
            <h1 
              style={{ 
                margin: 0, 
                fontSize: '1.75rem', 
                fontWeight: 800, 
                color: 'var(--text-primary)',
                fontFamily: "var(--font-heading)",
                letterSpacing: '-0.02em',
              }}
            >
              Mesa de Análise de Crédito
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Central de Intervenção Humana (HITL) para propostas de crédito especiais
            </p>
          </div>
          {auth && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                👤 Operador: {auth.user_id}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 600 }}>
                Perfil: {auth.role}
              </div>
            </div>
          )}
        </div>

        {/* Metric Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                backgroundColor: stat.bg,
                border: `1px solid ${stat.border}`,
                boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-heading)" }}>
                {stat.label}
              </span>
              <span style={{ display: 'block', fontSize: '2.25rem', fontWeight: 900, color: stat.color, marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Main Hub Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Card 1: Review Queue */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: 'var(--border-glass)',
              boxShadow: 'var(--shadow-main)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'hsla(38, 92%, 50%, 0.12)',
                  color: 'hsl(38, 92%, 60%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1.25rem',
                  border: '1px solid hsla(38, 92%, 50%, 0.25)',
                }}
              >
                📋
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "var(--font-heading)", letterSpacing: '-0.02em' }}>
                Fila de Análises Pendentes
              </h3>
              <p style={{ margin: '0.6rem 0 1.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.875rem',
                fontFamily: "var(--font-heading)",
                boxShadow: '0 4px 10px -3px var(--color-primary-glow)',
                transition: 'background-color 0.2s, transform 0.2s',
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(262, 80%, 52%)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Visualizar Fila (Revisão HITL)
            </Link>
          </div>

          {/* Card 2: Performance Dashboard */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: 'var(--border-glass)',
              boxShadow: 'var(--shadow-main)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'hsla(142, 76%, 45%, 0.12)',
                  color: 'hsl(142, 76%, 50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1.25rem',
                  border: '1px solid hsla(142, 76%, 45%, 0.25)',
                }}
              >
                📊
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "var(--font-heading)", letterSpacing: '-0.02em' }}>
                Dashboard de Métricas
              </h3>
              <p style={{ margin: '0.6rem 0 1.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
                backgroundColor: 'hsla(0, 0%, 100%, 0.05)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.875rem',
                fontFamily: "var(--font-heading)",
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'hsla(0, 0%, 100%, 0.1)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'hsla(0, 0%, 100%, 0.05)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Acessar Métricas & FinOps
            </Link>
          </div>
        </div>
      </div>
    </CockpitLayout>
  );
}
