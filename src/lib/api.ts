const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function trainModel(algorithm: 'knn' | 'tree', dataset: string, params: any) {
    const response = await fetch(`${API_BASE_URL}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, dataset, params })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al entrenar el modelo');
    }
    
    return await response.json();
}

export async function predictSingle(algorithm: 'knn' | 'tree', features: number[]) {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, features })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en la predicción');
    }
    
    return await response.json();
}

export async function predictBatch(algorithm: 'knn' | 'tree', features_list: number[][]) {
    const response = await fetch(`${API_BASE_URL}/predict_batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, features_list })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en la predicción rnot lote');
    }
    
    return await response.json();
}

export async function getDatasets() {
    const response = await fetch(`${API_BASE_URL}/datasets`);
    if (!response.ok) return [];
    return await response.json();
}
