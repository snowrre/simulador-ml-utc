"""
UNIVERSIDAD TRES CULTURAS
Ingeniería en Sistemas Computacionales
EXAMEN PRÁCTICO INTEGRADOR: ALGORITMO ÁRBOL DE DECISIÓN (DECISION TREE)

Este archivo contiene la clase DecisionTreeModel utilizada por el simulador web (Etapa 4)
y también funciona como programa independiente (Etapa 3).
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import os

class DecisionTreeModel:
    def __init__(self, criterion='gini', max_depth=None):
        self.criterion = criterion
        self.max_depth = max_depth
        self.model = DecisionTreeClassifier(criterion=self.criterion, max_depth=self.max_depth, random_state=42)
        self.is_trained = False
        self.feature_names = None

    def load_and_preprocess(self, filepath, target_column='target'):
        """Carga y divide el dataset (Etapa 1)"""
        df = pd.read_csv(filepath)
        
        X = df.drop(columns=[target_column])
        if 'target_name' in X.columns:
            X = X.drop(columns=['target_name'])
        
        y = df[target_column]
        self.feature_names = X.columns.tolist()

        # División 80/20
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        return X_train, X_test, y_train, y_test

    def train(self, X_train, y_train):
        """Entrena el modelo (Etapa 3)"""
        self.model.fit(X_train, y_train)
        self.is_trained = True

    def evaluate(self, X_test, y_test):
        """Evalúa el modelo y retorna métricas (Etapa 3)"""
        y_pred = self.model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred)
        rep = classification_report(y_test, y_pred)
        
        return acc, cm, rep

    def predict_single(self, features):
        """Predice un solo registro (Etapa 3/4)"""
        if not self.is_trained:
            raise Exception("El modelo no ha sido entrenado")
        
        return self.model.predict([features])[0]

    def predict_batch(self, features_list):
        """Predice múltiples registros (Etapa 4)"""
        if not self.is_trained:
            raise Exception("El modelo no ha sido entrenado")
        
        return self.model.predict(features_list)

def run_standalone():
    """Ejecución como programa independiente para el examen"""
    print("\n" + "="*60)
    print(" DEMOSTRACIÓN INDEPENDIENTE: ÁRBOL DE DECISIÓN (UTC) ".center(60, "="))
    print("="*60)
    
    for ds in ["wine.csv", "breast_cancer.csv"]:
        path = os.path.join(os.path.dirname(__file__), "datasets", ds)
        if not os.path.exists(path):
            path = os.path.join("datasets", ds)
            
        if os.path.exists(path):
            print(f"\n>>> Procesando Dataset: {ds}")
            model = DecisionTreeModel(criterion='entropy', max_depth=3)
            X_train, X_test, y_train, y_test = model.load_and_preprocess(path)
            model.train(X_train, y_train)
            acc, cm, _ = model.evaluate(X_test, y_test)
            print(f"Resultado -> Accuracy: {acc:.4f}")
            print(f"Matriz de Confusión:\n{cm}")
            print("\nVisualización de Reglas (Fragmento):")
            print(export_text(model.model, feature_names=model.feature_names)[:300] + "...")
        else:
            print(f"\n[!] Dataset {ds} no encontrado para la demo independiente.")

if __name__ == "__main__":
    run_standalone()
