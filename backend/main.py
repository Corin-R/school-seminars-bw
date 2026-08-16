import logging
from src.logging import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

import os
import sys
import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager

from src.settings import Settings
from src.schools.manager import DataManager
from src.api.routes import router

def print_settings(settings_cls: Settings):
    logger.info("listing settings")
    logger.info(vars(settings_cls).items())
    for key, value in vars(settings_cls).items():
        if key.startswith("__"):
            continue
        if "secret" in key.lower() or "password" in key.lower() or "key" in key.lower():
            continue
        logger.info(f"{key} = {value}, {type(value)}")

data_manager = DataManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup initiated")

    try:
        logger.info("Running startups...")
        # initialize class
        data_manager.fetch_data()
        logger.info("Data Manager Fetched data")
        
    except Exception:
        logger.exception("Startup failed")
        raise

    app.state.data_manager = data_manager

    logger.info("Application startup completed")
    logger.info(f"Version: {Settings.APP_VERSION}")

    try:
        yield
    finally:
        logger.info("Application shutdown initiated")
        try:
            # graceful shutdown here
            pass
        except Exception:
            logger.exception("Failed to gracefully shutdown")
        logger.info("Application shutdown completed")


app = FastAPI(lifespan=lifespan)
app.include_router(router)

def main():
    print_settings(Settings)
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=Settings.DEBUG_MODE,
        )
    except KeyboardInterrupt:
        logger.info("Received Ctrl+C")
    finally:
        logger.info("Backend stopped")
        sys.exit(0)




if __name__ == "__main__":
    main()
