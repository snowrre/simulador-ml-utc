"use client";

import React from 'react';
import DatasetManager from '@/components/simulador/DatasetManager';
import WizardStepper from '@/components/simulador/WizardStepper';
import Link from 'next/link';

export default function DatasetPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-32 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <WizardStepper />
                    <h1 className="text-4xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Preparación de Datos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Sube, analiza y selecciona las variables para tu experimento.</p>
                </div>
            </div>

            <div className="mt-8">
                <DatasetManager />
            </div>
        </div>
    );
}


