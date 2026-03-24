import { Solution } from '@/data/solutions';

const FAVORITES_KEY = 'techhub_favorites';

export const getFavorites = (): Solution[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error parsing favorites', e);
        return [];
    }
};

export const addFavorite = (solution: Solution) => {
    if (typeof window === 'undefined') return;
    const current = getFavorites();
    if (!current.find(s => s.id === solution.id)) {
        current.push(solution);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(current));
    }
};

export const removeFavorite = (solutionId: string) => {
    if (typeof window === 'undefined') return;
    const current = getFavorites();
    const updated = current.filter(s => s.id !== solutionId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

export const toggleFavorite = (solution: Solution) => {
    if (typeof window === 'undefined') return;
    const current = getFavorites();
    const exists = current.find(s => s.id === solution.id);
    if (exists) {
        removeFavorite(solution.id);
        return false;
    } else {
        addFavorite(solution);
        return true;
    }
};

export const isFavorite = (solutionId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const current = getFavorites();
    return current.some(s => s.id === solutionId);
};
