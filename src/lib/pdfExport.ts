import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AuditResults } from '../services/geminiService';

export function exportAuditPDF(
  auditResults: AuditResults,
  fileName: string,
  modelType: string,
  sensitiveAttrs: string[],
): void {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(24, 24, 27);
  doc.text('JEDI Ethical Audit Report', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(113, 113, 122);
  doc.text(`Generated on: ${timestamp}`, 14, 30);
  doc.text(`Dataset: ${fileName}`, 14, 35);
  doc.text(`Model Type: ${modelType}`, 14, 40);

  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(24, 24, 27);
  doc.text('1. Executive Summary', 14, 55);

  doc.setFontSize(12);
  doc.text(`Overall Status: ${auditResults.overallStatus}`, 14, 65);
  doc.text(`Total Compliance Score: ${auditResults.totalScore}/100`, 14, 72);

  // Fairness Metrics Table
  doc.setFontSize(16);
  doc.text('2. Fairness Metrics', 14, 85);

  const metricsData = [
    ['Metric', 'Score', 'Value', 'Status', 'Description'],
    [
      'Demographic Parity',
      `${auditResults.fairnessMetrics.demographicParity.score}/35`,
      `${(auditResults.fairnessMetrics.demographicParity.value * 100).toFixed(1)}%`,
      auditResults.fairnessMetrics.demographicParity.status.toUpperCase(),
      auditResults.fairnessMetrics.demographicParity.description,
    ],
    [
      'Equal Opportunity',
      `${auditResults.fairnessMetrics.equalOpportunity.score}/20`,
      `${(auditResults.fairnessMetrics.equalOpportunity.value * 100).toFixed(1)}%`,
      auditResults.fairnessMetrics.equalOpportunity.status.toUpperCase(),
      auditResults.fairnessMetrics.equalOpportunity.description,
    ],
    [
      'Calibration',
      `${auditResults.fairnessMetrics.calibration.score}/15`,
      `${(auditResults.fairnessMetrics.calibration.value * 100).toFixed(1)}%`,
      auditResults.fairnessMetrics.calibration.status.toUpperCase(),
      auditResults.fairnessMetrics.calibration.description,
    ],
    [
      'Model Accuracy',
      `${auditResults.fairnessMetrics.accuracy.score}/20`,
      `${(auditResults.fairnessMetrics.accuracy.value * 100).toFixed(1)}%`,
      auditResults.fairnessMetrics.accuracy.status.toUpperCase(),
      auditResults.fairnessMetrics.accuracy.description,
    ],
    [
      'Explainability',
      `${auditResults.fairnessMetrics.explainability.score}/10`,
      `${(auditResults.fairnessMetrics.explainability.value * 100).toFixed(1)}%`,
      auditResults.fairnessMetrics.explainability.status.toUpperCase(),
      auditResults.fairnessMetrics.explainability.description,
    ],
  ];

  autoTable(doc, {
    startY: 90,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [24, 24, 27] },
    styles: { fontSize: 9 },
  });

  // Feature Importance
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(16);
  doc.text('3. Feature Importance', 14, finalY + 15);

  const featureData = auditResults.featureImportance.map((f) => [
    f.name,
    (f.importance * 100).toFixed(1) + '%',
    sensitiveAttrs.includes(f.name) ? 'YES' : 'NO',
  ]);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Feature Name', 'Importance', 'Sensitive Attribute']],
    body: featureData,
    theme: 'grid',
    headStyles: { fillColor: [24, 24, 27] },
    styles: { fontSize: 9 },
  });

  // Bias Patterns & Recommendations
  const finalY2 = (doc as any).lastAutoTable.finalY || 220;

  if (finalY2 > 240) doc.addPage();
  const currentY = finalY2 > 240 ? 20 : finalY2 + 15;

  doc.setFontSize(16);
  doc.text('4. Bias Detection & Recommendations', 14, currentY);

  doc.setFontSize(11);
  doc.setTextColor(239, 68, 68);
  doc.text('Detected Patterns:', 14, currentY + 10);
  doc.setTextColor(63, 63, 70);
  auditResults.biasDetection.patterns.forEach((p, i) => {
    doc.text(`• ${p}`, 18, currentY + 18 + i * 7);
  });

  const recY =
    currentY + 18 + auditResults.biasDetection.patterns.length * 7 + 10;
  doc.setTextColor(16, 185, 129);
  doc.text('Recommendations:', 14, recY);
  doc.setTextColor(63, 63, 70);
  auditResults.biasDetection.recommendations.forEach((r, i) => {
    doc.text(`• ${r}`, 18, recY + 8 + i * 7);
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text('JEDI Compliance System - Proprietary and Confidential', 14, 285);
    doc.text(`Page ${i} of ${pageCount}`, 180, 285);
  }

  doc.save(`JEDI_Audit_Report_${fileName.split('.')[0] || 'Report'}.pdf`);
}
