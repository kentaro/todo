import React from 'react';

export const EmptyTodoSVG: React.FC = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="40" width="160" height="120" fill="#f0f0f0" stroke="#a0a0a0" strokeWidth="4" />
    <line x1="40" y1="80" x2="160" y2="80" stroke="#c0c0c0" strokeWidth="4" />
    <line x1="40" y1="120" x2="160" y2="120" stroke="#c0c0c0" strokeWidth="4" />
    <circle cx="100" cy="180" r="10" fill="#ff6b6b" />
    <text x="100" y="30" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#4a4a4a">
      空のTODOリスト
    </text>
  </svg>
);
