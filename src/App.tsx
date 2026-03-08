/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { ToastContainer } from './components/Toast';
import { Sidebar, SidebarRoute } from './components/Sidebar';
import { LandingScreen } from './components/LandingScreen';
import { UploadScreen } from './components/UploadScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { ComplianceReportScreen } from './components/ComplianceReportScreen';
import { useToast } from './hooks/useToast';
import { performEthicalAudit, AuditResults } from './services/geminiService';
import { exportAuditPDF } from './lib/pdfExport';
import { exportAuditJSON } from './lib/jsonExport';
import { cn } from './lib/utils';
import type { DatasetStatsData } from './components/DatasetStats';

// ── Hash-based routing ─────────────────────────────────────────────────

type Screen = 'landing' | 'upload' | 'dashboard' | 'analysis' | 'report';

const HASH_MAP: Record<string, Screen> = {
  '': 'landing',
  '#': 'landing',
  '#/': 'landing',
  '#/upload': 'upload',
  '#/dashboard': 'dashboard',
  '#/analysis': 'analysis',
  '#/report': 'report',
};

const PROTECTED_SCREENS: Screen[] = ['dashboard', 'analysis', 'report'];

function getScreenFromHash(): Screen {
  return HASH_MAP[window.location.hash] || 'landing';
}

function setHash(screen: Screen) {
  const map: Record<Screen, string> = {
    landing: '#/',
    upload: '#/upload',
    dashboard: '#/dashboard',
    analysis: '#/analysis',
    report: '#/report',
  };
  window.location.hash = map[screen];
}

