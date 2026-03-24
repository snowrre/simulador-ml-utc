from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import sys

# Añadir directorios de algoritmos al path para poder importar
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from knn.knn import KNNModel
from arbol_decision.arbol_decision import DecisionTreeModel

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde el frontend de React

# Almacenamiento temporal de modelos en memoria
models = {
    'knn': None,
    'tree': None
}

datasets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'datasets'))

@app.route('/api/datasets', methods=['GET'])
def list_datasets():
    if not os.path.exists(datasets_dir):
        return jsonify([])
    files = [f for f in os.listdir(datasets_dir) if f.endswith('.csv')]
    return jsonify(files)

@app.route('/api/datasets/<filename>', methods=['GET'])
def get_dataset_file(filename):
    filepath = os.path.join(datasets_dir, filename)
    if not os.path.exists(filepath):
        return "Not Found", 404
    with open(filepath, 'r') as f:
        return f.read()

@app.route('/api/train', methods=['POST'])
def train_model():
    data = request.json
    algo = data.get('algorithm') # 'knn' o 'tree'
    dataset_name = data.get('dataset')
    target_column = data.get('target', 'target')
    params = data.get('params', {})

    filepath = os.path.join(datasets_dir, dataset_name)
    if not os.path.exists(filepath):
        return jsonify({'error': 'Dataset no encontrado'}), 404

    try:
        if algo == 'knn':
            k = int(params.get('k_neighbors', 3))
            model = KNNModel(k_neighbors=k)
            X_train, X_test, y_train, y_test = model.load_and_preprocess(filepath, target_column)
            model.train(X_train, y_train)
            acc, cm, rep = model.evaluate(X_test, y_test)
            models['knn'] = model
        elif algo == 'tree':
            crit = params.get('criterion', 'gini')
            depth = params.get('max_depth')
            if depth: depth = int(depth)
            model = DecisionTreeModel(criterion=crit, max_depth=depth)
            X_train, X_test, y_train, y_test = model.load_and_preprocess(filepath, target_column)
            model.train(X_train, y_train)
            acc, cm, rep = model.evaluate(X_test, y_test)
            models['tree'] = model
        else:
            return jsonify({'error': 'Algoritmo no soportado'}), 400

        return jsonify({
            'message': f'Modelo {algo} entrenado con éxito',
            'accuracy': acc,
            'confusion_matrix': cm.tolist(),
            'report': rep
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    algo = data.get('algorithm')
    features = data.get('features') # Lista de valores

    model = models.get(algo)
    if not model or not model.is_trained:
        return jsonify({'error': 'El modelo no ha sido entrenado'}), 400

    try:
        if features is None:
            return jsonify({'error': 'No se proporcionaron características'}), 400
        prediction = model.predict_single(features)
        return jsonify({'prediction': int(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict_batch', methods=['POST'])
def predict_batch():
    # Similar a predict pero recibe lista de listas
    data = request.json
    algo = data.get('algorithm')
    features_list = data.get('features_list')

    model = models.get(algo)
    if not model or not model.is_trained:
        return jsonify({'error': 'El modelo no ha sido entrenado'}), 400

    try:
        if features_list is None:
            return jsonify({'error': 'No se proporcionaron características'}), 400
        predictions = model.predict_batch(features_list)
        return jsonify({'predictions': predictions.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Etapa 4: Simulador web integrado
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
