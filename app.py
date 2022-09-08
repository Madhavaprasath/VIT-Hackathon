from flask import Flask, render_template, request, redirect, url_for
from flask import jsonify
from chat import get_response
from googletrans import Translator

app=Flask(__name__)


@app.get('/')
def index_get():
    return render_template('base.html')


@app.post('/predict')
def predict():
    text=request.get_json().get('message')
    translator=Translator()
    lang=translator.detect(text)
    if lang.lang!='en':
        text=translator.translate(text,dest='en').text
    s='en' if lang.lang=='en' else 'ta'
    response=translator.translate(get_response(text),dest=s).text
    message={'answer':response}
    return jsonify(message)


if __name__=='__main__':
    app.run(debug=True)