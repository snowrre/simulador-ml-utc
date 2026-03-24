"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TutorialStep {
    targetId: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const steps: TutorialStep[] = [
    {
        targetId: 'hero-title',
        title: '¡Bienvenido al Simulador ML!',
        content: 'Aquí aprenderás cómo la Inteligencia Artificial toma decisiones. Sin código, solo con lógica y datos.',
        position: 'bottom'
    },
    {
        targetId: 'btn-probar-ejemplo',
        title: 'Prueba un Ejemplo',
        content: 'Haz clic aquí para cargar datos de prueba (como el dataset de flores Iris) y ver el flujo completo al instante.',
        position: 'top'
    },
    {
        targetId: 'btn-cargar-dataset',
        title: 'Sube tus Propios Datos',
        content: 'Utiliza esta opción si ya tienes tu propio archivo CSV o Excel (.xlsx) listo para ser analizado por la IA.',
        position: 'top'
    }
];

// Pasos adicionales que se activarán según la página
const internalSteps: Record<string, TutorialStep[]> = {
    '/simulador/dataset': [
        {
            targetId: 'dataset-upload-zone',
            title: '1. Carga de Datos',
            content: 'Arrastra tu archivo CSV o Excel aquí. Es la "materia prima" que la IA usará para aprender patrones.',
            position: 'bottom'
        },
        {
            targetId: 'btn-select-file',
            title: '2. Selección de Archivo',
            content: 'Si prefieres no arrastrar, haz clic aquí para buscar tu archivo en tu computadora. Aceptamos CSV y Excel (.xlsx).',
            position: 'top'
        }
    ],
    '/simulador/dataset/loaded': [
        {
            targetId: 'dataset-health-report-card',
            title: '1. Análisis de Calidad',
            content: 'Aquí puedes ver un resumen rápido de tus datos. Si hay valores nulos o columnas inútiles, el sistema te avisará aquí mismo.',
            position: 'right'
        },
        {
            targetId: 'variable-config-section',
            title: '2. Configura tu Objetivo',
            content: 'Define qué quieres predecir (Target Y) y qué datos influyen en eso (Features X). ¡Sin esto, la IA no sabrá qué buscar!',
            position: 'top'
        }
    ],
    '/simulador/preprocesamiento': [
        {
            targetId: 'preprocessing-strategy',
            title: '1. Limpieza de Datos',
            content: '¿Faltan datos en algunas filas? Aquí decides si borrarlas o rellenarlas con el promedio (Media) para no perder información.',
            position: 'right'
        },
        {
            targetId: 'scaling-section',
            title: '2. Escalado (Normalización)',
            content: 'Ajusta todos los números a una misma escala (ej. 0 a 1). Vital para algoritmos como KNN, para que una variable grande no "aplaste" a las pequeñas.',
            position: 'top'
        },
        {
            targetId: 'encoding-section',
            title: '3. Codificación (One-Hot)',
            content: 'La IA solo entiende números. Si tienes categorías (como "Rojo" o "Azul"), esto las convierte en códigos numéricos para que el modelo pueda procesarlas.',
            position: 'bottom'
        },
        {
            targetId: 'train-test-split-section',
            title: '4. División de Entrenamiento',
            content: 'Separamos los datos en dos: unos para que la IA estudie (Entrenamiento) y otros para "ponerle un examen" y ver si realmente aprendió (Prueba).',
            position: 'top'
        }
    ],
    '/simulador/modelo/knn': [
        {
            targetId: 'knn-params-card',
            title: 'Cerebro KNN (Vecinos)',
            content: 'Ajusta los parámetros específicos de KNN. El número de "vecinos" (K) determina qué tan sensible es el modelo a casos aislados basándose en la proximidad.',
            position: 'right'
        },
        {
            targetId: 'btn-train-model',
            title: '¡A Entrenar KNN!',
            content: 'Presiona este botón para que la IA busque los vecinos más cercanos en tus datos y genere predicciones.',
            position: 'top'
        }
    ],
    '/simulador/modelo/dt': [
        {
            targetId: 'dt-params-card',
            title: 'Estructura del Árbol',
            content: 'Define la profundidad del árbol. Un árbol muy profundo puede "memorizar" demasiado (overfitting) y fallar con datos nuevos.',
            position: 'right'
        },
        {
            targetId: 'btn-train-model',
            title: '¡Entrenar Árbol!',
            content: 'La IA creará una serie de preguntas lógicas (nodos) para clasificar tus datos automáticamente.',
            position: 'top'
        }
    ],
    '/simulador/modelo/rf': [
        {
            targetId: 'rf-params-card',
            title: 'Poder del Bosque',
            content: 'El Bosque Aleatorio combina las decisiones de muchos árboles para ser más preciso y estable. ¡Es como una votación democrática de IAs!',
            position: 'right'
        },
        {
            targetId: 'btn-train-model',
            title: '¡Entrenar Bosque!',
            content: 'Inicia el entrenamiento simultáneo de múltiples árboles para obtener el resultado más robusto.',
            position: 'top'
        }
    ],
    '/simulador/experimentos': [
        {
            targetId: 'experiments-list-section',
            title: 'Historial de Éxito',
            content: 'Aquí verás todos tus modelos entrenados. Compara sus métricas (Accuracy) para decidir cuál es el mejor "cerebro" para tus datos.',
            position: 'center'
        }
    ],
    '/simulador/comparativa': [
        {
            targetId: 'comparison-recommendation-box',
            title: 'Recomendación de la IA',
            content: 'Basándonos en la precisión y estabilidad, el sistema te sugiere cuál de los modelos entrenados es el más confiable para tus datos.',
            position: 'bottom'
        },
        {
            targetId: 'btn-export-comparative-pdf',
            title: 'Reporte Comparativo',
            content: 'Genera un documento PDF profesional que compara todos tus experimentos lado a lado. Ideal para presentaciones o entregas.',
            position: 'top'
        }
    ]
};

