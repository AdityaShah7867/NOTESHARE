import google.generativeai as genai
from flask import jsonify
from datetime import datetime

# Configure Gemini
genai.configure(api_key='AIzaSyDZJoW_njjcjEfkHtaPWF79QkI9YWscwXs')
model = genai.GenerativeModel('gemini-pro')

def generate_user_report(user_data):
    """
    Generate a comprehensive report based on user data using Gemini AI
    """
    # Format user data for the prompt
    prompt = f"""
    Please analyze the following user data and create a comprehensive report:
    
    User Information:
    - Name: {user_data.get('name', 'N/A')}
    - Email: {user_data.get('email', 'N/A')}
    - Join Date: {user_data.get('join_date', 'N/A')}
    
    Activity Summary:
    - Total PDFs Processed: {user_data.get('total_pdfs', 0)}
    - Total Summaries Generated: {user_data.get('total_summaries', 0)}
    - Last Active: {user_data.get('last_active', 'N/A')}
    
    Recent Documents:
    {user_data.get('recent_documents', [])}
    
    Please provide a detailed analysis including:
    1. User engagement patterns
    2. Document processing trends
    3. Usage statistics
    4. Recommendations for improvement
    5. Key insights
    
    Format the report in a clear, professional structure with sections and bullet points.
    """
    
    try:
        response = model.generate_content(prompt)
        report = {
            'generated_at': datetime.now().isoformat(),
            'user_id': user_data.get('user_id'),
            'report_content': response.text,
            'status': 'success'
        }
        return report
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e),
            'generated_at': datetime.now().isoformat()
        }
