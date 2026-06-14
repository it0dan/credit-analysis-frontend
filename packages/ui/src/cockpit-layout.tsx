import React from 'react';

interface CockpitLayoutProps {
  children: React.ReactNode;
  activeLink: 'home' | 'proposal' | 'status' | 'queue' | 'review' | 'analytics' | 'settings';
  portalType: 'customer' | 'operator';
  request_id?: string;
}

export function CockpitLayout({ children, activeLink, portalType, request_id }: CockpitLayoutProps) {
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
          <div
            style={{
              fontWeight: 200,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ color: 'var(--acc)' }}>sense</span>
            <span style={{ color: 'var(--warn)' }}>dia</span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 400,
                color: 'var(--muted)',
                marginLeft: '8px',
                padding: '0.15rem 0.4rem',
                border: '1px solid var(--line2)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-label)',
              }}
            >
              AI
            </span>
          </div>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--line2)' }} />
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 400,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--ls-label)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {portalType === 'customer' ? 'Customer portal' : 'Operator cockpit'}
          </span>
        </div>

        {/* Central Telemetry */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--acc)',
                animation: 'pulse-opacity 2s infinite ease-in-out',
                flexShrink: 0,
              }}
            />
            <span>AI Gateway: Online</span>
          </div>
          <span>Ping: 12ms</span>
          <span>OTel SDK: Active</span>
        </div>

        {/* Right info */}
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--muted)',
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
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 96px)', width: '100vw', overflow: 'hidden' }}>
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
                color: 'var(--muted)',
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
                      color: 'var(--muted)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      opacity: 0.4,
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
                      color: isActive ? 'var(--acc)' : 'var(--muted)',
                      backgroundColor: 'transparent',
                      borderLeft: isActive ? '2px solid var(--acc)' : '2px solid transparent',
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
                      if (!isActive) e.currentTarget.style.color = 'var(--muted)';
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
            <span style={{ fontSize: '0.6rem', fontWeight: 400, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-label)', fontFamily: 'var(--font-mono)' }}>
              Trace Conector
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
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

      {/* Footer */}
      <footer
        style={{
          height: '40px',
          backgroundColor: 'var(--bg)',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          fontSize: '0.7rem',
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          zIndex: 10,
        }}
      >
        <span>© 2026 Sensedia SA.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>Region: sa-east-1</span>
          <span>Environment: Production</span>
          <span style={{ color: 'var(--acc)' }}>OTel Collector: Active</span>
        </div>
      </footer>
    </div>
  );
}
