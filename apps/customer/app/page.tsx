'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerHome() {
  const [cpf, setCpf] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Mask as XXX.XXX.XXX-XX
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

    // Simulate analysis initiation and redirect to tracking status page
    setTimeout(() => {
      const mockRequestId = Math.random().toString(36).substring(2, 10);
      router.push(`/status/${mockRequestId}?cpf=${encodeURIComponent(cpf)}&amount=${amount}`);
    }, 1200);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '2rem',
        backgroundColor: '#FAFAFA',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          padding: '2.5rem',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '1rem',
            }}
          >
            $
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
            Análise de Crédito Inteligente
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            Consulte sua proposta de crédito com aprovação multiagente em segundos
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label htmlFor="cpf" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
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
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4F46E5')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#D1D5DB')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label htmlFor="amount" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
              Valor Solicitado (R$)
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Ex: 25000"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
              }}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4F46E5')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#D1D5DB')}
            />
          </div>

          {error && (
            <div style={{ fontSize: '0.875rem', color: '#EF4444', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.875rem',
              backgroundColor: loading ? '#9CA3AF' : '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
              marginTop: '0.5rem',
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4338CA';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4F46E5';
            }}
          >
            {loading ? 'Inicializando Agentes...' : 'Iniciar Análise de Crédito'}
          </button>
        </form>
      </div>
    </div>
  );
}
