import PyPDF2
import requests
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import json

app = Flask(__name__)
CORS(app)

# Configure Redis
redis_client = redis.Redis.from_url('rediss://red-cm8fecen7f5s73ecp9mg:SdjEHPGgwaElenJ0v5SGSHV7Qb6jXPET@oregon-redis.render.com:6379')
CACHE_EXPIRATION = 60 * 60 * 24  # 24 hours in seconds

# Configure Gemini API
genai.configure(api_key='AIzaSyDZJoW_njjcjEfkHtaPWF79QkI9YWscwXs')
model = genai.GenerativeModel('gemini-pro')

# Function to download PDF from URL and save it locally
def download_pdf(pdf_url, local_path="temp.pdf"):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        raise ValueError("PDF file not found.")
    with open(local_path, "wb") as file:
        file.write(response.content)
    return local_path

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

# Function to summarize text using Gemini
def summarize_text(text):
    prompt = (
        "Please provide a concise and structured summary of the following text. "
        "Focus on the main ideas and key points, removing unnecessary details and jargon. "
        "Present the summary in a bulleted list format for clarity, ensuring each point is clear, "
        "easy to understand, and captures the essence of the content:\n\n"
        f"{text}"
    )
    response = model.generate_content(prompt)
    return response.text

# API endpoint to summarize PDF
@app.route('/summarize-pdf/', methods=['POST'])
def summarize_pdf():
    data = request.get_json()
    pdf_url = data.get('url')

    if not pdf_url:
        return jsonify({"error": "PDF URL is required."}), 400

    try:
        # Check if summary exists in Redis cache
        cached_summary = redis_client.get(pdf_url)
        if cached_summary:
            return jsonify({"summary": cached_summary.decode('utf-8')})

        # If not in cache, generate new summary
        pdf_path = download_pdf(pdf_url)
        text = extract_text_from_pdf(pdf_path)
        summary = summarize_text(text)

        # Store in Redis cache
        redis_client.setex(pdf_url, CACHE_EXPIRATION, summary)

        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
