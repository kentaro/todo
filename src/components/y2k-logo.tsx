import React from 'react';

interface Y2KLogoProps {
  className?: string;
}

const Y2KLogo: React.FC<Y2KLogoProps> = ({ className }) => (
  <div className={`${className} flex items-center justify-center`}>
    <span className="text-4xl font-bold text-white bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
      TODO
    </span>
  </div>
);

export default Y2KLogo;
