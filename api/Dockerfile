# Use the official TensorFlow image as base
FROM tensorflow/tensorflow:2.10.0

# Set the working directory in the container
WORKDIR /app

# Copy the necessary files to the container
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn numpy tensorflow keras

# Expose the FastAPI port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
