import logging 
from fastapi import APIRouter, Request
from src.settings import Settings
from src.schools.manager import DataManager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

@router.get("/health")
def health():
    return {"status": "ok"}

@router.get("/version")
def health():
    return {"version": Settings.APP_VERSION}

@router.get("/districts")
def get_districts_route(request: Request):
    data_manager : DataManager = request.app.state.data_manager
    return data_manager.districs

@router.get("/schools")
def get_schools_route(request: Request):
    data_manager : DataManager = request.app.state.data_manager
    return data_manager.schools


@router.get("/categories")
def get_seminars_route(request: Request):
    data_manager : DataManager = request.app.state.data_manager
    return data_manager.categories