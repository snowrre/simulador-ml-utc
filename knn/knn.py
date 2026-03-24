"""
UNIVERSIDAD TRES CULTURAS
Ingeniería en Sistemas Computacionales
EXAMEN PRÁCTICO INTEGRADOR: ALGORITMO K-NEAREST NEIGHBORS (KNN)

Este archivo contiene la clase KNNModel utilizada por el simulador web (Etapa 4)
y también funciona como programa independiente (Etapa 2).
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import os

class KNNModel:
    def __init__(self, k_neighbors=3):
        self.k = k_neighbors
        self.model = KNeighborsClassifier(n_neighbors=self.k)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = None

    def load_and_preprocess(self, filepath, target_column='target'):
        """Carga y divide el dataset (Etapa 1)"""
        df = pd.read_csv(filepath)
        
        # Separar X e y
        X = df.drop(columns=[target_column])
        if 'target_name' in X.columns:
            X = X.drop(columns=['target_name'])
        
        y = df[target_column]
        self.feature_names = X.columns.tolist()

        # División 80/20
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # El escalado se hace en el entrenamiento para evitar fuga de datos
        return X_train, X_test, y_train, y_test

    def train(self, X_train, y_train):
        """Entrena el modelo (Etapa 2)"""
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        self.is_trained = True

    def evaluate(self, X_test, y_test):
        """Evalúa el modelo y retorna métricas (Etapa 2)"""
        X_scaled = self.scaler.transform(X_test)
        y_pred = self.model.predict(X_scaled)
        
        acc = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred)
        rep = classification_report(y_test, y_pred)
        
        return acc, cm, rep

    def predict_single(self, features):
        """Predice un solo registro (Etapa 2/4)"""
        if not self.is_trained:
            raise Exception("El modelo no ha sido entrenado")
        
        # Asegurar que features sea un array de 2D
        features_scaled = self.scaler.transform([features])
        return self.model.predict(features_scaled)[0]

    def predict_batch(self, features_list):
        """Predice múltiples registros (Etapa 4)"""
        if not self.is_trained:
            raise Exception("El modelo no ha sido entrenado")
        
        features_scaled = self.scaler.transform(features_list)
        return self.model.predict(features_scaled)

def run_standalone():
    """Ejecución como programa independiente para el examen"""
    print("\n" + "="*60)
    print(" DEMOSTRACIÓN INDEPENDIENTE: KNN (UTC EXAMEN) ".center(60, "="))
    print("="*60)
    
    # Intentar cargar Wine como pide la rúbrica
    for ds in ["wine.csv", "breast_cancer.csv"]:
        path = os.path.join(os.path.dirname(__file__), "datasets", ds)
        if not os.path.exists(path):
            path = os.path.join("datasets", ds) # Fallback
            
        if os.path.exists(path):
            print(f"\n>>> Procesando Dataset: {ds}")
            model = KNNModel(k_neighbors=5)
            X_train, X_test, y_train, y_test = model.load_and_preprocess(path)
            model.train(X_train, y_train)
            acc, cm, _ = model.evaluate(X_test, y_test)
            print(f"Resultado -> Accuracy: {acc:.4f}")
            print(f"Matriz de Confusión:\n{cm}")
        else:
            print(f"\n[!] Dataset {ds} no encontrado para la demo independiente.")

if __name__ == "__main__":
    run_standalone()
