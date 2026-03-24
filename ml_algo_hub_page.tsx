import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-tech-blue/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-tech-blue/10 dark:bg-tech-blue/5"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full blur-[120px] bg-emerald-500/10 dark:bg-emerald/5"></div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center relative px-4 sm:px-6 py-12">
        <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">
          
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-blue/10 text-tech-blue text-xs font-black uppercase tracking-widest border border-tech-blue/20">
            <span className="w-2 h-2 rounded-full bg-tech-blue animate-pulse"></span>
            Simulador de Algoritmos v1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-navy-slate dark:text-white mb-8 pb-2 leading-tight">
            Descubre el Poder del <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-emerald-400 italic pr-2">Machine Learning</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium mb-12">
            Aprende, experimenta y visualiza cómo los algoritmos toman decisiones. 
            Sube tus propios datos y pon a prueba los modelos <strong className="text-navy-slate dark:text-gray-200">K-Nearest Neighbors</strong> y <strong className="text-navy-slate dark:text-gray-200">Árboles de Decisión</strong> sin escribir una sola línea de código.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
            <Link href="/simulador" className="w-full sm:w-auto px-8 py-4 rounded-full bg-tech-blue hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-tech-blue/20 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 group">
              Cargar Dataset
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
            <Link href="/simulador?demo=true" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-navy-slate dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all font-black uppercase tracking-widest text-sm text-center">
              Probar Dataset Demo
            </Link>
          </div>

          {/* 3 Steps Section */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-8 rounded-[2rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-tech-blue/10 flex items-center justify-center text-tech-blue mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <h3 className="text-lg font-black text-navy-slate dark:text-white uppercase mb-2 text-left">1. Carga tus Datos</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-left">Sube cualquier archivo CSV o Excel. El sistema limpiará y preparará los datos por ti automáticamente.</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-lg font-black text-navy-slate dark:text-white uppercase mb-2 text-left">2. Construye el Modelo</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-left">Ajusta híper-parámetros como K en Vecinos Cercanos o la profundidad del Árbol de Decisión.</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-lg font-black text-navy-slate dark:text-white uppercase mb-2 text-left">3. Analiza Resultados</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-left">Explora fronteras de decisión, matrices de confusión y descarga reportes detallados en PDF.</p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
