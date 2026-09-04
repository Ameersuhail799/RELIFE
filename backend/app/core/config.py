import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
ASSUMPTIONS_PATH = DATA_DIR / "impact_assumptions_v1.json"

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/relife.db")
APP_ENV = os.getenv("APP_ENV", "development")
PROJECT_NAME = "ReLife IT Asset Intelligence"
API_V1_STR = "/api/v1"
