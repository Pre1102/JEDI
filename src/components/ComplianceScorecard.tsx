import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { Button, Card, CardContent } from './UI';
import { ScoreGauge } from './ScoreGauge';
import { cn } from '../lib/utils';
import type { AuditResults } from '../services/geminiService';

interface ComplianceScorecardProps {
  auditResults: AuditResults;
  onExportPDF: () => void;
}

export function ComplianceScorecard({ auditResults, onExportPDF }: ComplianceScorecardProps) {
  return (
    <Card className="bg-zinc-900 dark:bg-zinc-950 text-white border-none">
      <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
            Final Evaluation
          </h3>
          <div className="flex items-baseline gap-3">
            <div className="text-5xl font-bold">{auditResults.totalScore}</div>
            <div className="text-xl text-zinc-500">/ 100</div>
          </div>
          <div
            className={cn(
              'text-2xl font-semibold',
              auditResults.overallStatus === 'Compliant'
                ? 'text-emerald-400'
                : auditResults.overallStatus === 'Conditionally Compliant'
                  ? 'text-amber-400'
                  : 'text-red-400',
            )}
          >
            {auditResults.overallStatus}
          </div>
          <p className="text-zinc-400 max-w-md">
            The model has been evaluated against JEDI standards.
            {auditResults.totalScore >= 80
              ? ' All fairness thresholds met.'
              : ' Remediation steps required for full compliance.'}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <ScoreGauge score={auditResults.totalScore} max={100} size={140} strokeWidth={10} />
          <Button
            variant="secondary"
            className="bg-white text-zinc-900 hover:bg-zinc-100"
            onClick={onExportPDF}
          >
            Generate Full Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
