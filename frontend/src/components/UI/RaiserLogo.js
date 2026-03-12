import React from 'react';

const RaiserLogo = ({ size = 40 }) => (
  <svg
    width={size}
    height={size * 1.2}
    viewBox="0 0 100 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wrist */}
    <rect x="22" y="88" width="56" height="28" rx="10" fill="#1E3A8A"/>

    {/* Palm */}
    <rect x="18" y="52" width="64" height="44" rx="12" fill="#2563EB"/>

    {/* Pinky finger */}
    <rect x="18" y="30" width="13" height="30" rx="6.5" fill="#2563EB"/>
    <ellipse cx="24.5" cy="30" rx="6.5" ry="6" fill="#3B82F6"/>

    {/* Ring finger */}
    <rect x="33" y="18" width="13" height="40" rx="6.5" fill="#2563EB"/>
    <ellipse cx="39.5" cy="18" rx="6.5" ry="6" fill="#3B82F6"/>

    {/* Middle finger - tallest */}
    <rect x="48" y="10" width="13" height="48" rx="6.5" fill="#2563EB"/>
    <ellipse cx="54.5" cy="10" rx="6.5" ry="6" fill="#3B82F6"/>

    {/* Index finger */}
    <rect x="63" y="18" width="13" height="40" rx="6.5" fill="#2563EB"/>
    <ellipse cx="69.5" cy="18" rx="6.5" ry="6" fill="#3B82F6"/>

    {/* Thumb - to the side */}
    <rect x="4" y="44" width="14" height="22" rx="7" fill="#2563EB"/>
    <ellipse cx="11" cy="44" rx="7" ry="6" fill="#3B82F6"/>

    {/* Knuckle lines */}
    <line x1="24" y1="58" x2="24" y2="66" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="39" y1="55" x2="39" y2="63" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="54" y1="55" x2="54" y2="63" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="69" y1="55" x2="69" y2="63" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default RaiserLogo;