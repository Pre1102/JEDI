import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './UI';
import type { BiasDetection as BiasDetectionData } from '../services/geminiService';

interface BiasPatternsProps {
  biasDetection: BiasDetectionData;
}

export function BiasPatterns({ biasDetection }: BiasPatternsProps) {
  return (
    <Card className="dark:bg-zinc-800 dark:border-zinc-700">
      <CardHeader>
        <h3 className="font-bold flex items-center gap-2 dark:text-zinc-100">
          <AlertCircle className="w-4 h-4" />
          Detected Bias Patterns
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {biasDetection.patterns.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              No bias patterns detected. The model appears to treat all demographic groups equitably.
            </p>
          </div>
        ) : (
          biasDetection.patterns.map((pattern, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-800"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-200">{pattern}</p>
            </div>
          ))
        )}

        {biasDetection.recommendations.length > 0 && (
          <div className="pt-4">
            <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Recommendations
            </h4>
            <ul className="space-y-2">
              {biasDetection.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
