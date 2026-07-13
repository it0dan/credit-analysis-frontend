'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { StatusBadge } from '@repo/ui/status-badge';
import { Tag } from '@repo/ui/tag';
import { listAnalyses, type StoredAnalysis } from '@repo/ui/analysis-history';
import { signOut } from '@repo/auth';

function relativeTime(iso: string) {
  const diffMs = Date.now() - Date.parse(iso);
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  return `há ${Math.floor(hours / 24)} d`;
}

export default function CustomerHistoryPage() {
  const [items, setItems] = useState<StoredAnalysis[]>([]);
  const router = useRouter();

  useEffect(() => {
    setItems(listAnalyses());
  }, []);

  return (
    <CockpitLayout activeLink="history" portalType="customer" liveState="idle" onSignOut={() => signOut({ redirectTo: 'http://localhost:3000/login' })}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 0', animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <Tag dim={`${items.length} registros`}>extrato</Tag>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 200, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              Suas <span style={{ color: 'var(--acc)' }}>propostas</span>
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text)', fontSize: '0.875rem' }}>
              Registros salvos neste navegador. O CPF permanece mascarado localmente.
            </p>
          </div>
          <Link href="/" style={{ color: 'var(--acc)', border: '1px solid var(--acc)', padding: '0.65rem 1rem', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)' }}>
            Solicitar novo crédito
          </Link>
        </div>

        {items.length === 0 ? (
          <div style={{ backgroundColor: 'var(--surf)', border: '1px solid var(--line)', borderLeft: '2px solid var(--acc)', padding: '5rem 2rem', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--acc)', fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 200 }}>
              Nenhuma proposta registrada ainda.
            </h2>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--surf)', border: '1px solid var(--line)', borderLeft: '2px solid var(--acc)', overflow: 'hidden' }}>
            {items.map((item) => {
              const status = item.final_verdict ?? item.last_status ?? 'pending';
              return (
                <button
                  key={item.request_id}
                  type="button"
                  onClick={() => router.push(`/status/${item.request_id}?cpf=${encodeURIComponent(item.cpf_masked)}&amount=${item.amount_brl}`)}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.1fr 1fr 1.4fr 0.8fr',
                    gap: '1rem',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    border: 0,
                    borderBottom: '1px solid var(--line)',
                    borderLeft: '1px solid var(--line2)',
                    backgroundColor: 'transparent',
                    color: 'var(--text)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{item.request_id}</span>
                  <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{item.cpf_masked}</span>
                  <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>R$ {item.amount_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <StatusBadge status={status} />
                  <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'right' }}>{relativeTime(item.last_updated_at ?? item.created_at)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </CockpitLayout>
  );
}
