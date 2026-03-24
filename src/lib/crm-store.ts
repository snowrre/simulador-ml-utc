"use client";

import { Solution } from "@/data/solutions";

export interface CRMRequest {
    id: string;
    client: string;
    email: string;
    product: string;
    date: string;
    status: 'Pendiente' | 'En seguimiento' | 'Cerrado' | 'Perdido';
    priority: 'Alta' | 'Media' | 'Baja';
    amount: number;
    isMonthly: boolean;
    timestamp: number;
    // New fields for Phase 9
    personalizationNote?: string;
    personalizationFile?: string; // Base64 string
}

const STORAGE_KEY = 'the_tech_hub_crm_data';

export const getCRMRequests = (): CRMRequest[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveCRMRequest = (request: Omit<CRMRequest, 'id' | 'timestamp' | 'status' | 'priority'>) => {
    const requests = getCRMRequests();
    const newRequest: CRMRequest = {
        ...request,
        id: `TH-${Math.floor(1000 + Math.random() * 9000)}-${request.product.substring(0, 3).toUpperCase()}`,
        status: 'Pendiente',
        priority: 'Media',
        timestamp: Date.now()
    };
    
    const updated = [newRequest, ...requests];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRequest;
};

export const updateRequestStatus = (id: string, status: CRMRequest['status']) => {
    const requests = getCRMRequests();
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const calculateMetrics = () => {
    const requests = getCRMRequests();
    
    const mrr = requests
        .filter(r => r.status === 'Cerrado' || r.status === 'En seguimiento')
        .reduce((acc, r) => acc + (r.isMonthly ? r.amount : 0), 0);
        
    const pendingCount = requests.filter(r => r.status === 'Pendiente').length;
    
    const totalRequests = requests.length;
    const closedRequests = requests.filter(r => r.status === 'Cerrado').length;
    const conversionRate = totalRequests > 0 ? (closedRequests / totalRequests) * 100 : 0;
    
    // Potential revenue from open/following leads
    const potentialRevenue = requests
        .filter(r => r.status !== 'Cerrado' && r.status !== 'Perdido')
        .reduce((acc, r) => acc + r.amount, 0);

    return {
        mrr,
        pendingCount,
        conversionRate,
        totalRequests,
        potentialRevenue,
        recentActivity: requests.slice(0, 5)
    };
};

export const getTopSolutions = () => {
    const requests = getCRMRequests();
    const totals: Record<string, { count: number, revenue: number }> = {};
    
    requests.forEach(r => {
        if (!totals[r.product]) totals[r.product] = { count: 0, revenue: 0 };
        totals[r.product].count += 1;
        totals[r.product].revenue += r.amount;
    });
    
    return Object.entries(totals)
        .map(([name, data]) => ({
            name,
            requests: data.count,
            revenue: data.revenue,
            percentage: Math.min(100, (data.count / requests.length) * 100 || 0)
        }))
        .sort((a, b) => b.requests - a.requests);
};

export const exportToCSV = (data: any[], filename: string) => {
    if (typeof window === 'undefined') return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
        Object.values(item).map(val => `"${val}"`).join(',')
    ).join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
