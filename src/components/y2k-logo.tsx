import React from 'react';

interface Y2KLogoProps {
  className?: string;
}

const Y2KLogo = ({ className }: Y2KLogoProps) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <span
        className="font-bold text-white bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent"
        style={{
          textShadow: '2px 2px 4px rgba(255, 105, 180, 0.7), -2px -2px 4px rgba(0, 255, 255, 0.7)',
          WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
        }}
      >
        SUPER TODO
      </span>
    </div>
  );
};

export default Y2KLogo;
