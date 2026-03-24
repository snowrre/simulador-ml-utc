"use client";

import React from 'react';
import PreprocessingManager from '@/components/simulador/PreprocessingManager';
import WizardStepper from '@/components/simulador/WizardStepper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useML } from '@/context/MLContext';

export default function PreprocessingPage() {
    const router = useRouter();
    const { state } = useML();

    const handleNext = () => {
        if (state.selectedProject) {
            router.push(`/modelo/${state.selectedProject}`);
        } else {
            router.push('/modelo');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-32 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <WizardStepper />
                    <h1 className="text-4xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Limpieza y Transformación</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Prepara tus datos antes de entrenar el modelo.</p>
                </div>
            </div>

            <div className="mt-8">
                <PreprocessingManager onNext={handleNext} />
            </div>
        </div>
    );
}


