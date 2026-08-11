import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


def test_gemini():
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents="Respond with exactly: InkSense Gemini API is working!"
    )

    return response.text


def digitize_handwriting(image_bytes, language="English"):

    prompt = f"""
You are the handwriting digitization engine for InkSense AI.

Analyze the provided handwritten document image.

The document contains {language} handwriting.

Your task is to accurately transcribe ONLY the handwritten content
visible in the image.

IMPORTANT RULES:

1. Convert the handwriting into clean digital text.
2. Preserve the original meaning.
3. Preserve the original wording as much as possible.
4. Preserve paragraph breaks and line structure where possible.
5. Do not summarize the document.
6. Do not generate a title.
7. Do not generate key points.
8. Do not classify the document.
9. Do not add explanations.
10. Do not invent information.
11. If a word is unclear, make the best possible interpretation.
12. Return ONLY the extracted handwritten text.
13. Do NOT return JSON.
14. Do NOT use Markdown code fences.

Return only the transcription.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=[
            {
                "text": prompt
            },
            {
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                }
            }
        ]
    )

    extracted_text = response.text.strip()

    return extracted_text