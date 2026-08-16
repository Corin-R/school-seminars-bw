import os
from dotenv import load_dotenv


# .env shall only be present on dev
if os.path.exists(".env"): 
    load_dotenv() 


class Settings:   
    LOG_LEVEL = int(os.getenv("LOG_LEVEL", 20))
    APP_VERSION = os.getenv("APP_VERSION", "0.0.0")
    DEBUG_MODE = os.getenv("DEBUG", "False") == "True"