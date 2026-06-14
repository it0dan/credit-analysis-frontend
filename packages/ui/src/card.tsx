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
  as: Tag = 'div',
  children,
  style,
  className,
  onClick,
}: CardProps) {
  const base: React.CSSProperties = {
    background: elevated ? 'var(--bg)' : 'var(--surf)',
    border: '1px solid var(--line)',
    cursor: interactive ? 'pointer' : undefined,
  };

  const handleMouseOver = interactive
    ? (e: React.MouseEvent<Element>) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--acc)';
      }
    : undefined;

  const handleMouseOut = interactive
    ? (e: React.MouseEvent<Element>) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--line)';
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
