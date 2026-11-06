from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import PROJECT_NAME, API_V1_STR
from backend.app.core.database import engine, Base, SessionLocal
import backend.app.models  # Ensures all ORM models are registered with Base
from backend.app.models.asset import Asset
from backend.app.services.portfolio_service import seed_simulated_data
from backend.app.api.v1.router import api_router

# Create database tables automatically for SQLite
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-seed initial simulated dataset on startup if database is empty
    db = SessionLocal()
    try:
        if db.query(Asset).count() == 0:
            seed_simulated_data(db)
    except Exception as e:
        print(f"Startup notice: Auto-seed encountered: {e}")
    finally:
        db.close()
    yield


app = FastAPI(
    title=PROJECT_NAME,
    description="Circular IT Asset Intelligence & Second-Life Orchestration Platform",
    version="0.1.0-vertical-slice",
    lifespan=lifespan,
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
