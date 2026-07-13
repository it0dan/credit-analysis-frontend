'use client';

import React from 'react';
import Link from 'next/link';
import { CockpitLayout } from '@repo/ui/cockpit-layout';

export default function OperatorDashboard() {
  const gatewayStats = {
    totalRequests: 1420,
    tokenHits: 1391,
    tokenMisses: 29,
    cacheRatio: '97.9%',
    avgLatency: '184ms',
  };

  const costBreakdown = [
    { item: 'bureau-agent calls',     count: 320, costBrl: 0.128 },
    { item: 'risk-agent calls',       count: 320, costBrl: 0.096 },
    { item: 'compliance-agent calls', count: 280, costBrl: 0.140 },
    { item: 'decision-agent calls',   count: 220, costBrl: 0.088 },
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.costBrl, 0);

  return (
    <CockpitLayout activeLink="analytics" portalType="operator" liveState="idle" onSignOut={() => { window.location.href = 'http://localhost:3000/logout'; }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
            <Link href="/" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span>Dashboard de Métricas</span>
          </div>
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
            Relatórios & FinOps do AI Gateway
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--muted)' }}>
            Estatísticas de caching de tokens por audiência e custo de processamento cognitivo.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Requisições A2A', value: String(gatewayStats.totalRequests), color: 'var(--text)' },
            { label: 'Cache Hits',             value: String(gatewayStats.tokenHits),    color: 'var(--acc)'  },
            { label: 'Cache Misses',            value: String(gatewayStats.tokenMisses),  color: 'var(--warn)' },
            { label: 'Cache Ratio',             value: gatewayStats.cacheRatio,           color: 'var(--blue)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                backgroundColor: 'var(--surf)',
                padding: '1.25rem',
                border: '1px solid var(--line)',
              }}
            >
              <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
                {label}
              </span>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 200, color, marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Cost Analysis */}
          <div
            style={{
              backgroundColor: 'var(--surf)',
              padding: '2rem',
              border: '1px solid var(--line)',
            }}
          >
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', fontWeight: 300, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.01em' }}>
              Detalhamento FinOps
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {costBreakdown.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '0.85rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{item.item}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{item.count} execuções</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                    R$ {item.costBrl.toFixed(3)}
                  </span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Custo Total</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 300, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>
                  R$ {totalCost.toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          {/* Cache Chart */}
          <div
            style={{
              backgroundColor: 'var(--surf)',
              padding: '2rem',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '320px',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 300, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.01em' }}>
                Desempenho de Caching de Tokens
              </h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.825rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                Injeção dinâmica de audience JWT com margem de 30s evitou renovações desnecessárias.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Cache Hits', pct: '97.9%', width: '97.9%', color: 'var(--acc)' },
                  { label: 'Cache Misses', pct: '2.1%', width: '2.1%', color: 'var(--warn)' },
                ].map(({ label, pct, width, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)' }}>
                      <span>{label}</span>
                      <span style={{ color }}>{pct}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--line)', overflow: 'hidden' }}>
                      <div style={{ width, height: '100%', backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1rem', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              ~ Proporção de acertos otimizada por renovação proativa.
            </div>
          </div>
        </div>
      </div>
    </CockpitLayout>
  );
}
