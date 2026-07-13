'use client';

import React, { useEffect, useState } from 'react';
import { signOut, useAuthUser } from '@repo/auth';
import { CockpitLayout } from '@repo/ui/cockpit-layout';
import { Tag } from '@repo/ui/tag';
import { useDebug } from '@repo/ui/debug-context';

type Tab = 'Perfil' | 'Notificações' | 'Exibição';

const TABS: Tab[] = ['Perfil', 'Notificações', 'Exibição'];
const logout = () => signOut({ redirectTo: 'http://localhost:3000/login' });

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Perfil');

  return (
    <CockpitLayout activeLink="settings" portalType="customer" liveState="idle" onSignOut={logout}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1rem 0' }}>
        <Tag dim="conta">configurações</Tag>
        <h1 style={{ margin: '0.45rem 0 0', fontSize: '1.5rem', fontWeight: 200, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
          Minha <span style={{ color: 'var(--acc)' }}>Conta</span>
        </h1>
        <p style={{ margin: '0.55rem 0 1.75rem', color: 'var(--text)', opacity: 0.76, fontSize: '0.85rem' }}>
          Gerencie seus dados e preferências deste dispositivo.
        </p>

        <div role="tablist" aria-label="Configurações da conta" style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', marginBottom: '2rem' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--acc)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--acc)' : 'var(--text)',
                opacity: activeTab === tab ? 1 : 0.72,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label)',
                padding: '0.6rem 1.25rem',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.15s, border-bottom-color 0.15s, opacity 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Perfil' && <ProfileTab />}
        {activeTab === 'Notificações' && <NotificationsTab />}
        {activeTab === 'Exibição' && <DisplayTab />}
      </div>
    </CockpitLayout>
  );
}

function ProfileTab() {
  const user = useAuthUser();
  const initial = (user?.name ?? user?.email ?? 'C').trim().charAt(0).toUpperCase();
  const roleLabel = user?.role === 'operator' ? 'OPERADOR' : 'CLIENTE';

  return (
    <section id="panel-Perfil" role="tabpanel" aria-labelledby="tab-Perfil" style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
        <div aria-hidden="true" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--line2)', color: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '1.15rem' }}>
          {initial}
        </div>
        <div>
          <Tag dim="perfil">titular</Tag>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>{user?.name ?? 'Cliente demonstração'}</p>
        </div>
      </div>

      <ProfileRow label="E-mail" value={user?.email ?? 'E-mail não informado'} />
      <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--line)' }}>
        <Tag dim="acesso">perfil de acesso</Tag>
        <div style={{ marginTop: '0.45rem' }}>
          <span style={{ color: user?.role === 'operator' ? 'var(--warn)' : 'var(--acc)', border: `1px solid ${user?.role === 'operator' ? 'var(--warn)' : 'var(--acc)'}`, padding: '0.2rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: 'var(--ls-label)' }}>
            {roleLabel}
          </span>
        </div>
      </div>

      <button type="button" onClick={logout} style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--alert)', color: 'var(--alert)', padding: '0.65rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', cursor: 'pointer' }}>
        → Sair da conta
      </button>
    </section>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--line)' }}>
      <Tag dim="cadastro">{label}</Tag>
      <p style={{ margin: '0.4rem 0 0', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{value}</p>
    </div>
  );
}

function NotificationsTab() {
  return (
    <section id="panel-Notificações" role="tabpanel" aria-labelledby="tab-Notificações" style={cardStyle}>
      <Tag dim="avisos">notificações</Tag>
      <h2 style={sectionTitleStyle}>Como você quer acompanhar suas propostas</h2>
      <Toggle label="Receber resultado por e-mail" storageKey="dan:pref-email-notify" />
      <Toggle label="Notificar quando a proposta mudar de status" storageKey="dan:pref-status-notify" />
    </section>
  );
}

function DisplayTab() {
  const { enabled, toggle } = useDebug();

  return (
    <section id="panel-Exibição" role="tabpanel" aria-labelledby="tab-Exibição" style={cardStyle}>
      <Tag dim="interface">exibição</Tag>
      <h2 style={sectionTitleStyle}>Preferências deste dispositivo</h2>
      <ToggleControl label="Modo debug" description="Exibe detalhes técnicos das análises (atalho: Ctrl+Shift+D)" on={enabled} onToggle={toggle} />
      <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--line)' }}>
        <Tag dim="idioma">idioma</Tag>
        <p style={{ margin: '0.4rem 0 0', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>PT-BR (padrão)</p>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--text)', opacity: 0.7, fontSize: '0.75rem' }}>Outros idiomas em breve.</p>
      </div>
      <p style={{ margin: '1.25rem 0 0', color: 'var(--text)', opacity: 0.68, fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
        v0.2.0-demo · análise de crédito agêntica
      </p>
    </section>
  );
}

function Toggle({ label, storageKey }: { label: string; storageKey: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(window.localStorage.getItem(storageKey) === 'true');
  }, [storageKey]);

  const toggle = () => {
    setOn((current) => {
      const next = !current;
      window.localStorage.setItem(storageKey, String(next));
      return next;
    });
  };

  return <ToggleControl label={label} on={on} onToggle={toggle} />;
}

function ToggleControl({ label, description, on, onToggle }: { label: string; description?: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.85rem 0', border: 0, borderBottom: '1px solid var(--line)', background: 'transparent', textAlign: 'left' }}>
      <span aria-hidden="true" style={{ width: '36px', height: '18px', border: `1px solid ${on ? 'var(--acc)' : 'var(--line2)'}`, position: 'relative', flexShrink: 0, transition: 'border-color 0.2s', background: on ? 'rgba(127,255,212,0.08)' : 'transparent' }}>
        <span style={{ width: '12px', height: '12px', background: on ? 'var(--acc)' : 'var(--line2)', position: 'absolute', top: '2px', left: on ? '20px' : '2px', transition: 'left 0.2s ease, background 0.2s' }} />
      </span>
      <span>
        <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text)', opacity: on ? 1 : 0.76, transition: 'opacity 0.2s' }}>{label}</span>
        {description && <span style={{ display: 'block', marginTop: '0.3rem', color: 'var(--text)', opacity: 0.7, fontSize: '0.72rem' }}>{description}</span>}
      </span>
    </button>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surf)',
  border: '1px solid var(--line)',
  borderLeft: '2px solid var(--acc)',
  padding: '1.5rem',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: '0.45rem 0 1rem',
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  fontSize: '1rem',
  fontWeight: 300,
};
