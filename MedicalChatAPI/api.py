from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_httpauth import HTTPTokenAuth
import random
import pickle
import json
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Load intents data from json file
intents = json.loads(open('data.json').read())

# Load pre-trained words and classes from pickle files
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))

# Load pre trained model
model = load_model('chatbot_model.h5')

# Function to clean and tokenize sentence


def clean_up_sentences(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

# Function to create bag of words from sentence


def bag_of_words(sentence):
    sentence_words = clean_up_sentences(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        if w in words:
            index = words.index(w)
            bag[index] = 1
    return np.array(bag)

# Function to predict the class of the input sentence


def predict_class(sentence):
    ERROR_THRESHOLD = 0.25
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    results = [(i, r) for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return [{'intent': classes[r[0]], 'probability': str(r[1])} for r in results]

# Function to get the response for the input sentence


def get_response(intents_list, intents_json):
    if intents_list:
        tag = intents_list[0]['intent']
        intents_dict = {i['tag']: i for i in intents_json['intents']}
    else:
        return "No intent found"
    intents_dict = {i['tag']: i for i in intents_json['intents']}
    try:
        result = random.choice(intents_dict[tag]['responses'])
    except KeyError:
        result = "I am sorry, I am not sure how to respond to that."
    return result


# init auth
auth = HTTPTokenAuth(scheme='Bearer')

# load the tokens
tokens = json.loads(open('tokens.json').read())


@auth.verify_token
def token_verification(token):
    if token in tokens:
        return tokens[token]
    return None


app = Flask(__name__)
CORS(app)


@app.route('/predict', methods=['POST'])
@auth.login_required
def predict():
    if 'input_text' not in request.json:
        return (jsonify({"error": "input_text is missing"}), 400)

    input_text = request.json['input_text']
    prediction = predict_class(input_text)
    res = get_response(prediction, intents)
    print(res)
    return jsonify({"response": res})


if __name__ == '__main__':
    app.run()
