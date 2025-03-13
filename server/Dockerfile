FROM python:3.11-slim

#WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Use the correct PYTHONPATH now that we've set WORKDIR to /app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--lifespan", "on"]