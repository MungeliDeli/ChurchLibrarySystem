import React from 'react';

const ProgressBar = ({ progress, className = "" }) => {
  return (
    <div className={`w-full bg-[var(--color-surface)] rounded-full h-2.5 ${className}`}>
      <div
        className="bg-[var(--color-primary)] h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
