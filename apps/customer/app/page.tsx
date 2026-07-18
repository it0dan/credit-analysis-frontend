'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Pulse } from '@repo/ui/pulse';
import { Tag } from '@repo/ui/tag';
import { addAnalysis, listAnalyses, maskCpf, type StoredAnalysis } from '@repo/ui/analysis-history';
import { signOut } from '@repo/auth';

export default function CustomerHome() {
  const [cpf, setCpf] = useState('');
  const [amountCents, setAmountCents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const router = useRouter();

  useEffect(() => {
    setAnalyses(listAnalyses());
  }, []);

  const activeAnalyses = useMemo(() => analyses.filter((item) => !item.final_verdict), [analyses]);
  const latestActive = activeAnalyses[0];

  const formatCurrency = (cents: number) =>
    (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    const cents = Number.parseInt(digits || '0', 10);
    setAmountCents(Math.min(cents, 999_999_999));
    setError(null);
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      setAmountCents((current) => Math.min(current * 10 + Number(e.key), 999_999_999));
      setError(null);
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      setAmountCents((current) => Math.floor(current / 10));
      setError(null);
    }
  };

  const handleAmountPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '');
    setAmountCents(Math.min(Number.parseInt(digits || '0', 10), 999_999_999));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setError('Por favor, insira um CPF válido com 11 dígitos.');
      return;
    }
    if (amountCents < 100) {
      setError('O valor mínimo para análise é R$ 1,00.');
      return;
    }
    const requestedAmount = amountCents / 100;
    setLoading(true);
    setError(null);

    fetch('http://localhost:8086/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cleanCpf, amount: requestedAmount }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível iniciar a análise. Tente novamente.');
        return res.json();
      })
      .then((data) => {
        addAnalysis({
          request_id: data.request_id,
          cpf_masked: maskCpf(cpf),
          amount_brl: requestedAmount,
          final_verdict: null,
          last_status: data.status === 'hitl_required' ? 'hitl_required' : data.status === 'rejected' ? 'rejected' : data.status === 'pre_approved' ? 'pre_approved' : 'analyzing',
        });
        router.push(`/status/${data.request_id}?cpf=${encodeURIComponent(maskCpf(cpf))}&amount=${requestedAmount}`);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Não foi possível iniciar a análise. Tente novamente.');
        setLoading(false);
      });
  };

  return (
    <CockpitLayout activeLink="proposal" portalType="customer" liveState="idle" onSignOut={() => signOut({ redirectTo: 'http://localhost:3000/login' })}>
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
          {latestActive && (
            <Link
              href={`/status/${latestActive.request_id}?cpf=${encodeURIComponent(latestActive.cpf_masked)}&amount=${latestActive.amount_brl}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                border: '1px solid var(--acc)',
                color: 'var(--acc)',
                textDecoration: 'none',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                <Pulse color="acc" size={7} />
                {activeAnalyses.length} análise{activeAnalyses.length > 1 ? 's' : ''} em andamento
              </span>
              <span>continuar acompanhamento</span>
            </Link>
          )}

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'block', marginBottom: '1rem' }}>
              <Tag dim="step 01">solicitação</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  border: '1px solid var(--acc)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Pulse color="acc" size={12} />
              </div>
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
              Análise de crédito rápida e segura
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="amount" style={{ display: 'inline-block' }}>
                <Tag dim="R$">valor solicitado</Tag>
              </label>
              <input
                id="amount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                aria-describedby="amount-hint"
                placeholder="0,00"
                value={formatCurrency(amountCents)}
                onChange={handleAmountChange}
                onKeyDown={handleAmountKeyDown}
                onPaste={handleAmountPaste}
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
              <span id="amount-hint" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                Digite os centavos da direita para a esquerda · máximo R$ 9.999.999,99
              </span>
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
              {loading ? 'Preparando sua análise...' : 'Iniciar Análise de Crédito'}
            </button>
          </form>
        </div>
      </div>
    </CockpitLayout>
  );
}
