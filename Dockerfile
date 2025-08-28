# Example Dockerfile for FastAPI backend
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy deps first for better caching
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest
COPY . /app

# Expose default port
EXPOSE 8000

# Run the app
# Update "server:app" if your FastAPI app module/object is different
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
