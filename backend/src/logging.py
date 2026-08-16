import logging
import sys
from pythonjsonlogger import jsonlogger
from src.settings import Settings

def setup_logging():
    handler = logging.StreamHandler(sys.stdout)

    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(levelname)s %(name)s %(message)s'
    )
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.setLevel(int(Settings.LOG_LEVEL))
    root.handlers = [handler]
    
    # Set OpenSearch logger to WARNING to suppress INFO-level HTTP request logs
    opensearch_logger = logging.getLogger("opensearch")
    opensearch_logger.setLevel(logging.WARNING)
