"""
app/config.py
Configuración para la aplicación
"""
import os
from pathlib import Path

# Directorios
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"

# Asegurar que el directorio de datos existe
DATA_DIR.mkdir(exist_ok=True)

# Rutas de archivos de datos
VERBS_JSON = DATA_DIR / "irregular_verbs_b2.json"
TENSES_JSON = DATA_DIR / "tenses_activities_seed.json"