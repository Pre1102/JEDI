import React from 'react';
import { motion } from 'motion/react';
import { FeatureImportanceChart } from './FeatureImportanceChart';
import { BiasPatterns } from './BiasPatterns';
import { MetricComparisonChart } from './MetricComparisonChart';
import { ScoreBreakdownChart } from './ScoreBreakdownChart';
import { DataQualitySummary } from './DataQualitySummary';
import type { AuditResults } from '../services/geminiService';
import type { DatasetStatsData } from './DatasetStats';

const screenTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25 },
};

interface AnalysisScreenProps {
  auditResults: AuditResults;
  fileName: string;
  sensitiveAttrs: string[];
  datasetStats: DatasetStatsData | null;
}

export function AnalysisScreen({
  auditResults,
  fileName,
  sensitiveAttrs,
  datasetStats,
}: AnalysisScreenProps) {
  return (
    <motion.div {...screenTransition} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Dataset Analysis
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          In-depth analysis of <span className="font-medium text-zinc-700 dark:text-zinc-300">{fileName}</span> with fairness metrics and bias detection
        </p>
      </div>

      {/* Data Quality Section */}
      {datasetStats && (
        <DataQualitySummary stats={datasetStats} fileName={fileName} />
      )}

      {/* Score Breakdown + Metric Comparison — equal sized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreBreakdownChart auditResults={auditResults} />
        <MetricComparisonChart auditResults={auditResults} />
      </div>

      {/* Detailed Charts: Feature Importance + Bias Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureImportanceChart
          features={auditResults.featureImportance}
          sensitiveAttrs={sensitiveAttrs}
        />
        <BiasPatterns biasDetection={auditResults.biasDetection} />
      </div>
    </motion.div>
  );
}
