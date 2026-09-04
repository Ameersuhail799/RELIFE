from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import PROJECT_NAME, API_V1_STR
from backend.app.core.database import engine, Base
import backend.app.models  # Ensures all ORM models are registered with Base
from backend.app.api.v1.router import api_router

# Create database tables automatically for SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=PROJECT_NAME,
    description="Circular IT Asset Intelligence & Second-Life Orchestration Platform",
    version="0.1.0-vertical-slice",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=API_V1_STR)


@app.get("/")
def root():
    return {
        "project": PROJECT_NAME,
        "sdg_alignment": "SDG 12: Responsible Consumption and Production",
        "version": "0.1.0-vertical-slice",
        "status": "operational",
        "documentation": "/docs",
    }
