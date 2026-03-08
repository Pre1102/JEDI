import React from 'react';
import { ChevronRight, Scale, Cpu, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Button, Card, Badge } from './UI';

interface LandingScreenProps {
  onStartAudit: () => void;
}

const screenTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export function LandingScreen({ onStartAudit }: LandingScreenProps) {
  return (
    <motion.div
      key="landing"
      {...screenTransition}
      className="max-w-4xl mx-auto text-center space-y-8"
    >
      <div className="space-y-4">
        <Badge variant="neutral">AI Ethical Auditing Framework</Badge>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          JEDI Code <br />
          <span className="text-zinc-400 dark:text-zinc-500 italic">Compliance System</span>
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Evaluate machine learning models for fairness, transparency, and reliability.
          Standardized ethical metrics for hiring, healthcare, and criminal justice.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button className="h-12 px-8 text-lg" onClick={onStartAudit}>
          Start Audit
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
        {[
          { icon: Scale, title: 'Bias Detection', desc: 'Identify demographic disparities in model outcomes.' },
          { icon: Cpu, title: 'Explainable AI', desc: 'Understand feature influence with SHAP values.' },
          { icon: FileText, title: 'Compliance Reports', desc: 'Generate detailed PDF/JSON audit summaries.' },
        ].map((feature, i) => (
          <Card key={i} className="text-left p-6 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
            <feature.icon className="w-8 h-8 mb-4 text-zinc-900 dark:text-zinc-100" />
            <h3 className="font-bold text-lg mb-2 dark:text-zinc-100">{feature.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{feature.desc}</p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
