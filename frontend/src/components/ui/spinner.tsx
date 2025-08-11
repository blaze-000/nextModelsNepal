import React from 'react';

interface SpinnerProps {
  size?: number; // spinner size in px
  color?: string; // spinner color
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 20, color = 'currentColor', className }) => {
  const lines = 12;
  const lineStyle = (i: number) => ({
    position: 'absolute' as const,
    left: '-10%',
    top: '-3.9%',
    height: '8%',
    width: '24%',
    backgroundColor: color,
    transform: `rotate(${i * 30}deg) translate(146%)`,
    animationDelay: `${-1100 + i * 100}ms`,
    animationDuration: '1200ms',
    animationName: 'geist-spinner-fade',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    borderRadius: '2px',
  });

  return (
    <>
      <style>{`
        @keyframes geist-spinner-fade {
          0%, 39%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
      `}</style>
      <div
        className={className}
        style={{
          position: 'relative',
          width: size,
          height: size,
          color,
          left: '50%',
          top: '50%',
        }}
        aria-label="loading"
        role="progressbar"
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={lineStyle(i)} />
        ))}
      </div>
    </>
  );
};

export { Spinner };
