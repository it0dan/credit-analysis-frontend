'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'dan:debug-mode';

interface DebugContextValue {
  enabled: boolean;
  toggle: () => void;
}

const DebugContext = createContext<DebugContextValue | null>(null);

export function DebugProvider({ defaultEnabled, children }: { defaultEnabled: boolean; children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlDebug = params.get('debug');

    if (urlDebug === '1' || urlDebug === '0') {
      const next = urlDebug === '1';
      setEnabled(next);
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return;
    }

    const persisted = window.localStorage.getItem(STORAGE_KEY);
    if (persisted === 'true' || persisted === 'false') {
      setEnabled(persisted === 'true');
    }
  }, []);

  const setAndPersist = useCallback((next: boolean) => {
    setEnabled(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlDebug = params.get('debug');
    if (urlDebug === '1') setAndPersist(true);
    if (urlDebug === '0') setAndPersist(false);
  }, [setAndPersist]);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);

  return (
    <DebugContext.Provider value={value}>
      {children}
      {enabled && (
        <aside
          aria-label="Debug mode"
          title="Debug ativo. Use Ctrl+Shift+D para alternar."
          style={{
            position: 'fixed',
            top: '8px',
            right: '16px',
            zIndex: 1000,
            pointerEvents: 'none',
            padding: '4px 8px',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderBottom: '1px solid var(--acc)',
            color: 'var(--acc)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: 'var(--ls-label-strong)',
            textTransform: 'uppercase',
          }}
        >
          [DEBUG·ON]
        </aside>
      )}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    return { enabled: false, toggle: () => undefined };
  }
  return context;
}

export function DebugOnly({ children }: { children: React.ReactNode }) {
  const { enabled } = useDebug();
  if (!enabled) return null;
  return <>{children}</>;
}

export function HumanLabel({ human, debug }: { human: React.ReactNode; debug: React.ReactNode }) {
  const { enabled } = useDebug();
  return <>{enabled ? debug : human}</>;
}
