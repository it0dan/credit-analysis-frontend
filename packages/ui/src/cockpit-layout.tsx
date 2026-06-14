import React from 'react';
import { Pulse } from './pulse';
import { Brand } from './brand';

interface CockpitLayoutProps {
  children: React.ReactNode;
  activeLink: 'home' | 'proposal' | 'status' | 'queue' | 'review' | 'analytics' | 'settings';
  portalType: 'customer' | 'operator';
  request_id?: string;
}

export function CockpitLayout({ children, activeLink, portalType, request_id }: CockpitLayoutProps) {
  const portalLabel = portalType === 'customer' ? 'portal' : 'cockpit';
  const menuItems = portalType === 'customer'
    ? [
        { id: 'proposal', label: '> Solicitar Crédito', path: '/' },
        { id: 'status', label: '> Acompanhamento', path: request_id ? `/status/${request_id}` : '/status/draft', disabled: !request_id },
        { id: 'settings', label: '> Configurações', path: '#', disabled: true },
      ]
    : [
        { id: 'home', label: '> Início', path: '/' },
        { id: 'queue', label: '> Fila de Análise', path: '/queue' },
        { id: 'analytics', label: '> Painel Geral', path: '/dashboard' },
        { id: 'settings', label: '> Auditoria e PLD', path: '#', disabled: true },
      ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          height: '56px',
          backgroundColor: 'var(--surf)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          zIndex: 10,
        }}
      >
        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Brand variant="full" />
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--line2)' }} />
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 400,
              color: 'var(--text)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--ls-label)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {portalType === 'customer' ? 'Customer ' : 'Operator '}
            <span style={{ color: 'var(--acc)' }}>{portalLabel}</span>
          </span>
        </div>

        {/* Central Telemetry */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            fontSize: '0.68rem',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: 'var(--ls-label)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: 'var(--line2)' }}>[</span>
          <Pulse color="acc" size={7} />
          <span style={{ color: 'var(--acc)' }}>LIVE</span>
          <span style={{ color: 'var(--line2)' }}>·</span>
          <span><span style={{ color: 'var(--text)' }}>3</span> agents</span>
          <span style={{ color: 'var(--line2)' }}>·</span>
          <span>T+<span style={{ color: 'var(--text)' }}>00:00:00</span></span>
          <span style={{ color: 'var(--line2)' }}>]</span>
        </div>

        {/* Right info */}
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text)',
            fontWeight: 400,
            borderLeft: '1px solid var(--line)',
            paddingLeft: '1rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          OP-1002
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 88px)', width: '100vw', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '220px',
            backgroundColor: 'var(--surf)',
            borderRight: '1px solid var(--line)',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 5,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 400,
                color: 'var(--text)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label-strong)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Navegação
            </span>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {menuItems.map((item) => {
                const isActive = activeLink === item.id;
                return item.disabled ? (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.6rem 0.75rem',
                      color: 'var(--text)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'not-allowed',
                    }}
                  >
                    {item.label}
                  </div>
                ) : (
                  <a
                    key={item.id}
                    href={item.path}
                    style={{
                      padding: '0.6rem 0.75rem',
                      color: isActive ? 'var(--acc)' : 'var(--text)',
                      backgroundColor: 'transparent',
                      borderLeft: isActive ? '2px solid var(--acc)' : '2px solid transparent',
                      borderBottom: isActive ? '1px solid var(--acc)' : '1px solid transparent',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: isActive ? 400 : 300,
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'color 0.15s, border-color 0.15s',
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text)';
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <span style={{ fontSize: '0.6rem', fontWeight: 400, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
              Trace Conector
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              W3C Propagator
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--acc)', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
              env: reference-v2
            </span>
          </div>
        </aside>

        {/* Content Area */}
        <main
          style={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
          }}
        >
          {children}
        </main>
      </div>

      {/* HUD Footer */}
      <footer
        style={{
          height: '32px',
          backgroundColor: 'var(--bg)',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          fontSize: '10px',
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--ls-label-strong)',
          zIndex: 10,
        }}
      >
        <Brand variant="footer" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ color: 'var(--acc)' }}>STATUS</span>
          <span style={{ color: 'var(--line2)' }}>·</span>
          <Pulse color="acc" size={7} />
          <span style={{ color: 'var(--text)' }}>HEALTHY</span>
        </div>
      </footer>
    </div>
  );
}
