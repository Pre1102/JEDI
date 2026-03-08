/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  ArrowLeft,
  Loader2,
  Info,
  Download,
  ExternalLink,
  Cpu,
  Scale
} from 'lucide-react';
import Papa from 'papaparse';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button, Card, CardContent, CardHeader, Badge } from './components/UI';
import { performEthicalAudit, AuditResults } from './services/geminiService';
import { cn } from './lib/utils';

type Screen = 'landing' | 'upload' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [targetVar, setTargetVar] = useState('');
  const [sensitiveAttrs, setSensitiveAttrs] = useState<string[]>([]);
  const [modelType, setModelType] = useState('Random Forest');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const container = document.querySelector('.h-[300px]');
    if (container) {
      console.log('ResponsiveContainer dimensions:', {
        width: container.clientWidth,
        height: container.clientHeight,
      });
    } else {
      console.log('ResponsiveContainer parent container not found.');
    }
  }, []);

  const handleExportPDF = () => {
    if (!auditResults) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(24, 24, 27); // zinc-900
    doc.text('JEDI Ethical Audit Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(113, 113, 122); // zinc-500
    doc.text(`Generated on: ${timestamp}`, 14, 30);
    doc.text(`Dataset: ${file?.name || 'Unknown'}`, 14, 35);
    doc.text(`Model Type: ${modelType}`, 14, 40);

    // Summary Section
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
      ['Demographic Parity', `${auditResults.fairnessMetrics.demographicParity.score}/35`, `${(auditResults.fairnessMetrics.demographicParity.value * 100).toFixed(1)}%`, auditResults.fairnessMetrics.demographicParity.status.toUpperCase(), auditResults.fairnessMetrics.demographicParity.description],
      ['Equal Opportunity', `${auditResults.fairnessMetrics.equalOpportunity.score}/20`, `${(auditResults.fairnessMetrics.equalOpportunity.value * 100).toFixed(1)}%`, auditResults.fairnessMetrics.equalOpportunity.status.toUpperCase(), auditResults.fairnessMetrics.equalOpportunity.description],
      ['Calibration', `${auditResults.fairnessMetrics.calibration.score}/15`, `${(auditResults.fairnessMetrics.calibration.value * 100).toFixed(1)}%`, auditResults.fairnessMetrics.calibration.status.toUpperCase(), auditResults.fairnessMetrics.calibration.description],
      ['Model Accuracy', `${auditResults.fairnessMetrics.accuracy.score}/20`, `${(auditResults.fairnessMetrics.accuracy.value * 100).toFixed(1)}%`, auditResults.fairnessMetrics.accuracy.status.toUpperCase(), auditResults.fairnessMetrics.accuracy.description],
      ['Explainability', `${auditResults.fairnessMetrics.explainability.score}/10`, `${(auditResults.fairnessMetrics.explainability.value * 100).toFixed(1)}%`, auditResults.fairnessMetrics.explainability.status.toUpperCase(), auditResults.fairnessMetrics.explainability.description],
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
    
    const featureData = auditResults.featureImportance.map(f => [
      f.name, 
      (f.importance * 100).toFixed(1) + '%',
      sensitiveAttrs.includes(f.name) ? 'YES' : 'NO'
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
    doc.setTextColor(239, 68, 68); // red-500
    doc.text('Detected Patterns:', 14, currentY + 10);
    doc.setTextColor(63, 63, 70); // zinc-700
    auditResults.biasDetection.patterns.forEach((p, i) => {
      doc.text(`• ${p}`, 18, currentY + 18 + (i * 7));
    });

    const recY = currentY + 18 + (auditResults.biasDetection.patterns.length * 7) + 10;
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('Recommendations:', 14, recY);
    doc.setTextColor(63, 63, 70);
    auditResults.biasDetection.recommendations.forEach((r, i) => {
      doc.text(`• ${r}`, 18, recY + 8 + (i * 7));
    });

    // Footer on all pages
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170); // zinc-400
      doc.text('JEDI Compliance System - Proprietary and Confidential', 14, 285);
      doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    }

    doc.save(`JEDI_Audit_Report_${file?.name?.split('.')[0] || 'Report'}.pdf`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      Papa.parse(uploadedFile, {
        header: true,
        preview: 10,
        complete: (results) => {
          setData(results.data);
          if (results.meta.fields) {
            setHeaders(results.meta.fields);
          }
        }
      });
    }
  };

  const runAudit = async () => {
    if (!file || !targetVar || sensitiveAttrs.length === 0) return;

    setIsAuditing(true);
    try {
      const previewText = JSON.stringify(data.slice(0, 5));
      const results = await performEthicalAudit(previewText, targetVar, sensitiveAttrs, modelType);
      setAuditResults(results);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleSensitiveAttr = (attr: string) => {
    setSensitiveAttrs(prev => 
      prev.includes(attr) ? prev.filter(a => a !== attr) : [...prev, attr]
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setCurrentScreen('landing')}
            >
              <div className="bg-zinc-900 p-1.5 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">JEDI Compliance</span>
            </div>
            
            {currentScreen !== 'landing' && (
              <Button variant="ghost" onClick={() => setCurrentScreen('landing')}>
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="neutral">AI Ethical Auditing Framework</Badge>
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-900">
                  JEDI Code <br />
                  <span className="text-zinc-400 italic">Compliance System</span>
                </h1>
                <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                  Evaluate machine learning models for fairness, transparency, and reliability. 
                  Standardized ethical metrics for hiring, healthcare, and criminal justice.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button className="h-12 px-8 text-lg" onClick={() => setCurrentScreen('upload')}>
                  Start Audit
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="h-12 px-8 text-lg">
                  View Documentation
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                {[
                  { icon: Scale, title: "Bias Detection", desc: "Identify demographic disparities in model outcomes." },
                  { icon: Cpu, title: "Explainable AI", desc: "Understand feature influence with SHAP values." },
                  { icon: FileText, title: "Compliance Reports", desc: "Generate detailed PDF/JSON audit summaries." }
                ].map((feature, i) => (
                  <Card key={i} className="text-left p-6 hover:border-zinc-300 transition-colors">
                    <feature.icon className="w-8 h-8 mb-4 text-zinc-900" />
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-zinc-500 text-sm">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">Audit Configuration</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Upload Dataset (CSV)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center hover:border-zinc-400 transition-all cursor-pointer bg-zinc-50/50"
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                        <p className="text-sm font-medium text-zinc-600">
                          {file ? file.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">CSV files only, max 10MB</p>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          accept=".csv" 
                          className="hidden" 
                        />
                      </div>
                    </div>

                    {headers.length > 0 && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 mb-2">Target Variable</label>
                          <select 
                            value={targetVar}
                            onChange={(e) => setTargetVar(e.target.value)}
                            className="w-full rounded-lg border-zinc-200 text-sm focus:ring-zinc-500 focus:border-zinc-500"
                          >
                            <option value="">Select target column...</option>
                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-zinc-700 mb-2">Sensitive Attributes</label>
                          <div className="flex flex-wrap gap-2">
                            {headers.map(h => (
                              <button
                                key={h}
                                onClick={() => toggleSensitiveAttr(h)}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                  sensitiveAttrs.includes(h) 
                                    ? "bg-zinc-900 text-white border-zinc-900" 
                                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                                )}
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-zinc-700 mb-2">Model Type</label>
                          <select 
                            value={modelType}
                            onChange={(e) => setModelType(e.target.value)}
                            className="w-full rounded-lg border-zinc-200 text-sm focus:ring-zinc-500 focus:border-zinc-500"
                          >
                            <option>Random Forest</option>
                            <option>Logistic Regression</option>
                            <option>Decision Tree</option>
                            <option>XGBoost</option>
                          </select>
                        </div>
                      </>
                    )}

                    <Button 
                      className="w-full h-12" 
                      disabled={!file || !targetVar || sensitiveAttrs.length === 0 || isAuditing}
                      onClick={runAudit}
                    >
                      {isAuditing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Running Ethical Audit...
                        </>
                      ) : (
                        "Run Ethical Audit"
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-7">
                <Card className="h-full">
                  <CardHeader className="flex justify-between items-center">
                    <h3 className="font-bold">Dataset Preview</h3>
                    {data.length > 0 && <Badge>{data.length} rows loaded</Badge>}
                  </CardHeader>
                  <CardContent className="p-0">
                    {data.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-100">
                            <tr>
                              {headers.map(h => <th key={h} className="px-4 py-3">{h}</th>)}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100">
                            {data.map((row, i) => (
                              <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                                {headers.map(h => <td key={h} className="px-4 py-3 text-zinc-600">{row[h]}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        <FileText className="w-12 h-12 mb-2 opacity-20" />
                        <p>No data uploaded yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {currentScreen === 'dashboard' && auditResults && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Audit Dashboard</h1>
                  <p className="text-zinc-500">Results for {file?.name} • {modelType}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleExportPDF}>
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                  <Button variant="secondary">
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Audit
                  </Button>
                </div>
              </div>

              {/* Scorecard Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: "Demographic Parity", metric: auditResults.fairnessMetrics.demographicParity, max: 35 },
                  { label: "Equal Opportunity", metric: auditResults.fairnessMetrics.equalOpportunity, max: 20 },
                  { label: "Calibration", metric: auditResults.fairnessMetrics.calibration, max: 15 },
                  { label: "Model Accuracy", metric: auditResults.fairnessMetrics.accuracy, max: 20 },
                  { label: "Explainability", metric: auditResults.fairnessMetrics.explainability, max: 10 }
                ].map((m, i) => (
                  <Card key={i} className="p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{m.label}</span>
                      <Badge variant={m.metric.status}>{m.metric.status.toUpperCase()}</Badge>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{m.metric.score}<span className="text-sm text-zinc-300 font-normal">/{m.max}</span></div>
                      <div className="text-[10px] text-zinc-500 mt-1">Value: {(m.metric.value * 100).toFixed(1)}%</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Main Charts Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feature Importance */}
                <Card>
                  <CardHeader>
                    <h3 className="font-bold flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Global Feature Importance
                    </h3>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={auditResults.featureImportance} layout="vertical" margin={{ left: 40, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          fontSize={12}
                          width={100}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f9fafb' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                          {auditResults.featureImportance.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={sensitiveAttrs.includes(entry.name) ? '#ef4444' : '#18181b'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-zinc-900 rounded-sm"></div>
                        <span>Regular Feature</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        <span>Sensitive Attribute</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bias Patterns */}
                <Card>
                  <CardHeader>
                    <h3 className="font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Detected Bias Patterns
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {auditResults.biasDetection.patterns.map((pattern, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-sm text-red-800">{pattern}</p>
                      </div>
                    ))}
                    <div className="pt-4">
                      <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-zinc-400">Recommendations</h4>
                      <ul className="space-y-2">
                        {auditResults.biasDetection.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Scorecard */}
              <Card className="bg-zinc-900 text-white border-none">
                <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Final Evaluation</h3>
                    <div className="flex items-baseline gap-3">
                      <div className="text-5xl font-bold">{auditResults.totalScore}</div>
                      <div className="text-xl text-zinc-500">/ 100</div>
                    </div>
                    <div className="text-2xl font-semibold text-emerald-400">{auditResults.overallStatus}</div>
                    <p className="text-zinc-400 max-w-md">
                      The model has been evaluated against JEDI standards. 
                      {auditResults.totalScore >= 80 
                        ? " All fairness thresholds met." 
                        : " Remediation steps required for full compliance."}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                      "w-24 h-24 rounded-full flex items-center justify-center border-4",
                      auditResults.overallStatus === 'Compliant' ? "border-emerald-500 text-emerald-500" : 
                      auditResults.overallStatus === 'Conditionally Compliant' ? "border-amber-500 text-amber-500" : "border-red-500 text-red-500"
                    )}>
                      {auditResults.overallStatus === 'Compliant' ? <CheckCircle2 className="w-12 h-12" /> : <Info className="w-12 h-12" />}
                    </div>
                    <Button 
                      variant="secondary" 
                      className="bg-white text-zinc-900 hover:bg-zinc-100"
                      onClick={handleExportPDF}
                    >
                      Generate Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">JEDI Compliance System © 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              API Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
