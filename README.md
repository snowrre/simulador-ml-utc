# Examen Práctico Integrador: KNN y Árbol de Decisión con Simulador Web
**Alumno:** Sergio Alejandro Riancho Meza | **Matrícula:** 240132402
**Ingeniería en Sistemas Computacionales - Universidad Tres Culturas**

## 1. Propósito del Proyecto
Este sistema de clasificación supervisada integra algoritmos independientes de Machine Learning en Python con una interfaz web moderna. Permite la carga de datasets, el entrenamiento de modelos de KNN y Árbol de Decisión, y la realización de predicciones individuales y múltiples.

## 2. Tecnologías Utilizadas
- **Lenguaje:** Python 3.x
- **Librerías ML:** scikit-learn, pandas, numpy
- **Backend:** Flask (Python)
- **Frontend:** Next.js (React + TypeScript + Tailwind CSS)
- **Persistencia:** CSV

## 3. Estructura del Proyecto
```text
Examen_Clasificadores_Web/
├── knn/
│   ├── knn.py             # Implementación independiente de KNN
│   └── datasets/          # Datasets específicos de KNN
├── arbol_decision/
│   ├── arbol_decision.py  # Implementación independiente de Árbol de Decisión
│   └── datasets/          # Datasets específicos de Árbol
├── web/
│   ├── app.py             # Backend en Flask (Conexión Python <-> Web)
│   ├── static/            # Archivos estáticos
│   └── uploads/           # Carpeta para archivos CSV cargados
├── datasets/              # Datasets obligatorios (Wine, Breast Cancer)
├── src/                   # Código fuente del simulador (React/Next.js)
├── requirements.txt       # Dependencias de Python necesarias
└── README.md              # Instrucciones de ejecución
```

## 4. Instrucciones de Configuración

### Paso 1: Configurar Python
Es necesario tener instalado Python 3.x. Instala las librerías necesarias ejecutando:
```bash
pip install -r requirements.txt
```

### Paso 2: Ejecutar el Backend (Flask)
Navega a la carpeta del proyecto y ejecuta el servidor de Python:
```bash
python web/app.py
```
*El servidor correrá en http://localhost:5000*

### Paso 3: Ejecutar el Simulador Web
Para correr la interfaz de usuario (Next.js):
```bash
npm install
npm run dev
```
*Accede a http://localhost:3000 para interactuar con el simulador.*

## 5. Demostración para el Examen
1. **Preparación:** Asegúrate de que el dataset `wine.csv` y `breast_cancer.csv` estén en la carpeta `datasets`.
2. **KNN:** Selecciona el modelo KNN, carga el dataset de Vino, ajusta K=3 y presiona "Ejecutar". Realiza una predicción escribiendo los valores manualmente.
3. **Árbol de Decisión:** Selecciona Árbol de Decisión, carga Breast Cancer, ajusta la profundidad y entrena. Observa la Matriz de Confusión y el Reporte de Clasificación.
4. **Validaciones:** Intenta entrenar sin cargar un archivo o predecir sin entrenar para verificar el manejo de errores.

---
**Elaborado por:** [Nombre del Alumno] - Matricula: [Tu Matrícula]
**Docente:** Mtro. en C.C. Gonzalo Ivan Riego Caravantes