import { usePathname } from 'next/navigation';

export default function TutorialWizard() {
    const pathname = usePathname();
    const [active, setActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const currentSteps = activeKey ? (internalSteps[activeKey] || []) : ((pathname === '/simulador' || pathname === '/') ? steps : (internalSteps[pathname] || []));

    useEffect(() => {
        // Auto-iniciar en la landing page principal (/) o /simulador
        const isTargetPage = pathname === '/' || pathname === '/simulador';
        if (!isTargetPage) return;

        const hasSeenTutorial = localStorage.getItem('hasSeenMLTutorial');
        if (!hasSeenTutorial) {
            const timer = setTimeout(() => {
                startTutorial();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [pathname]); // Se dispara al entrar a las páginas principales

    const startTutorial = (customKey?: string) => {
        setActive(true);
        setCurrentStep(0);
        setActiveKey(customKey || null);
        localStorage.setItem('hasSeenMLTutorial', 'true');
    };

    useEffect(() => {
        const handleStartTutorial = (e: any) => startTutorial(e.detail);
        window.addEventListener('start-ml-tutorial', handleStartTutorial);
        return () => window.removeEventListener('start-ml-tutorial', handleStartTutorial);
    }, []);

    useEffect(() => {
        if (!active) return;

        const updateCoords = () => {
            const step = currentSteps[currentStep];
            if (!step) return;
            const element = document.getElementById(step.targetId);
            
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;
            const innerWidth = window.innerWidth || document.documentElement.clientWidth;
            const innerHeight = window.innerHeight || document.documentElement.clientHeight;

            if (element) {
                const rect = element.getBoundingClientRect();
                setCoords({
                    top: rect.top + scrollY,
                    left: rect.left + scrollX,
                    width: rect.width || 0,
                    height: rect.height || 0
                });
            } else {
                setCoords({ 
                    top: (innerHeight / 2) + scrollY, 
                    left: (innerWidth / 2) + scrollX, 
                    width: 0, 
                    height: 0 
                });
            }
        };

        // Ejecutar inmediatamente y tras un breve delay para asegurar que el DOM se ha actualizado
        updateCoords();
        const timer = setTimeout(updateCoords, 150);
        
        window.addEventListener('resize', updateCoords);
        window.addEventListener('scroll', updateCoords);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords);
        };
    }, [active, currentStep, currentSteps.length]);

    // Hook separado para auto-scroll inicial de cada paso
    useEffect(() => {
        if (!active) return;
        const step = currentSteps[currentStep];
        if (!step) return;
        const element = document.getElementById(step.targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [active, currentStep]); 

    const handleNext = () => {
        if (currentStep < currentSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setActive(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    if (!active || currentSteps.length === 0) return null;

    const step = currentSteps[currentStep];
    if (!step) return null;

    const spotlightX = Number((coords.width > 0 ? coords.left - 10 : (typeof window !== 'undefined' ? window.innerWidth / 2 : 500)) || 0);
    const spotlightY = Number((coords.height > 0 ? coords.top - 10 : (typeof window !== 'undefined' ? (window.innerHeight / 2) + window.scrollY : 400)) || 0);
    const spotlightW = Number((coords.width > 0 ? coords.width + 20 : 0) || 0);
    const spotlightH = Number((coords.height > 0 ? coords.height + 20 : 0) || 0);

    return (
        <div 
            className="absolute top-0 left-0 w-full z-[200] pointer-events-none"
            style={{ height: active ? Math.max(document.documentElement.scrollHeight, window.innerHeight) : 0 }}
        >
            <svg className="absolute inset-0 w-full h-full pointer-events-auto">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <motion.rect
                            animate={{
                                x: spotlightX,
                                y: spotlightY,
                                width: spotlightW,
                                height: spotlightH,
                                opacity: coords.width > 0 ? 1 : 0
                            }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            rx="16"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.7)"
                    mask="url(#spotlight-mask)"
                    onClick={() => setActive(false)}
                />
            </svg>

            <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    top: step.position === 'bottom' ? spotlightY + spotlightH + 20 : 
                         step.position === 'top' ? spotlightY - 320 :
                         step.position === 'center' ? spotlightY - 140 :
                         spotlightY,
                    left: step.position === 'right' ? spotlightX + spotlightW + 20 : 
                          step.position === 'left' ? spotlightX - 360 :
                          step.position === 'center' ? spotlightX - 170 :
                          spotlightX + (spotlightW / 2) - 170
                }}
                className="absolute w-[340px] bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl border border-tech-blue/20 pointer-events-auto"
            >
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-tech-blue bg-tech-blue/10 px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                        Paso {currentStep + 1} de {currentSteps.length}
                    </span>
                    <button onClick={() => setActive(false)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter mb-3 leading-tight">
                    {step.title}
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                    {step.content}
                </p>

                <div className="flex justify-between items-center">
                    <button 
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                            currentStep === 0 ? 'opacity-30' : 'text-gray-500 hover:text-navy-slate dark:hover:text-white'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Atrás
                    </button>

                    <button 
                        onClick={handleNext}
                        className="px-6 py-3 bg-tech-blue text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-tech-blue/20 flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95"
                    >
                        {currentStep === currentSteps.length - 1 ? '¡Listo!' : 'Siguiente'} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className={`absolute w-3 h-3 bg-white dark:bg-gray-900 border border-tech-blue/20 rotate-45 ${
                    step.position === 'bottom' ? '-top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0' :
                    step.position === 'top' ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0' :
                    step.position === 'right' ? 'top-1/2 -left-1.5 -translate-y-1/2 border-t-0 border-r-0' :
                    step.position === 'left' ? 'top-1/2 -right-1.5 -translate-y-1/2 border-b-0 border-l-0' :
                    'hidden'
                }`} />
            </motion.div>
        </div>
    );
}
