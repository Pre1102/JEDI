import React, { useState } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import { Card } from './UI';
import { FileUploader } from './FileUploader';
import { AuditConfigForm } from './AuditConfigForm';
import { DataPreview } from './DataPreview';
import { DatasetStats, computeDatasetStats } from './DatasetStats';
import type { DatasetStatsData } from './DatasetStats';

interface UploadScreenProps {
  file: File | null;
  data: Record<string, any>[];
  headers: string[];
  targetVar: string;
  sensitiveAttrs: string[];
  modelType: string;
  isAuditing: boolean;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  onTargetVarChange: (value: string) => void;
  onToggleSensitiveAttr: (attr: string) => void;
  onModelTypeChange: (value: string) => void;
  onRunAudit: () => void;
  onParseComplete: (data: Record<string, any>[], headers: string[]) => void;
  onDatasetStats: (stats: DatasetStatsData) => void;
  onError: (message: string) => void;
}

const screenTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export function UploadScreen({
  file,
  data,
  headers,
  targetVar,
  sensitiveAttrs,
  modelType,
  isAuditing,
  onFileSelect,
  onFileClear,
  onTargetVarChange,
  onToggleSensitiveAttr,
  onModelTypeChange,
  onRunAudit,
  onParseComplete,
  onDatasetStats,
  onError,
}: UploadScreenProps) {
  const [stats, setStats] = useState<DatasetStatsData | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    onFileSelect(selectedFile);
    setStats(null);

    // Parse preview (first 10 rows) for table display
    Papa.parse(selectedFile, {
      header: true,
      preview: 10,
      complete: (results) => {
        if (results.errors.length > 0) {
          const firstError = results.errors[0];
          onError(`CSV parse error: ${firstError.message} (row ${firstError.row ?? 'unknown'})`);
        }
        onParseComplete(
          results.data as Record<string, any>[],
          results.meta.fields || [],
        );
      },
      error: (err: Error) => {
        onError(`Failed to read CSV file: ${err.message}`);
        handleClear();
      },
    });

    // Full parse for statistics (no preview limit)
    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        const allData = results.data as Record<string, any>[];
        const allHeaders = results.meta.fields || [];
        const computed = computeDatasetStats(allData, allHeaders);
        setStats(computed);
        onDatasetStats(computed);
      },
      error: () => {
        // Silent — preview parse already handles error reporting
      },
    });
  };

  const handleClear = () => {
    setStats(null);
    onFileClear();
  };

  const canRunAudit = !!file && !!targetVar && sensitiveAttrs.length > 0;

  return (
    <motion.div
      key="upload"
      {...screenTransition}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-5 space-y-6">
        <Card className="p-6 dark:bg-zinc-800 dark:border-zinc-700">
          <h2 className="text-xl font-bold mb-6 dark:text-zinc-100">Audit Configuration</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Upload Dataset (CSV)
              </label>
              <FileUploader
                file={file}
                onFileSelect={handleFileSelect}
                onFileClear={handleClear}
                onError={onError}
              />
            </div>

            {/* Dataset Statistics */}
            {stats && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Dataset Overview
                </label>
                <DatasetStats stats={stats} />
              </div>
            )}

            <AuditConfigForm
              headers={headers}
              targetVar={targetVar}
              onTargetVarChange={onTargetVarChange}
              sensitiveAttrs={sensitiveAttrs}
              onToggleSensitiveAttr={onToggleSensitiveAttr}
              modelType={modelType}
              onModelTypeChange={onModelTypeChange}
              isAuditing={isAuditing}
              canRunAudit={canRunAudit}
              onRunAudit={onRunAudit}
              hasFile={!!file}
            />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-7">
        <Card className="h-full dark:bg-zinc-800 dark:border-zinc-700">
          <DataPreview headers={headers} data={data} />
        </Card>
      </div>
    </motion.div>
  );
}
