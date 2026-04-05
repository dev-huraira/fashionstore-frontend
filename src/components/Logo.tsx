'use client';

import Link from 'next/link';
import React, { CSSProperties } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linked?: boolean;
  style?: CSSProperties;
}

/**
 * FashionStore Brand Logo
 * ─ Icon: dark rounded square · bold geometric "F" · amber accents
 * ─ Wordmark: FASHION (white/bold) + STORE (amber/tracked)
 * ─ Renders inline JSX so fonts always work — no img/svg file needed
 */
export default function Logo({ size = 'md', linked = true, style }: LogoProps) {
  const iconSz  = size === 'sm' ? 32 : size === 'lg' ? 54 : 42;
  const fSz     = size === 'sm' ? 15 : size === 'lg' ? 25 : 20;
  const storeSz = size === 'sm' ?  9 : size === 'lg' ? 14 : 11;
  const gap     = size === 'sm' ?  8 : size === 'lg' ? 14 : 11;

  const mark = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${gap}px`,
        textDecoration: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* ── Icon Mark ── */}
      <svg
        width={iconSz}
        height={iconSz}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0, display: 'block' }}
      >
        {/* Background */}
        <rect width="44" height="44" rx="11" fill="#131921" />

        {/* Left amber accent bar */}
        <rect x="0" y="0" width="5" height="44" rx="11" fill="#FF9900" />
        {/* Cover bottom-right of left bar so only top-left corner is round */}
        <rect x="0" y="11" width="5" height="33" fill="#FF9900" />

        {/* ── "F" letterform ── */}
        {/* Vertical stem */}
        <rect x="11" y="11" width="5.5" height="22" rx="2.5" fill="white" />
        {/* Top bar */}
        <rect x="11" y="11" width="21" height="5.5" rx="2.5" fill="white" />
        {/* Mid bar — slightly narrower, amber tinted */}
        <rect x="11" y="20" width="15.5" height="4.5" rx="2.25" fill="rgba(255,255,255,0.7)" />

        {/* Amber dot — bottom right corner */}
        <circle cx="35" cy="35" r="4" fill="#FF9900" />
      </svg>

      {/* ── Wordmark ── */}
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1,
          gap: '3px',
        }}
      >
        <span
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 800,
            fontSize: `${fSz}px`,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          FASHION
        </span>
        <span
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 600,
            fontSize: `${storeSz}px`,
            letterSpacing: '3px',
            color: '#FF9900',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          STORE
        </span>
      </span>
    </span>
  );

  if (linked) {
    return (
      <Link
        href="/"
        aria-label="FashionStore — Go to homepage"
        style={{ textDecoration: 'none', display: 'inline-flex' }}
      >
        {mark}
      </Link>
    );
  }

  return mark;
}
