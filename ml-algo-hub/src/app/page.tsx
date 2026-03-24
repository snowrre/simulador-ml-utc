"use client";

import Link from 'next/link';
import { useML } from '@/context/MLContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { resetState } = useML();
  const router = useRouter();

  const handleStartSimulador = () => {
    resetState();
    router.push('/simulador');
  };

  const handleStartDemo = () => {
    resetState();
    router.push('/simulador?demo=true');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-tech-blue/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-tech-blue/10 dark:bg-tech-blue/5"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full blur-[120px] bg-emerald-500/10 dark:bg-emerald/5"></div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center relative px-4 sm:px-6 py-12 md:py-24">
        <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">
          
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tech-blue/10 text-tech-blue text-[10px] font-black uppercase tracking-[0.2em] border border-tech-blue/20">
            <span className="w-2 h-2 rounded-full bg-tech-blue animate-pulse"></span>
            ML Algo Hub v1.0
          </div>
          
          <h1 id="hero-title" className="text-5xl md:text-8xl font-black tracking-tighter text-navy-slate dark:text-white mb-8 pb-2 leading-[0.9] uppercase italic">
            Domina el <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-emerald-400">Machine Learning</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium mb-12 leading-relaxed">
            Una plataforma interactiva para visualizar, experimentar y entender algoritmos de IA. 
            Sube tus datos y mira cómo cobran vida sin tocar una línea de código.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
            <button 
              id="btn-cargar-dataset"
              onClick={handleStartSimulador}
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-navy-slate dark:bg-tech-blue hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-tech-blue/20 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
            >
              Empezar Simulador
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <button 
              id="btn-probar-ejemplo"
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-navy-slate dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs text-center shadow-lg"
            >
              Dataset de Prueba
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial'))}
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-tech-blue/10 border border-tech-blue/20 text-tech-blue hover:bg-tech-blue/20 transition-all font-black uppercase tracking-widest text-xs text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Ver Tutorial
            </button>
          </div>

          {/* 3 Steps Section */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="group p-10 rounded-[3rem] bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-gray-100 dark:border-white/5 hover:border-tech-blue/30 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-tech-blue/10 flex items-center justify-center text-tech-blue mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase mb-3 text-left italic">1. Carga Inteligente</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-left leading-relaxed">Sube CSV o Excel. Detectamos automáticamente tipos de datos y sugerimos el mejor preprocesamiento.</p>
            </div>

            <div className="group p-10 rounded-[3rem] bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-gray-100 dark:border-white/5 hover:border-purple-500/30 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase mb-3 text-left italic">2. Simulación Real</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-left leading-relaxed">Ajusta vecinos (K) o profundidad del árbol y observa cómo cambian los resultados en tiempo real.</p>
            </div>

            <div className="group p-10 rounded-[3rem] bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-gray-100 dark:border-white/5 hover:border-emerald-500/30 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase mb-3 text-left italic">3. Métricas Pro</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-left leading-relaxed">Genera matrices de confusión, curvas ROC y descarga reportes profesionales listos para presentar.</p>
            </div>
          </div>
          
        </div>
      </main>

      <footer className="py-12 border-t border-gray-100 dark:border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          ML Algo Hub &copy; 2026 &bull; Un producto educativo de Tech Hub
        </p>
      </footer>
    </div>
  );
}
