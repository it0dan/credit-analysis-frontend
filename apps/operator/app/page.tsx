'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';

export default function OperatorHome() {
  const auth = useAuth();

  const stats = [
    { label: 'Em Fila de Revisão', value: '4', color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
    { label: 'Aprovados Hoje', value: '18', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    { label: 'Rejeitados Hoje', value: '7', color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5' },
    { label: 'Tempo Médio Decisão', value: '4.2m', color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE' },
  ];

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#FAFAFA',
        minHeight: '95vh',
      }}
    >
      {/* Top Welcome Panel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>
            Painel de Decisão da Mesa de Crédito
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            Central de Intervenção Humana (HITL) para propostas de crédito especiais
          </p>
        </div>
        {auth && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.875rem', color: '#4B5563', fontWeight: 600 }}>
              Operador: {auth.user_id}
            </span>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>
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
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <span style={{ display: 'block', fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>
              {stat.label}
            </span>
            <span style={{ display: 'block', fontSize: '2.25rem', fontWeight: 800, color: stat.color, marginTop: '0.5rem' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Main Hub Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Card 1: Review Queue */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#FFFBEB',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              📋
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
              Fila de Análises Pendentes
            </h3>
            <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.5 }}>
              Acesse a fila de solicitações que exigem intervenção manual por limite excedido ou indisponibilidade de bureau.
            </p>
          </div>
          <Link
            href="/queue"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              transition: 'background-color 0.2s',
              textAlign: 'center',
            }}
          >
            Visualizar Fila (4 pendentes)
          </Link>
        </div>

        {/* Card 2: Performance Dashboard */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              📊
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
              Dashboard de Métricas
            </h3>
            <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.5 }}>
              Visualize relatórios de performance, contabilidade de tokens de FinOps do Gateway e estatísticas de rejeições regulatórias.
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: '#E5E7EB',
              color: '#374151',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              transition: 'background-color 0.2s',
              textAlign: 'center',
            }}
          >
            Acessar Métricas & FinOps
          </Link>
        </div>
      </div>
    </div>
  );
}
