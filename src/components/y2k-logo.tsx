import React from 'react';

const Y2KLogo: React.FC = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="y2kGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF00FF" />
        <stop offset="100%" stopColor="#00FFFF" />
      </linearGradient>
    </defs>
    <circle cx="40" cy="40" r="38" fill="url(#y2kGradient)" />
    <text x="40" y="48" fontSize="28" fontWeight="bold" textAnchor="middle" fill="white">
      TODO
    </text>
  </svg>
);

export default Y2KLogo;
