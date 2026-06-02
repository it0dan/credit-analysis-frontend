'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@repo/auth';

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

  const pendingRequests: QueueItem[] = [
    {
      request_id: 'be70725f',
      cpf_masked: '***.723.109-**',
      reason: 'Valor Solicitado Excede Limite Automático',
      amount: 80000,
      date: '2026-06-01T20:15:00Z',
      status: 'pending_human_review',
    },
    {
      request_id: '3e49e394',
      cpf_masked: '***.990.221-**',
      reason: 'Indisponibilidade Técnica do Bureau',
      amount: 10000,
      date: '2026-06-01T20:30:00Z',
      status: 'pending_human_review',
    },
    {
      request_id: '7acf5b19',
      cpf_masked: '***.103.882-**',
      reason: 'Valor Solicitado Excede Limite Automático',
      amount: 120000,
      date: '2026-06-01T21:05:00Z',
      status: 'pending_human_review',
    },
    {
      request_id: '8f19560c',
      cpf_masked: '***.412.333-**',
      reason: 'Indisponibilidade de Bureau + Inconsistência de Renda',
      amount: 15000,
      date: '2026-06-01T21:40:00Z',
      status: 'pending_human_review',
    },
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
      {/* Header and navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
            <Link href="/" style={{ color: '#4F46E5', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span>Fila de Revisão</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
            Fila de Solicitações Pendentes
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            Selecione uma proposta abaixo para analisar spans de turnos e processar a decisão de retomada (resume).
          </p>
        </div>
        {auth && (
          <span style={{ fontSize: '0.875rem', color: '#4B5563', backgroundColor: '#FFFFFF', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E5E7EB', fontWeight: 500 }}>
            👤 Operador: {auth.user_id}
          </span>
        )}
      </div>

      {/* Main Table Content */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>ID Proposta</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>CPF Mascarado</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Gatilho / Razão</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Valor Solicitado</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Data Criação</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((item) => (
              <tr
                key={item.request_id}
                style={{
                  borderBottom: '1px solid #E5E7EB',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace' }}>
                  {item.request_id}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#374151', fontFamily: 'monospace' }}>
                  {item.cpf_masked}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#D97706', fontWeight: 600 }}>
                  {item.reason}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                  R$ {item.amount.toLocaleString('pt-BR')}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
                  {new Date(item.date).toLocaleString('pt-BR')}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>
                  <Link
                    href={`/queue/${item.request_id}?cpf=${encodeURIComponent(item.cpf_masked)}&amount=${item.amount}&reason=${encodeURIComponent(item.reason)}`}
                    style={{
                      display: 'inline-flex',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4F46E5',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338CA')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
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
  );
}
