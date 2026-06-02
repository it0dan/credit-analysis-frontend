'use client';

import React from 'react';
import Link from 'next/link';

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
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#FAFAFA',
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      {/* Navigation */}
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
          <Link href="/" style={{ color: '#4F46E5', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span>Dashboard de Métricas</span>
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
          Relatórios & FinOps do AI Gateway
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
          Estatísticas de caching de tokens por audiência e custo de processamento cognitivo.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Total de Requisições A2A</span>
          <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '0.5rem' }}>{gatewayStats.totalRequests}</span>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, textTransform: 'uppercase' }}>Cache Hits (Tokens)</span>
          <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.5rem' }}>{gatewayStats.tokenHits}</span>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600, textTransform: 'uppercase' }}>Cache Misses (Renovações)</span>
          <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, color: '#D97706', marginTop: '0.5rem' }}>{gatewayStats.tokenMisses}</span>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600, textTransform: 'uppercase' }}>Cache Ratio (Eficiência)</span>
          <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, color: '#4F46E5', marginTop: '0.5rem' }}>{gatewayStats.cacheRatio}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Cost Analysis Breakdown */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Detalhamento FinOps</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {costBreakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>{item.item}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{item.count} execuções</span>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>
                  R$ {item.costBrl.toFixed(3)}
                </span>
              </div>
            ))}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Custo Total Acumulado</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                R$ {totalCost.toFixed(3)}
              </span>
            </div>
          </div>
        </div>

        {/* Cache Graphic Mock */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Desempenho de Caching de Tokens</h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#6B7280', marginBottom: '1.5rem' }}>
              A injeção dinâmica de `audience` JWT com margem de segurança de expiração (30s) evitou renovações desnecessárias no Sensedia AI Gateway.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Bar Chart Hit */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>
                  <span>Cache Hits (Reutilizados)</span>
                  <span>97.9%</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '97.9%', height: '100%', backgroundColor: '#10B981', borderRadius: '6px' }} />
                </div>
              </div>

              {/* Bar Chart Miss */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>
                  <span>Cache Misses (Renovados)</span>
                  <span>2.1%</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '2.1%', height: '100%', backgroundColor: '#D97706', borderRadius: '6px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem', marginTop: '1.5rem', fontSize: '0.825rem', color: '#6B7280', fontStyle: 'italic' }}>
            ℹ️ Proporção de acertos de cache otimizada por algoritmos de renovação proativa.
          </div>
        </div>
      </div>
    </div>
  );
}
