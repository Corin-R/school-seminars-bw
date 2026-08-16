# Base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Install OS dependencies needed for psycopg / Postgres client
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .

# Expose FastAPI port
EXPOSE 8000

# Default command to run your main.py
CMD ["python", "main.py"]