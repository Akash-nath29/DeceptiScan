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
    tokens: list[str]  # Expecting a list of text chunks

@app.post("/")
async def classify_patterns(data: Data):
    # Preprocess input text
    sequences = tokenizer.texts_to_sequences(data.tokens)
    padded_sequences = pad_sequences(sequences, maxlen=50, padding="post")

    # Predict
    predictions = nn_model.predict(padded_sequences)  # Softmax output

    # Get class probabilities
    results = []
    for probs in predictions:
        # Get indices of patterns with confidence > 0.2 (adjust threshold if needed)
        top_indices = np.where(probs > 0.2)[0]
        classifications = [
            {"pattern": label_encoder.inverse_transform([idx])[0], "confidence": float(probs[idx])}
            for idx in top_indices
        ]
        
        # If no strong predictions, classify as "Not Dark"
        if not classifications:
            classifications = [{"pattern": "Not Dark", "confidence": 1.0}]
        
        results.append(classifications)

    response = {"result": results}
    print(response)
    return response