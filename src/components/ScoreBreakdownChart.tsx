import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, Badge } from './UI';
import { cn } from '../lib/utils';
import type { AuditResults } from '../services/geminiService';

interface ScoreBreakdownChartProps {
  auditResults: AuditResults;
}

function getStatusConfig(status: string) {
  if (status === 'pass') {
    return {
      icon: CheckCircle2,
      label: 'PASS',
      badgeVariant: 'pass' as const,
      barColor: 'bg-emerald-500',
      iconColor: 'text-emerald-500',
    };
  }
  if (status === 'warning') {
    return {
      icon: AlertTriangle,
      label: 'WARNING',
      badgeVariant: 'warning' as const,
      barColor: 'bg-amber-500',
      iconColor: 'text-amber-500',
    };
  }
  return {
    icon: XCircle,
    label: 'FAIL',
    badgeVariant: 'fail' as const,
    barColor: 'bg-red-500',
    iconColor: 'text-red-500',
  };
}

export function ScoreBreakdownChart({ auditResults }: ScoreBreakdownChartProps) {
  const fm = auditResults.fairnessMetrics;

  const metrics = [
    { name: 'Demographic Parity', score: fm.demographicParity.score, max: 35, status: fm.demographicParity.status },
    { name: 'Equal Opportunity', score: fm.equalOpportunity.score, max: 20, status: fm.equalOpportunity.status },
    { name: 'Calibration', score: fm.calibration.score, max: 15, status: fm.calibration.status },
    { name: 'Model Accuracy', score: fm.accuracy.score, max: 20, status: fm.accuracy.status },
    { name: 'Explainability', score: fm.explainability.score, max: 10, status: fm.explainability.status },
  ];

  return (
    <Card className="dark:bg-zinc-800 dark:border-zinc-700">
      <CardHeader className="text-center">
        <h3 className="font-bold dark:text-zinc-100">
          Score Breakdown
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Total: <span className="font-bold text-zinc-900 dark:text-zinc-100">{auditResults.totalScore}</span> / 100
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const config = getStatusConfig(metric.status);
          const Icon = config.icon;
          const percent = metric.max > 0 ? (metric.score / metric.max) * 100 : 0;

          return (
            <div key={metric.name} className="space-y-1.5">
              {/* Label row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-4 h-4 shrink-0', config.iconColor)} />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {metric.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {metric.score}/{metric.max}
                  </span>
                  <Badge variant={config.badgeVariant} className="text-[10px] px-1.5 py-0">
                    {config.label}
                  </Badge>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700 ease-out', config.barColor)}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
