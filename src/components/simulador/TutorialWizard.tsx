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
        title: '¡Explora la IA con Antigravity!',
        content: 'Este simulador te permite experimentar con algoritmos de Machine Learning de nivel profesional (KNN y Árboles de Decisión) sin escribir una sola línea de código.',
        position: 'bottom'
    },
    {
        targetId: 'btn-ver-ejemplos',
        title: 'Proyectos de Ejemplo del Examen',
        content: 'Accede a configuraciones predefinidas con los datasets oficiales (Iris y Breast Cancer) para ver el potencial de la IA de inmediato.',
        position: 'top'
    },
    {
        targetId: 'btn-cargar-dataset',
        title: 'Tu Propio Laboratorio de Datos',
        content: '¿Tienes un archivo CSV o Excel? Súbelo aquí para que el simulador lo analice y te ayude a crear predicciones personalizadas.',
        position: 'top'
    }
];

// Pasos adicionales que se activarán según la página
const internalSteps: Record<string, TutorialStep[]> = {
    '/dataset': [
        {
            targetId: 'dataset-upload-zone',
            title: 'Importación de Datos',
            content: 'Arrastra tu archivo aquí. El sistema procesará automáticamente el formato y detectará las columnas disponibles.',
            position: 'bottom'
        },
        {
            targetId: 'btn-select-file',
            title: 'Buscador de Archivos',
            content: 'Utiliza el explorador de Windows para seleccionar tus datasets en formato CSV o Excel.',
            position: 'top'
        }
    ],
    '/dataset/loaded': [
        {
            targetId: 'dataset-health-report-card',
            title: 'Diagnóstico de Calidad',
            content: 'Antes de entrenar, revisamos si tus datos tienen errores, valores nulos o columnas irrelevantes que puedan estropear el modelo.',
            position: 'left'
        },
        {
            targetId: 'variable-config-section',
            title: 'Arquitectura de Variables',
            content: 'Define tu variable dependiente (Target Y) y las independientes (Features X). Esta es la base matemática de tu experimento.',
            position: 'top'
        }
    ],
    '/preprocesamiento': [
        {
            targetId: 'preprocessing-strategy',
            title: 'Imputación de Datos',
            content: 'Decide cómo manejar los huecos en la información. Usar la "Media" garantiza que el modelo no pierda registros valiosos.',
            position: 'right'
        },
        {
            targetId: 'scaling-section',
            title: 'Estandarización Estricta',
            content: 'Normaliza tus datos (0 a 1). Esto es CRÍTICO para KNN, ya que evita que escalas diferentes confundan al algoritmo.',
            position: 'top'
        },
        {
            targetId: 'train-test-split-section',
            title: 'Validación Cruzada Holout',
            content: 'Dividimos los datos para evitar el sobreajuste. Entrenamos con una parte y validamos con otra totalmente nueva.',
            position: 'top'
        }
    ],
    '/modelo/knn': [
        {
            targetId: 'knn-params-card',
            title: 'Hiperparámetros de Proximidad',
            content: 'Configura el valor de K y la métrica de distancia (Euclidiana o Manhattan) para determinar cómo se agruparán los datos.',
            position: 'right'
        },
        {
            targetId: 'btn-train-model',
            title: 'Motor de Inferencia',
            content: 'Inicia el proceso de clasificación. El simulador calculará las distancias y generará las métricas de precisión.',
            position: 'top'
        },
        {
            targetId: 'prediction-form-card',
            title: 'Simulación de Casos Reales',
            content: 'Usa esta sección para ingresar datos nuevos y ver qué predice tu modelo entrenado en tiempo real.',
            position: 'top'
        }
    ],
    '/modelo/arbol': [
        {
            targetId: 'dt-params-card',
            title: 'Control de Complejidad',
            content: 'Ajusta la profundidad máxima del árbol para controlar el equilibrio entre precisión y generalización.',
            position: 'right'
        },
        {
            targetId: 'btn-train-model',
            title: 'Construcción Lógica',
            content: 'El algoritmo generará reglas de decisión basadas en la ganancia de información (Gini o Entropía).',
            position: 'top'
        },
        {
            targetId: 'prediction-form-card',
            title: 'Predictor Predictivo',
            content: 'Ingresa valores de prueba para validar la lógica del árbol en situaciones de diagnóstico real.',
            position: 'top'
        }
    ],
    '/experimentos': [
        {
            targetId: 'experiments-list-section',
            title: 'Dashboard de Resultados',
            content: 'Analiza y compara el rendimiento de todos tus experimentos para elegir el mejor modelo para tu examen.',
            position: 'center'
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

    const currentSteps = activeKey ? (internalSteps[activeKey] || []) : (pathname === '/' ? steps : (internalSteps[pathname] || []));

    useEffect(() => {
        // Solo auto-iniciar en la landing page principal (/)
        if (pathname !== '/') return;

        const hasSeenTutorial = localStorage.getItem('hasSeenMLTutorial');
        if (!hasSeenTutorial) {
            const timer = setTimeout(() => {
                startTutorial();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [pathname]); // Se dispara al entrar a la landing

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

