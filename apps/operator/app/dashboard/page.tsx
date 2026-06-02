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
    { item: 'bureau-agent calls', count: 320, costBrl: 0.128 },
    { item: 'risk-agent calls', count: 320, costBrl: 0.096 },
    { item: 'compliance-agent calls', count: 280, costBrl: 0.140 },
    { item: 'decision-agent calls', count: 220, costBrl: 0.088 },
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.costBrl, 0);

  return (
    <CockpitLayout activeLink="analytics" portalType="operator">
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
          animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span>Dashboard de Métricas</span>
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
            Relatórios & FinOps do AI Gateway
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Estatísticas de caching de tokens por audiência e custo de processamento cognitivo.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: 'var(--border-glass)', boxShadow: 'var(--shadow-main)', transition: 'background 0.3s ease' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-heading)" }}>Total de Requisições A2A</span>
            <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>{gatewayStats.totalRequests}</span>
          </div>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: 'var(--border-glass)', boxShadow: 'var(--shadow-main)', transition: 'background 0.3s ease' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-emerald)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-heading)" }}>Cache Hits (Tokens)</span>
            <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-emerald)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)', textShadow: '0 0 10px hsla(142, 76%, 45%, 0.15)' }}>{gatewayStats.tokenHits}</span>
          </div>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: 'var(--border-glass)', boxShadow: 'var(--shadow-main)', transition: 'background 0.3s ease' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-heading)" }}>Cache Misses (Renovações)</span>
            <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-secondary)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)', textShadow: '0 0 10px hsla(24, 100%, 50%, 0.15)' }}>{gatewayStats.tokenMisses}</span>
          </div>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: 'var(--border-glass)', boxShadow: 'var(--shadow-main)', transition: 'background 0.3s ease' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-heading)" }}>Cache Ratio (Eficiência)</span>
            <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)', textShadow: '0 0 10px hsla(262, 80%, 60%, 0.15)' }}>{gatewayStats.cacheRatio}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {/* Cost Analysis Breakdown */}
          <div 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '2.5rem', 
              borderRadius: '16px', 
              border: 'var(--border-glass)', 
              boxShadow: 'var(--shadow-main)',
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}
          >
            <h3 style={{ margin: '0 0 1.75rem 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "var(--font-heading)", letterSpacing: '-0.02em' }}>Detalhamento FinOps</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {costBreakdown.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsla(0, 0%, 100%, 0.04)', paddingBottom: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{item.item}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.count} execuções</span>
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    R$ {item.costBrl.toFixed(3)}
                  </span>
                </div>
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "var(--font-heading)" }}>Custo Total Acumulado</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-emerald)', fontFamily: 'monospace', textShadow: '0 0 10px hsla(142, 76%, 45%, 0.2)' }}>
                  R$ {totalCost.toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          {/* Cache Graphic Mock */}
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
              minHeight: '360px',
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "var(--font-heading)", letterSpacing: '-0.02em' }}>Desempenho de Caching de Tokens</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                A injeção dinâmica de `audience` JWT com margem de segurança de expiração (30s) evitou renovações desnecessárias no Sensedia AI Gateway.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Bar Chart Hit */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: "var(--font-heading)", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span>Cache Hits (Reutilizados)</span>
                    <span style={{ color: 'var(--color-emerald)' }}>97.9%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: 'hsla(0, 0%, 100%, 0.05)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                    <div style={{ width: '97.9%', height: '100%', backgroundColor: 'var(--color-emerald)', borderRadius: '6px', boxShadow: '0 0 10px var(--color-emerald)' }} />
                  </div>
                </div>

                {/* Bar Chart Miss */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: "var(--font-heading)", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span>Cache Misses (Renovados)</span>
                    <span style={{ color: 'var(--color-secondary)' }}>2.1%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: 'hsla(0, 0%, 100%, 0.05)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                    <div style={{ width: '2.1%', height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: '6px', boxShadow: '0 0 10px var(--color-secondary)' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid hsla(0, 0%, 100%, 0.04)', paddingTop: '1.25rem', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ℹ️ Proporção de acertos de cache otimizada por algoritmos de renovação proativa.
            </div>
          </div>
        </div>
      </div>
    </CockpitLayout>
  );
}
