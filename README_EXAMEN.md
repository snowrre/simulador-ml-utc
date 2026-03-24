# Simulador de Machine Learning - Universidad Tres Culturas

Este proyecto ha sido actualizado para cumplir con los requisitos del examen práctico integrador. Se han separado dos experiencias para mayor claridad.

## 1. El Simulador de Examen (Python + scikit-learn)
Se encuentra en la ruta: `/simulador-examen`

**Características:**
- Utiliza un backend en **Python (Flask)**.
- Implementa algoritmos de **Clasificación** de **scikit-learn** (KNN y Árbol de Decisión).
- Carga datasets obligatorios (`wine.csv`, `breast_cancer.csv`) desde el servidor.
- Cumple con la arquitectura híbrida requerida para el examen de la UTC.

### Instrucciones de Ejecución del Backend
1. Abre una terminal en la carpeta raíz del proyecto.
2. Instala las dependencias de Python:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecuta el servidor Flask:
   ```bash
   python web/app.py
   ```
4. En otra terminal, mantén el frontend corriendo:
   ```bash
   npm run dev
   ```

## 2. El Simulador Interactivo (TypeScript Puro)
Se encuentra en la raíz: `/`

**Características:**
- Basado 100% en **TypeScript/React**.
- Los algoritmos corren directamente en el navegador.
- **Enfoque Exclusivo:** Clasificación de especies (Iris Dataset) y datasets personalizados.
- Se ha eliminado la funcionalidad de regresión para simplificar la experiencia educativa según los requerimientos finales.

---

### Verificación del Alumno
- [x] Ejecutar backend Python sin errores.
- [x] Visualizar los datasets obligatorios de clasificación.
- [x] Obtener métricas de rendimiento (Precisión, Recall, F1) procesadas por scikit-learn.
- [x] Presentar la documentación integrada en la web.
