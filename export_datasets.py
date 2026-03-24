import pandas as pd
import os
from sklearn.datasets import load_wine, load_breast_cancer, load_iris

def export_datasets():
    datasets_dir = os.path.join(os.path.dirname(__file__), 'datasets')
    os.makedirs(datasets_dir, exist_ok=True)

    # Export IRIS
    iris = load_iris()
    df_iris = pd.DataFrame(iris.data, columns=iris.feature_names)
    df_iris['target'] = iris.target
    df_iris['target_name'] = df_iris['target'].map(lambda x: iris.target_names[x])
    df_iris.to_csv(os.path.join(datasets_dir, 'iris.csv'), index=False)
    print("Exported iris.csv")

    # Export WINE
    wine = load_wine()
    df_wine = pd.DataFrame(wine.data, columns=wine.feature_names)
    df_wine['target'] = wine.target
    df_wine.to_csv(os.path.join(datasets_dir, "wine.csv"), index=False)
    print("Exported wine.csv")

    # Breast Cancer
    cancer = load_breast_cancer()
    df_cancer = pd.DataFrame(cancer.data, columns=cancer.feature_names)
    df_cancer['target'] = cancer.target
    df_cancer.to_csv(os.path.join(datasets_dir, "breast_cancer.csv"), index=False)
    print("Exported breast_cancer.csv")

if __name__ == "__main__":
    export_datasets()
