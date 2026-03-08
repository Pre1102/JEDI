import React from 'react';
import { cn } from '../lib/utils';

interface ScoreGaugeProps {
  score: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreGauge({
  score,
  max,
  size = 120,
  strokeWidth = 8,
  className,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / max, 1);
  const offset = circumference * (1 - percentage);

  const getColor = () => {
    if (percentage >= 0.8) return { stroke: '#10b981', text: 'text-emerald-400' };
    if (percentage >= 0.6) return { stroke: '#f59e0b', text: 'text-amber-400' };
    return { stroke: '#ef4444', text: 'text-red-400' };
  };

  const color = getColor();

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-3xl font-bold', color.text)}>{score}</span>
        <span className="text-xs text-zinc-500">/ {max}</span>
      </div>
    </div>
  );
}
