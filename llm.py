import os
from together import Together
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# init client (reads TOGETHER_API_KEY from env)
client = Together()

system_prompt = """You are AgriBot, an intelligent agricultural assistant.
- Help farmers identify and manage crop pests and diseases.
- Suggest remedies, preventive measures, and eco-friendly solutions.
- Give recommendations on fertilizers, irrigation, and best farming practices.
- Explain concepts in simple terms.
- Support multiple Indian languages (Hindi, Telugu, Tamil, Kannada, Bengali, etc).
Always be clear, concise, and farmer-friendly.
"""

def ask_agri(query: str) -> str:
    try:
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",  # ✅ make sure model exists
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {e}"
