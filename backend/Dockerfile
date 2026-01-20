# Use Python base image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . /app

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port (Railway default)
EXPOSE 8000

# Start Daphne server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]