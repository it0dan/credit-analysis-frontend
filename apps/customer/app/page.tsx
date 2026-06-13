'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Pulse } from '@repo/ui/pulse';

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
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '3rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--acc-glow)',
                marginBottom: '1.25rem',
                border: '1px solid var(--line)',
              }}
            >
              <Pulse color="acc" size={14} />
            </div>
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
              Crédito A2A Inteligente
            </h1>
            <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.875rem', color: 'var(--muted)' }}>
              Aprovação multiagente em segundos via Sensedia AI Gateway
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* CPF */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label
                htmlFor="cpf"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                CPF do Titular
              </label>
              <input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                disabled={loading}
                style={{
                  padding: '0.9rem 1.1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--acc)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--acc-glow)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Valor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label
                htmlFor="amount"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Valor Solicitado (R$)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Ex: 25000"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(null); }}
                disabled={loading}
                style={{
                  padding: '0.9rem 1.1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--acc)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--acc-glow)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {error && (
              <div style={{ fontSize: '0.825rem', color: 'var(--alert)', fontWeight: 600, display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <Pulse color="alert" size={7} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '1rem',
                backgroundColor: loading ? 'var(--surf2)' : 'var(--acc)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.95rem',
                fontFamily: 'var(--font-sans)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                boxShadow: loading ? 'none' : 'var(--shadow-acc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.filter = '';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading && (
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTop: '2px solid #FFFFFF',
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
        </div>
      </div>
    </CockpitLayout>
  );
}
