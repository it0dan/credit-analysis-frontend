'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Pulse } from '@repo/ui/pulse';
import { Tag } from '@repo/ui/tag';
import { Stat } from '@repo/ui/stat';

export default function CustomerHome() {
  const [cpf, setCpf] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    setCpf(value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setError('Por favor, insira um CPF válido com 11 dígitos.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, insira um valor solicitado válido maior que zero.');
      return;
    }
    setLoading(true);
    setError(null);

    fetch('http://localhost:8086/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cleanCpf, amount: parseFloat(amount) }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível inicializar a análise no orquestrador de crédito.');
        return res.json();
      })
      .then((data) => {
        router.push(`/status/${data.request_id}?cpf=${encodeURIComponent(cpf)}&amount=${amount}`);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Falha na conexão com o orquestrador multiagente.');
        setLoading(false);
      });
  };

  return (
    <CockpitLayout activeLink="proposal" portalType="customer">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: 'var(--surf)',
            padding: '2.5rem',
            border: '1px solid var(--line)',
            borderLeft: '2px solid var(--acc)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Tag dim="step 01">solicitação</Tag>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                backgroundColor: 'transparent',
                marginBottom: '1rem',
                border: '1px solid var(--acc)',
              }}
            >
              <Pulse color="acc" size={14} />
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 200,
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-0.02em',
              }}
            >
              Solicite seu <span style={{ color: 'var(--acc)' }}>crédito</span>
            </h1>
            <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.875rem', color: 'var(--text)' }}>
              Aprovação multiagente em segundos via Sensedia AI Gateway
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* CPF */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="cpf" style={{ display: 'inline-block' }}>
                <Tag dim="cpf">titular</Tag>
              </label>
              <input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                disabled={loading}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--line2)',
                  color: 'var(--text)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  caretColor: 'var(--acc)',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--acc)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line2)'; }}
              />
            </div>

            {/* Valor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="amount" style={{ display: 'inline-block' }}>
                <Tag dim="R$">valor solicitado</Tag>
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Ex: 25000"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(null); }}
                disabled={loading}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--line2)',
                  color: 'var(--text)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  caretColor: 'var(--acc)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--acc)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line2)'; }}
              />
            </div>

            {error && (
              <div style={{ fontSize: '0.825rem', color: 'var(--alert)', display: 'flex', gap: '0.4rem', alignItems: 'center', fontFamily: 'var(--font-mono)' }}>
                <Pulse color="alert" size={6} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.9rem',
                backgroundColor: 'transparent',
                color: loading ? 'var(--muted)' : 'var(--acc)',
                border: `1px solid ${loading ? 'var(--line2)' : 'var(--acc)'}`,
                fontWeight: 400,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'rgba(127,255,212,0.05)';
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {loading && (
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '1px solid var(--line2)',
                    borderTop: '1px solid var(--acc)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
              )}
              {loading ? 'Inicializando Agentes...' : 'Iniciar Análise de Crédito'}
            </button>
          </form>
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
            <Stat value="+2.847" label="análises concluídas hoje" sub="gateway telemetry" />
          </div>
        </div>
      </div>
    </CockpitLayout>
  );
}
