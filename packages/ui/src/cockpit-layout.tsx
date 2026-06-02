import React, { useState, useEffect } from 'react';

interface CockpitLayoutProps {
  children: React.ReactNode;
  activeLink: 'proposal' | 'status' | 'queue' | 'review' | 'analytics' | 'settings';
  portalType: 'customer' | 'operator';
  request_id?: string;
}

export function CockpitLayout({ children, activeLink, portalType, request_id }: CockpitLayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize theme from document element or default to dark
  useEffect(() => {
    const existing = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
    setTheme(existing);
    document.documentElement.setAttribute('data-theme', existing);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const menuItems = portalType === 'customer' 
    ? [
        { id: 'proposal', label: '💼 Solicitar Crédito', path: '/' },
        { id: 'status', label: '⏳ Acompanhamento', path: request_id ? `/status/${request_id}` : '/status/draft', disabled: !request_id },
        { id: 'settings', label: '⚙️ Configurações', path: '#', disabled: true },
      ]
    : [
        { id: 'queue', label: '📋 Fila de Análise', path: '/queue' },
        { id: 'analytics', label: '📊 Painel Geral', path: '#', disabled: true },
        { id: 'settings', label: '⚙️ Auditoria e PLD', path: '#', disabled: true },
      ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        fontFamily: "var(--font-primary)",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          height: '70px',
          backgroundColor: 'var(--bg-navbar)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: 'var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          zIndex: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Sensedia Inspired Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{ 
              fontWeight: 900, 
              fontSize: '1.4rem', 
              letterSpacing: '-0.03em',
              fontFamily: 'var(--font-heading)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ color: 'hsl(262, 80%, 60%)' }}>sense</span>
            <span style={{ color: 'hsl(24, 100%, 50%)' }}>dia</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '8px', padding: '0.2rem 0.5rem', backgroundColor: 'var(--border-glass)', borderRadius: '6px' }}>AI</span>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-glass)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {portalType === 'customer' ? 'Customer portal' : 'operator cockpit'}
          </span>
        </div>

        {/* Central Cockpit Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="desktop-only">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-emerald)', boxShadow: '0 0 8px var(--color-emerald)' }} />
            <span>AI Gateway: Online</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
          <span>Ping: 12ms</span>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
          <span>OTel SDK: Active</span>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'hsla(0, 0%, 100%, 0.05)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'hsla(0, 0%, 100%, 0.1)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'hsla(0, 0%, 100%, 0.05)';
              e.currentTarget.style.borderColor = 'var(--border-glass)';
            }}
          >
            {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>
          
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 700, borderLeft: '1px solid var(--border-glass)', paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👤 OP-1002</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 120px)', width: '100vw', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '260px',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: 'var(--border-glass)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 5,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Navegação Cognitiva
            </span>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {menuItems.map((item) => {
                const isActive = activeLink === item.id;
                return item.disabled ? (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      opacity: 0.5,
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.label}
                  </div>
                ) : (
                  <a
                    key={item.id}
                    href={item.path}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--color-primary-glow)' : 'transparent',
                      border: isActive ? '1px solid var(--border-glass)' : '1px solid transparent',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.backgroundColor = 'hsla(0, 0%, 100%, 0.03)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: 'hsla(0, 0%, 100%, 0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trace Conector
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              W3C Propagator
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 700, wordBreak: 'break-all' }}>
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
            padding: '2.5rem',
            position: 'relative',
          }}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer
        style={{
          height: '50px',
          backgroundColor: 'var(--bg-footer)',
          borderTop: 'var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        <span>
          © 2026 Sensedia SA. Todos os direitos reservados.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>Region: sa-east-1</span>
          <span>Environment: Production</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Sensedia OpenTelemetry Collector Active
          </span>
        </div>
      </footer>
    </div>
  );
}
