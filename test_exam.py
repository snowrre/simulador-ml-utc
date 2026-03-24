import urllib.request
import json
import time
import sys

BASE_URL = "http://localhost:5000"

def test_endpoint(name, func):
    print(f"\n[{name}] Iniciando prueba...")
    try:
        func()
        print(f"[{name}] [PASS]")
    except Exception as e:
        print(f"[{name}] [FAIL]: {str(e)}")
        sys.exit(1)

def test_datasets():
    req = urllib.request.Request(f"{BASE_URL}/api/datasets")
    with urllib.request.urlopen(req) as res:
        datasets = json.loads(res.read().decode())
        assert len(datasets) > 0, "No hay datasets disponibles"
        print(f"Datasets encontrados: {datasets}")

def test_knn_training():
    payload = {
        "algorithm": "knn",
        "dataset": "wine.csv",
        "target": "target",
        "params": {
            "k_neighbors": 5
        }
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/api/train", data=data, headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req) as res:
        response_data = json.loads(res.read().decode())
        assert "accuracy" in response_data, "No se recibió accuracy"
        assert "confusion_matrix" in response_data, "No se recibió matriz de confusión"
        assert "report" in response_data, "No se recibió reporte"
        print(f"KNN Accuracy: {response_data['accuracy']}")

def test_tree_training():
    payload = {
        "algorithm": "tree",
        "dataset": "breast_cancer.csv",
        "target": "target",
        "params": {
            "criterion": "gini",
            "max_depth": 3
        }
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/api/train", data=data, headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req) as res:
        response_data = json.loads(res.read().decode())
        assert "accuracy" in response_data, "No se recibió accuracy"
        assert "confusion_matrix" in response_data, "No se recibió matriz de confusión"
        print(f"Tree Accuracy: {response_data['accuracy']}")

if __name__ == "__main__":
    print("Iniciando Suite de Pruebas: Examen UTC (Flask Backend)")
    print("-" * 50)
    
    time.sleep(1)
    
    try:
        test_endpoint("1. Conexión y Lista de Datasets", test_datasets)
        test_endpoint("2. Entrenamiento Modelo KNN (Wine Dataset)", test_knn_training)
        test_endpoint("3. Entrenamiento Árbol de Decisión (Breast Cancer)", test_tree_training)
        
        print("-" * 50)
        print("[ALL PASS] TODAS LAS PRUEBAS PASARON CORRECTAMENTE")
        print("El Backend Python y Scikit-Learn están integrados de forma exitosa.")
    except Exception as e:
        print(f"\n[ERROR] Error de red o aserción: {str(e)}")
