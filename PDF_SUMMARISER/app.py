import PyPDF2
import requests
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import json
from report_api import generate_user_report
from datetime import datetime

app = Flask(__name__)
CORS(app)


redis_client = redis.Redis.from_url('rediss://red-cm8fecen7f5s73ecp9mg:SdjEHPGgwaElenJ0v5SGSHV7Qb6jXPET@oregon-redis.render.com:6379')
CACHE_EXPIRATION = 60 * 60 * 24  


genai.configure(api_key='AIzaSyDZJoW_njjcjEfkHtaPWF79QkI9YWscwXs')
model = genai.GenerativeModel('gemini-pro')


def download_pdf(pdf_url, local_path="temp.pdf"):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        raise ValueError("PDF file not found.")
    with open(local_path, "wb") as file:
        file.write(response.content)
    return local_path


def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text


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


@app.route('/summarize-pdf/', methods=['POST'])
def summarize_pdf():
    data = request.get_json()
    pdf_url = data.get('url')

    if not pdf_url:
        return jsonify({"error": "PDF URL is required."}), 400

    try:
        
        cached_summary = redis_client.get(pdf_url)
        if cached_summary:
            return jsonify({"summary": cached_summary.decode('utf-8')})

        
        pdf_path = download_pdf(pdf_url)
        text = extract_text_from_pdf(pdf_path)
        summary = summarize_text(text)

        
        redis_client.setex(pdf_url, CACHE_EXPIRATION, summary)

        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate-report/', methods=['POST'])
def generate_report():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400
        
    try:
        # Get user data from Redis cache
        user_key = f"user:{user_id}"
        cached_user_data = redis_client.get(user_key)
        
        if not cached_user_data:
            return jsonify({"error": "User data not found."}), 404
            
        user_data = json.loads(cached_user_data)
        
        # Add current timestamp for last active
        user_data['last_active'] = datetime.now().isoformat()
        
        # Generate report using Gemini
        report = generate_user_report(user_data)
        
        # Cache the report
        report_key = f"report:{user_id}:{datetime.now().strftime('%Y%m%d')}"
        redis_client.setex(report_key, CACHE_EXPIRATION, json.dumps(report))
        
        return jsonify(report)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
