import React from 'react';
import {
  Download,
  FileJson,
  ShieldCheck,
  Clock,
  FileText,
  Cpu,
  Database,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button, Card, CardContent, Badge } from './UI';
import { ScoreGauge } from './ScoreGauge';
import { cn } from '../lib/utils';
import type { AuditResults } from '../services/geminiService';

interface ComplianceReportScreenProps {
  auditResults: AuditResults;
  fileName: string;
  modelType: string;
  sensitiveAttrs: string[];
  onExportPDF: () => void;
  onExportJSON: () => void;
  onBackToDashboard: () => void;
}

interface AuditTrailEntry {
  timestamp: string;
  action: string;
  detail: string;
  status: 'success' | 'info' | 'warning';
}

const screenTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export function ComplianceReportScreen({
  auditResults,
  fileName,
  modelType,
  sensitiveAttrs,
  onExportPDF,
  onExportJSON,
  onBackToDashboard,
}: ComplianceReportScreenProps) {
  const now = new Date();
  const reportId = `JEDI-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const timestampStr = now.toLocaleString();

  // Build audit trail from the audit results context
  const auditTrail: AuditTrailEntry[] = [
    {
      timestamp: timestampStr,
      action: 'Report Generated',
      detail: `JEDI Compliance Report ${reportId} created.`,
      status: 'success',
    },
    {
      timestamp: timestampStr,
      action: 'Scoring Complete',
      detail: `Overall compliance score: ${auditResults.totalScore}/100 — ${auditResults.overallStatus}.`,
      status: auditResults.totalScore >= 80 ? 'success' : auditResults.totalScore >= 60 ? 'warning' : 'warning',
    },
    {
      timestamp: timestampStr,
      action: 'Bias Analysis',
      detail: `${auditResults.biasDetection.patterns.length} bias pattern(s) detected across ${sensitiveAttrs.length} sensitive attribute(s).`,
      status: auditResults.biasDetection.patterns.length === 0 ? 'success' : 'warning',
    },
    {
      timestamp: timestampStr,
      action: 'Feature Analysis',
      detail: `${auditResults.featureImportance.length} features analyzed for importance and sensitivity.`,
      status: 'info',
    },
    {
      timestamp: timestampStr,
      action: 'Audit Initiated',
      detail: `Dataset "${fileName}" audited using ${modelType} model. Target variable and ${sensitiveAttrs.length} sensitive attribute(s) configured.`,
      status: 'info',
    },
    {
      timestamp: timestampStr,
      action: 'Dataset Loaded',
      detail: `File "${fileName}" uploaded and parsed for ethical audit.`,
      status: 'info',
    },
  ];

  const fm = auditResults.fairnessMetrics;
  const metricsSummary = [
    { label: 'Demographic Parity', score: fm.demographicParity.score, max: 35, status: fm.demographicParity.status },
    { label: 'Equal Opportunity', score: fm.equalOpportunity.score, max: 20, status: fm.equalOpportunity.status },
    { label: 'Calibration', score: fm.calibration.score, max: 15, status: fm.calibration.status },
    { label: 'Model Accuracy', score: fm.accuracy.score, max: 20, status: fm.accuracy.status },
    { label: 'Explainability', score: fm.explainability.score, max: 10, status: fm.explainability.status },
  ];

  const statusIcon = (status: 'success' | 'info' | 'warning') => {
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <Clock className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />;
  };

  return (
    <motion.div key="report" {...screenTransition} className="space-y-8 max-w-4xl mx-auto">

      {/* Back nav */}
      <Button variant="ghost" onClick={onBackToDashboard} className="-ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      {/* ── Hero: Big Score Circle ────────────────────────────────────── */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-zinc-900 dark:bg-zinc-950 text-white px-8 pt-10 pb-12">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">JEDI Compliance Report</h1>
              <p className="text-zinc-400 text-sm">{reportId} &bull; {timestampStr}</p>
            </div>
          </div>

          {/* Big score center */}
          <div className="flex flex-col items-center gap-4">
            <ScoreGauge score={auditResults.totalScore} max={100} size={200} strokeWidth={14} />
            <div className="text-center">
              <div
                className={cn(
                  'text-2xl font-bold mt-2',
                  auditResults.overallStatus === 'Compliant'
                    ? 'text-emerald-400'
                    : auditResults.overallStatus === 'Conditionally Compliant'
                      ? 'text-amber-400'
                      : 'text-red-400',
                )}
              >
                {auditResults.overallStatus}
              </div>
              <p className="text-zinc-400 text-sm mt-1 max-w-md">
                {auditResults.totalScore >= 80
                  ? 'All JEDI fairness thresholds met. The model is approved for deployment.'
                  : auditResults.totalScore >= 60
                    ? 'Some thresholds require attention. Conditional approval with remediation steps.'
                    : 'Critical fairness thresholds not met. Remediation is required before deployment.'}
              </p>
            </div>
          </div>

          {/* Metric pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {metricsSummary.map((m) => (
              <div
                key={m.label}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border',
                  m.status === 'pass'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : m.status === 'warning'
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      : 'border-red-500/30 bg-red-500/10 text-red-400',
                )}
              >
                {m.label}: {m.score}/{m.max}
              </div>
            ))}
          </div>
        </div>

        {/* Download section */}
        <div className="bg-white dark:bg-zinc-800 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-700">
          <div>
            <h3 className="font-semibold dark:text-zinc-100">Download Report</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Export the full compliance report with all metrics and recommendations.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onExportPDF}>
              <Download className="w-4 h-4" />
              PDF Report
            </Button>
            <Button variant="outline" onClick={onExportJSON}>
              <FileJson className="w-4 h-4" />
              JSON Data
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Audit Info ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-lg">
            <Database className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Dataset</p>
            <p className="text-sm font-semibold dark:text-zinc-100 truncate">{fileName}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-lg">
            <Cpu className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Model Type</p>
            <p className="text-sm font-semibold dark:text-zinc-100">{modelType}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-lg">
            <FileText className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Sensitive Attributes</p>
            <p className="text-sm font-semibold dark:text-zinc-100">{sensitiveAttrs.join(', ')}</p>
          </div>
        </Card>
      </div>

      {/* ── Audit Trail ────────────────────────────────────────────────── */}
      <Card className="dark:bg-zinc-800 dark:border-zinc-700">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <h3 className="font-bold dark:text-zinc-100">Audit Trail</h3>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
          {auditTrail.map((entry, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-4">
              {/* Timeline dot */}
              <div className="flex flex-col items-center mt-0.5">
                {statusIcon(entry.status)}
                {i < auditTrail.length - 1 && (
                  <div className="w-px h-full min-h-[24px] bg-zinc-200 dark:bg-zinc-600 mt-1" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold dark:text-zinc-100">{entry.action}</span>
                  <Badge variant={
                    entry.status === 'success' ? 'pass' :
                    entry.status === 'warning' ? 'warning' : 'neutral'
                  }>
                    {entry.status === 'success' ? 'PASS' : entry.status === 'warning' ? 'ATTENTION' : 'INFO'}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{entry.detail}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{entry.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
