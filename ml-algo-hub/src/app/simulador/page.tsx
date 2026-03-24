"use client";

import React, { useState, useEffect } from 'react';
import { useML } from '@/context/MLContext';
import dynamic from 'next/dynamic';
import DatasetManager from '@/components/simulador/DatasetManager';
import PreprocessingManager from '@/components/simulador/PreprocessingManager';
const KNNManager = dynamic(() => import('@/components/simulador/KNNManager'), { ssr: false });
const DecisionTreeManager = dynamic(() => import('@/components/simulador/DecisionTreeManager'), { ssr: false });
const ComparisonDashboard = dynamic(() => import('@/components/simulador/ComparisonDashboard'), { ssr: false });
const ExperimentsDashboard = dynamic(() => import('@/components/simulador/ExperimentsDashboard'), { ssr: false });

import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Cpu, BarChart3, History, ArrowLeft, LayoutDashboard, HelpCircle } from 'lucide-react';
import Link from 'next/link';

type Step = 'dataset' | 'preprocessing' | 'model' | 'comparison' | 'experiments';

export default function SimulatorPage() {
  const { state, setRawData } = useML();
  const [activeStep, setActiveStep] = useState<Step>('dataset');
  const [modelTab, setModelTab] = useState<'knn' | 'dt'>('knn');

  // Handle demo mode from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true' && !state.rawData) {
      const sampleData = [
        { sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2, species: 'setosa' },
        { sepalLength: 7.0, sepalWidth: 3.2, petalLength: 4.7, petalWidth: 1.4, species: 'versicolor' },
        { sepalLength: 6.3, sepalWidth: 3.3, petalLength: 6.0, petalWidth: 2.5, species: 'virginica' },
        // ... more points would be better but this triggers the UI
      ];
      // Generate 150 points for a real feel
      const fullSample = [];
      const classes = ['setosa', 'versicolor', 'virginica'];
      for(let i=0; i<150; i++) {
        const c = classes[i % 3];
        const base = i % 3 === 0 ? 5 : i % 3 === 1 ? 6 : 7;
        fullSample.push({
          sepalLength: base + Math.random(),
          sepalWidth: 3 + Math.random(),
          petalLength: (i % 3 + 1) * 2 + Math.random(),
          petalWidth: (i % 3 + 1) * 0.5 + Math.random(),
          species: c
        });
      }
      setRawData(fullSample, 'iris_demo.csv');
    }
  }, [state.rawData, setRawData]);

  const steps = [
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'preprocessing', label: 'Limpieza', icon: Zap },
    { id: 'model', label: 'Entrenar', icon: Cpu },
    { id: 'comparison', label: 'Comparar', icon: LayoutDashboard },
    { id: 'experiments', label: 'Historial', icon: History },
  ];

  const renderActiveStep = () => {
    const componentMap: Record<Step, React.ReactNode> = {
      'dataset': <DatasetManager onNext={() => setActiveStep('preprocessing')} />,
      'preprocessing': <PreprocessingManager onNext={() => setActiveStep('model')} />,
      'model': (
        <div className="space-y-8">
          <div className="flex justify-center bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl w-fit mx-auto border border-gray-200 dark:border-white/10">
            <button 
              onClick={() => setModelTab('knn')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${modelTab === 'knn' ? 'bg-tech-blue text-white shadow-lg' : 'text-gray-500 hover:text-navy-slate dark:hover:text-white'}`}
            >
              K-Nearest Neighbors
            </button>
            <button 
              onClick={() => setModelTab('dt')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${modelTab === 'dt' ? 'bg-emerald text-white shadow-lg' : 'text-gray-500 hover:text-navy-slate dark:hover:text-white'}`}
            >
              Decision Tree
            </button>
          </div>
          {modelTab === 'knn' ? <KNNManager /> : <DecisionTreeManager />}
        </div>
      ),
      'comparison': <ComparisonDashboard />,
      'experiments': <ExperimentsDashboard />,
    };

    return (
      <div data-current-step={activeStep}>
        {componentMap[activeStep] || null}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-tech-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-tech-blue/20 group-hover:rotate-12 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black text-navy-slate dark:text-white uppercase tracking-tighter italic">ML Algo Hub</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Simulador Pro</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id as Step)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive ? 'bg-white dark:bg-white/10 text-tech-blue shadow-sm' : 'text-gray-500 hover:text-navy-slate dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-tech-blue' : ''}`} />
                  {s.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-navy-slate dark:hover:text-white transition-colors">
              <LayoutDashboard className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep + (activeStep === 'model' ? modelTab : '')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Helper (Mobile) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 shadow-2xl rounded-full border border-gray-100 dark:border-white/10 p-2 flex gap-1 z-50">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id as Step)}
              className={`p-3 rounded-full transition-all ${isActive ? 'bg-tech-blue text-white' : 'text-gray-400'}`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
