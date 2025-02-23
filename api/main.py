import pickle
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from pydantic import BaseModel
import numpy as np

# Load trained models
nn_model = load_model('deceptive_pattern_model.h5')

# Load tokenizer and label encoder from .pkl files
with open('tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

with open('label_encoder.pkl', 'rb') as handle:
    label_encoder = pickle.load(handle)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Data(BaseModel):
    tokens: list[str]  # Expecting a list of pattern strings

@app.post("/")
async def classify_patterns(data: Data):
    # Preprocess input text
    sequences = tokenizer.texts_to_sequences(data.tokens)
    padded_sequences = pad_sequences(sequences, maxlen=50, padding="post")

    # Predict
    predictions = nn_model.predict(padded_sequences)  # Softmax output

    # Convert predictions to class labels
    predicted_classes = np.argmax(predictions, axis=1)  # Get the class index
    predicted_labels = label_encoder.inverse_transform(predicted_classes)  # Map to category names
    
    
    # Remove all "Not Dark" from the predicted_labels and then count the rest as dark_pattern_score
    
    # dark_pattern_score = len([x for x in predicted_labels if x != 'Not Dark'])

    response = {'result': predicted_labels.tolist()}  # Convert to JSON serializable format
    print(response)
    return response
