import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

def main():
    print("="*50)
    print(" Clasificador KNN con el Dataset IRIS ")
    print("="*50)
    
    # 1. Cargar el dataset
    print("\n[INFO] Cargando el dataset IRIS...")
    iris = load_iris()
    X = iris.data
    y = iris.target
    target_names = iris.target_names
    feature_names = iris.feature_names
    
    print("\nDataset IRIS cargado con éxito.")
    print(f"Características (Features): {', '.join(feature_names)}")
    print(f"Clases (Targets): {', '.join(target_names)}\n")

    # 2. Solicitar al usuario el valor de K
    while True:
        try:
            k = int(input(">> Ingresa el valor de K (número de vecinos) para el entrenamiento: "))
            if k <= 0:
                print("   [ERROR] El valor de K debe ser un número entero positivo. Inténtalo de nuevo.")
            else:
                break
        except ValueError:
            print("   [ERROR] Entrada no válida. Por favor, ingresa un número entero.")

    # Dividir el dataset en entrenamiento y prueba (80% entrenamiento, 20% prueba)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 3. Inicializar y entrenar el modelo KNN
    print(f"\n[INFO] Entrenando el modelo KNN con k={k}...")
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    
    # Evaluar el modelo
    y_pred = knn.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"[INFO] Modelo entrenado correctamente.")
    print(f"       Precisión del modelo en el conjunto de prueba (20% de los datos): {accuracy * 100:.2f}%\n")
    
    # 4. Solicitar un nuevo dato para predecir
    print("="*50)
    print(" Predicción de un Nuevo Dato ")
    print("="*50)
    print("Por favor, ingresa los valores para las siguientes características (medidas en cm):")
    
    nuevo_dato = []
    for feature in feature_names:
        while True:
            try:
                valor = float(input(f"   - {feature}: "))
                if valor <= 0:
                    print("     [ADVERTENCIA] Por lo general, las medidas son mayores a 0, pero se aceptará el valor.")
                nuevo_dato.append(valor)
                break
            except ValueError:
                print("     [ERROR] Entrada no válida. Por favor, ingresa un número decimal válido (ej. 5.1).")
                
    # 5. Realizar la predicción
    nuevo_dato_np = np.array([nuevo_dato])
    prediccion_idx = knn.predict(nuevo_dato_np)[0]
    clase_predicha = target_names[prediccion_idx]
    
    print("\n" + "="*50)
    print(" Resultado de la Predicción ")
    print("="*50)
    print(f"Datos analizados: {nuevo_dato}")
    print(f"El modelo predice que este dato pertenece a la clase: >>> **{clase_predicha.upper()}** <<<")
    print("="*50 + "\n")

if __name__ == "__main__":
    main()
