##
# Dockerfile for the FastAPI backend service. It installs Python
# dependencies, copies the application code and exposes port 8000.
##
FROM python:3.11-slim as base

# Install build dependencies for PostgreSQL driver
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /code

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app ./app

# Expose port for Uvicorn
EXPOSE 8001

# Default command runs the application. This can be overridden by docker-compose.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]