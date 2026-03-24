"use client";

import { solutions as initialSolutions, Solution } from "@/data/solutions";

const STORAGE_KEY = 'the_tech_hub_solutions_data';

export const getSolutions = (): Solution[] => {
    if (typeof window === 'undefined') return initialSolutions;
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
        return JSON.parse(stored);
    }

    // Initialize with default data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSolutions));
    return initialSolutions;
};

export const saveSolution = (solutionData: Omit<Solution, 'id' | 'rating' | 'reviews' | 'priceStr' | 'setupFeeStr' | 'vendor' | 'targetAudience' | 'website'>) => {
    const current = getSolutions();
    const newSolution: Solution = {
        ...solutionData,
        id: `sol-${Date.now()}`,
        rating: 5.0,
        reviews: 0,
        priceStr: solutionData.pricingModel === 'Suscripción' ? `$${solutionData.basePrice || solutionData.licensePrice}/mes` : `Desde $${solutionData.basePrice}`,
        setupFeeStr: `$${solutionData.setupFee}`,
        vendor: 'The Tech Hub Partner',
        targetAudience: 'Empresas y Corporativos',
        website: 'https://thetechhub.com',
        image: '/products/placeholder.png'
    };
    
    const updated = [newSolution, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newSolution;
};

export const deleteSolution = (id: string) => {
    const current = getSolutions();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getSolutionById = (id: string): Solution | undefined => {
    const all = getSolutions();
    return all.find(s => s.id === id);
};

export const updateSolution = (id: string, solutionData: Partial<Solution>) => {
    const current = getSolutions();
    const index = current.findIndex(s => s.id === id);
    
    if (index !== -1) {
        const updated = { ...current[index], ...solutionData };
        
        // Update formatted strings if pricing changed
        if (solutionData.basePrice !== undefined || solutionData.licensePrice !== undefined || solutionData.pricingModel !== undefined) {
            updated.priceStr = updated.pricingModel === 'Suscripción' ? `$${updated.basePrice || updated.licensePrice}/mes` : `Desde $${updated.basePrice}`;
        }
        if (solutionData.setupFee !== undefined) {
            updated.setupFeeStr = `$${updated.setupFee}`;
        }
        
        current[index] = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        return updated;
    }
    return undefined;
};
