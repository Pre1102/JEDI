import type { AuditResults } from '../services/geminiService';

export function exportAuditJSON(
  auditResults: AuditResults,
  fileName: string,
  modelType: string,
): void {
  const report = {
    meta: {
      generator: 'JEDI Compliance System',
      generatedAt: new Date().toISOString(),
      dataset: fileName,
      modelType,
    },
    results: auditResults,
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `JEDI_Audit_Report_${fileName.split('.')[0] || 'Report'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
