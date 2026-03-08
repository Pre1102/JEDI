import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './UI';
import { cn } from '../lib/utils';

interface AuditConfigFormProps {
  headers: string[];
  targetVar: string;
  onTargetVarChange: (value: string) => void;
  sensitiveAttrs: string[];
  onToggleSensitiveAttr: (attr: string) => void;
  modelType: string;
  onModelTypeChange: (value: string) => void;
  isAuditing: boolean;
  canRunAudit: boolean;
  onRunAudit: () => void;
  hasFile: boolean;
}

export function AuditConfigForm({
  headers,
  targetVar,
  onTargetVarChange,
  sensitiveAttrs,
  onToggleSensitiveAttr,
  modelType,
  onModelTypeChange,
  isAuditing,
  canRunAudit,
  onRunAudit,
  hasFile,
}: AuditConfigFormProps) {
  if (headers.length === 0) return null;

  const getMissingHint = (): string | null => {
    const missing: string[] = [];
    if (!hasFile) missing.push('a dataset');
    if (!targetVar) missing.push('a target variable');
    if (sensitiveAttrs.length === 0) missing.push('at least one sensitive attribute');
    if (missing.length === 0) return null;
    return `Select ${missing.join(', ')} to run the audit.`;
  };

  const hint = getMissingHint();

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="target-variable"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Target Variable
        </label>
        <select
          id="target-variable"
          value={targetVar}
          onChange={(e) => onTargetVarChange(e.target.value)}
          className="w-full rounded-lg border-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 text-sm focus:ring-zinc-500 focus:border-zinc-500"
        >
          <option value="">Select target column...</option>
          {headers.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Sensitive Attributes
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sensitive attribute selection">
          {headers.map((h) => (
            <button
              key={h}
              onClick={() => onToggleSensitiveAttr(h)}
              aria-pressed={sensitiveAttrs.includes(h)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium border transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
                sensitiveAttrs.includes(h)
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600 dark:hover:border-zinc-400',
              )}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="model-type"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Model Type
        </label>
        <select
          id="model-type"
          value={modelType}
          onChange={(e) => onModelTypeChange(e.target.value)}
          className="w-full rounded-lg border-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 text-sm focus:ring-zinc-500 focus:border-zinc-500"
        >
          <option>Random Forest</option>
          <option>Logistic Regression</option>
          <option>Decision Tree</option>
          <option>XGBoost</option>
        </select>
      </div>

      <div>
        <Button
          className="w-full h-12"
          disabled={!canRunAudit || isAuditing}
          onClick={onRunAudit}
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Ethical Audit...
            </>
          ) : (
            'Run Ethical Audit'
          )}
        </Button>
        {hint && !isAuditing && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">{hint}</p>
        )}
      </div>
    </div>
  );
}
