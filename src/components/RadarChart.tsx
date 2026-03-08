import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardContent } from './UI';
import type { AuditResults } from '../services/geminiService';

interface FairnessRadarChartProps {
  auditResults: AuditResults;
}

export function FairnessRadarChart({ auditResults }: FairnessRadarChartProps) {
  const fm = auditResults.fairnessMetrics;

  const data = [
    { dimension: 'Demographic\nParity', value: (fm.demographicParity.score / 35) * 100, fullMark: 100 },
    { dimension: 'Equal\nOpportunity', value: (fm.equalOpportunity.score / 20) * 100, fullMark: 100 },
    { dimension: 'Calibration', value: (fm.calibration.score / 15) * 100, fullMark: 100 },
    { dimension: 'Accuracy', value: (fm.accuracy.score / 20) * 100, fullMark: 100 },
    { dimension: 'Explain-\nability', value: (fm.explainability.score / 10) * 100, fullMark: 100 },
  ];

  return (
    <Card className="dark:bg-zinc-800 dark:border-zinc-700">
      <CardHeader>
        <h3 className="font-bold flex items-center gap-2 dark:text-zinc-100">
          Fairness Profile
        </h3>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#d4d4d8" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 11, fill: '#71717a' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#a1a1aa' }}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#18181b"
              fill="#18181b"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
