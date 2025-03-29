FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV QODE_CLARITY_ENVIRONMENT=production

# Command to run the application with the correct module path
CMD exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker qode_clarity_fastapi.app.main:app --bind :$PORT