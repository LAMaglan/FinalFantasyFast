# Start with a base image that includes Python 3.10
FROM python:3.10-slim

# Install Poetry
RUN pip install poetry

# Set the working directory
WORKDIR /backend

# Copy only the pyproject.toml and poetry.lock files to cache dependencies
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry config virtualenvs.create false && poetry install --no-dev

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Command to run the app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]