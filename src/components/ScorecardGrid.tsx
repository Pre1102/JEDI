import React from 'react';
import { Card, Badge } from './UI';
import { cn } from '../lib/utils';
import type { AuditResults } from '../services/geminiService';

interface ScorecardGridProps {
  auditResults: AuditResults;
}

export function ScorecardGrid({ auditResults }: ScorecardGridProps) {
  const metrics = [
    { label: 'Demographic Parity', metric: auditResults.fairnessMetrics.demographicParity, max: 35 },
    { label: 'Equal Opportunity', metric: auditResults.fairnessMetrics.equalOpportunity, max: 20 },
    { label: 'Calibration', metric: auditResults.fairnessMetrics.calibration, max: 15 },
    { label: 'Model Accuracy', metric: auditResults.fairnessMetrics.accuracy, max: 20 },
    { label: 'Explainability', metric: auditResults.fairnessMetrics.explainability, max: 10 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <Card key={i} className="p-4 flex flex-col justify-between dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {m.label}
            </span>
            <Badge variant={m.metric.status}>{m.metric.status.toUpperCase()}</Badge>
          </div>
          <div>
            <div className="text-2xl font-bold dark:text-zinc-100">
              {m.metric.score}
              <span className="text-sm text-zinc-300 dark:text-zinc-600 font-normal">/{m.max}</span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Value: {(m.metric.value * 100).toFixed(1)}%
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
