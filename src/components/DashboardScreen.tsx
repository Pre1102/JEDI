import React from 'react';
import { Download, FileJson, RotateCcw, BarChart3, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Button, Card, CardContent } from './UI';
import { ScorecardGrid } from './ScorecardGrid';
import { ComplianceScorecard } from './ComplianceScorecard';
import { ScoreGauge } from './ScoreGauge';
import { cn } from '../lib/utils';
import type { AuditResults } from '../services/geminiService';

interface DashboardScreenProps {
  auditResults: AuditResults;
  fileName: string;
  modelType: string;
  sensitiveAttrs: string[];
  onExportPDF: () => void;
  onExportJSON: () => void;
  onNewAudit: () => void;
  onViewReport: () => void;
  onViewAnalysis: () => void;
}

const screenTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export function DashboardScreen({
  auditResults,
  fileName,
  modelType,
  sensitiveAttrs,
  onExportPDF,
  onExportJSON,
  onNewAudit,
  onViewReport,
  onViewAnalysis,
}: DashboardScreenProps) {
  const statusColor =
    auditResults.overallStatus === 'Compliant'
      ? 'text-emerald-600 dark:text-emerald-400'
      : auditResults.overallStatus === 'Conditionally Compliant'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      key="dashboard"
      {...screenTransition}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-zinc-50">Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Results for <span className="font-medium text-zinc-700 dark:text-zinc-300">{fileName}</span> &bull; {modelType}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={onExportPDF} className="text-xs">
            <Download className="w-3.5 h-3.5" />
            PDF
          </Button>
          <Button variant="outline" onClick={onExportJSON} className="text-xs">
            <FileJson className="w-3.5 h-3.5" />
            JSON
          </Button>
          <Button variant="secondary" onClick={onNewAudit} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            New Audit
          </Button>
        </div>
      </div>

      {/* Quick Summary Card */}
      <Card className="dark:bg-zinc-800 dark:border-zinc-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ScoreGauge score={auditResults.totalScore} max={100} size={100} strokeWidth={8} />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold dark:text-zinc-100">
                {auditResults.totalScore}<span className="text-lg text-zinc-400 font-normal">/100</span>
              </h2>
              <p className={cn('text-lg font-semibold', statusColor)}>
                {auditResults.overallStatus}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {auditResults.totalScore >= 80
                  ? 'All fairness thresholds met. Model is ready for deployment.'
                  : auditResults.totalScore >= 60
                    ? 'Some metrics need attention. Review the analysis for details.'
                    : 'Significant remediation required before deployment.'}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold">Dataset</span>
                <p className="text-zinc-900 dark:text-zinc-100 font-medium">{fileName}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold">Model</span>
                <p className="text-zinc-900 dark:text-zinc-100 font-medium">{modelType}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold">Attributes</span>
                <p className="text-zinc-900 dark:text-zinc-100 font-medium">{sensitiveAttrs.join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scorecard Summary */}
      <ScorecardGrid auditResults={auditResults} />

      {/* Navigation Cards — link to Analysis & Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onViewAnalysis}
          className="group text-left p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Dataset Analysis</h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            View detailed charts including feature importance, bias patterns, fairness radar, metric comparisons, and data quality assessment.
          </p>
        </button>

        <button
          onClick={onViewReport}
          className="group text-left p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
              <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Compliance Report</h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            View the full JEDI compliance report with audit trail, certification status, and downloadable PDF/JSON exports.
          </p>
        </button>
      </div>

      {/* Compliance Scorecard */}
      <ComplianceScorecard auditResults={auditResults} onExportPDF={onExportPDF} />
    </motion.div>
  );
}