// ── App ────────────────────────────────────────────────────────────────

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(getScreenFromHash);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [targetVar, setTargetVar] = useState('');
  const [sensitiveAttrs, setSensitiveAttrs] = useState<string[]>([]);
  const [modelType, setModelType] = useState('Random Forest');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);
  const [datasetStats, setDatasetStats] = useState<DatasetStatsData | null>(null);

  const toast = useToast();
  const mainRef = useRef<HTMLElement>(null);

  // Sidebar is shown on all screens except landing
  const showSidebar = currentScreen !== 'landing';

  // Sync hash → state
  useEffect(() => {
    const onHashChange = () => {
      const screen = getScreenFromHash();
      // Don't allow navigating to protected screens without results
      if (PROTECTED_SCREENS.includes(screen) && !auditResults) {
        setHash('upload');
        setCurrentScreen('upload');
      } else {
        setCurrentScreen(screen);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [auditResults]);

  // Navigate helper: sets both hash and state
  const navigate = useCallback((screen: Screen) => {
    setHash(screen);
    setCurrentScreen(screen);
  }, []);

  // Sidebar navigation handler
  const handleSidebarNavigate = useCallback(
    (route: SidebarRoute) => {
      if (route === 'home') {
        navigate('landing');
      } else {
        navigate(route as Screen);
      }
    },
    [navigate],
  );

  // Focus management on screen transitions
  useEffect(() => {
    mainRef.current?.focus();
  }, [currentScreen]);

  // ── Handlers ───────────────────────────────────────────────────────

  const handleFileClear = () => {
    setFile(null);
    setData([]);
    setHeaders([]);
    setTargetVar('');
    setSensitiveAttrs([]);
    setDatasetStats(null);
  };

  const handleParseComplete = (parsedData: Record<string, any>[], parsedHeaders: string[]) => {
    setData(parsedData);
    setHeaders(parsedHeaders);
  };

  const toggleSensitiveAttr = (attr: string) => {
    setSensitiveAttrs((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr],
    );
  };

  const runAudit = async () => {
    if (!file || !targetVar || sensitiveAttrs.length === 0) return;

    setIsAuditing(true);
    try {
      const previewText = JSON.stringify(data.slice(0, 5));
      const results = await performEthicalAudit(previewText, targetVar, sensitiveAttrs, modelType);
      setAuditResults(results);
      navigate('dashboard');
      toast.success('Audit Complete', 'Ethical audit finished successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Audit Failed', message);
      console.error('[JEDI] Audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleExportPDF = () => {
    if (!auditResults) return;
    try {
      exportAuditPDF(auditResults, file?.name || 'Unknown', modelType, sensitiveAttrs);
      toast.success('PDF Exported', 'Audit report saved as PDF.');
    } catch (error) {
      toast.error('Export Failed', 'Could not generate PDF report.');
    }
  };

  const handleExportJSON = () => {
    if (!auditResults) return;
    try {
      exportAuditJSON(auditResults, file?.name || 'Unknown', modelType);
      toast.success('JSON Exported', 'Audit report saved as JSON.');
    } catch (error) {
      toast.error('Export Failed', 'Could not generate JSON report.');
    }
  };

  const handleNewAudit = () => {
    navigate('upload');
  };

  // ── Render ─────────────────────────────────────────────────────────

  // Landing screen — full width, no sidebar
  if (currentScreen === 'landing') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-700">
        <main
          ref={mainRef}
          tabIndex={-1}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 outline-none"
        >
          <AnimatePresence mode="wait">
            <LandingScreen onStartAudit={() => navigate('upload')} />
          </AnimatePresence>
        </main>
        <ToastContainer toasts={toast.toasts} onDismiss={toast.removeToast} />
      </div>
    );
  }

  // All other screens — sidebar layout
  const sidebarRoute = currentScreen as SidebarRoute;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-700">
      {/* Sidebar */}
      <Sidebar
        activeRoute={sidebarRoute}
        hasAuditResults={!!auditResults}
        onNavigate={handleSidebarNavigate}
      />

      {/* Main content area — offset by sidebar width */}
      <div className="sidebar-content transition-all duration-300 ease-in-out">
        <main
          ref={mainRef}
          tabIndex={-1}
          className="max-w-7xl mx-auto px-6 lg:px-8 py-8 outline-none"
        >
          <AnimatePresence mode="wait">
            {currentScreen === 'upload' && (
              <UploadScreen
                file={file}
                data={data}
                headers={headers}
                targetVar={targetVar}
                sensitiveAttrs={sensitiveAttrs}
                modelType={modelType}
                isAuditing={isAuditing}
                onFileSelect={setFile}
                onFileClear={handleFileClear}
                onTargetVarChange={setTargetVar}
                onToggleSensitiveAttr={toggleSensitiveAttr}
                onModelTypeChange={setModelType}
                onRunAudit={runAudit}
                onParseComplete={handleParseComplete}
                onDatasetStats={setDatasetStats}
                onError={(msg) => toast.error('Error', msg)}
              />
            )}

            {currentScreen === 'dashboard' && auditResults && (
              <DashboardScreen
                auditResults={auditResults}
                fileName={file?.name || 'Unknown'}
                modelType={modelType}
                sensitiveAttrs={sensitiveAttrs}
                onExportPDF={handleExportPDF}
                onExportJSON={handleExportJSON}
                onNewAudit={handleNewAudit}
                onViewReport={() => navigate('report')}
                onViewAnalysis={() => navigate('analysis')}
              />
            )}

            {currentScreen === 'analysis' && auditResults && (
              <AnalysisScreen
                auditResults={auditResults}
                fileName={file?.name || 'Unknown'}
                sensitiveAttrs={sensitiveAttrs}
                datasetStats={datasetStats}
              />
            )}

            {currentScreen === 'report' && auditResults && (
              <ComplianceReportScreen
                auditResults={auditResults}
                fileName={file?.name || 'Unknown'}
                modelType={modelType}
                sensitiveAttrs={sensitiveAttrs}
                onExportPDF={handleExportPDF}
                onExportJSON={handleExportJSON}
                onBackToDashboard={() => navigate('dashboard')}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.removeToast} />
    </div>
  );
}
