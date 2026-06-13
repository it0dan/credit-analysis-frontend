import React, { type JSX } from 'react';

interface CardProps {
  elevated?: boolean;
  interactive?: boolean;
  glass?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler;
}

export function Card({
  elevated = false,
  interactive = false,
  glass = true,
  as: Tag = 'div',
  children,
  style,
  className,
  onClick,
}: CardProps) {
  const base: React.CSSProperties = {
    background: elevated ? 'var(--surf2)' : 'var(--surf)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    backdropFilter: glass ? 'blur(12px)' : undefined,
    WebkitBackdropFilter: glass ? 'blur(12px)' : undefined,
    transition: interactive
      ? 'transform 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.2s, box-shadow 0.2s'
      : undefined,
    cursor: interactive ? 'pointer' : undefined,
    containerType: interactive ? 'inline-size' : undefined,
  };

  const handleMouseOver = interactive
    ? (e: React.MouseEvent<Element>) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-2px)';
        el.style.borderColor = 'var(--line2)';
        el.style.boxShadow = 'var(--shadow-acc)';
      }
    : undefined;

  const handleMouseOut = interactive
    ? (e: React.MouseEvent<Element>) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }
    : undefined;

  return (
    <Tag
      className={className}
      style={{ ...base, ...style }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
