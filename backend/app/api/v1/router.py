from fastapi import APIRouter
from backend.app.api.v1.assets import router as assets_router
from backend.app.api.v1.evaluate import router as evaluate_router
from backend.app.api.v1.approvals import router as approvals_router
from backend.app.api.v1.passport import router as passport_router
from backend.app.api.v1.demand import router as demand_router
from backend.app.api.v1.impact import router as impact_router

api_router = APIRouter()
api_router.include_router(assets_router)
api_router.include_router(evaluate_router)
api_router.include_router(approvals_router)
api_router.include_router(passport_router)
api_router.include_router(demand_router)
api_router.include_router(impact_router)
