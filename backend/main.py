from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import sqlite3
import base64
import os

from gemini_service import digitize_handwriting, test_gemini


# =========================================================
# FastAPI App
# =========================================================

app = FastAPI(
    title="InkSense API",
    description="Backend API for InkSense AI",
    version="2.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Database
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "inksense.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS documents (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT NOT NULL,

            text TEXT NOT NULL,

            language TEXT DEFAULT 'English',

            file_type TEXT DEFAULT 'PNG',

            status TEXT DEFAULT 'Digitised',

            image_data TEXT,

            created_at TEXT NOT NULL,

            updated_at TEXT NOT NULL

        )
        """
    )

    connection.commit()
    connection.close()


# Initialize database when backend starts
init_database()


# =========================================================
# Pydantic Models
# =========================================================

class DocumentUpdate(BaseModel):

    title: Optional[str] = None

    text: Optional[str] = None

    language: Optional[str] = None


# =========================================================
# Helper: Convert database row to dictionary
# =========================================================

def document_to_dict(document):

    return {
        "id": document["id"],
        "title": document["title"],
        "text": document["text"],
        "language": document["language"],
        "type": document["file_type"],
        "status": document["status"],
        "image": document["image_data"],
        "date": document["created_at"],
        "updated_at": document["updated_at"]
    }


# =========================================================
# Root Endpoint
# =========================================================

@app.get("/")
def home():

    return {
        "message": "InkSense Backend is running!"
    }


# =========================================================
# Backend Test
# =========================================================

@app.get("/api/test")
def test():

    return {
        "status": "success",
        "message": "InkSense API is working!"
    }


# =========================================================
# Gemini Test
# =========================================================

@app.get("/api/gemini-test")
def gemini_test():

    try:

        result = test_gemini()

        return {
            "success": True,
            "message": result
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


# =========================================================
# DIGITISE HANDWRITING
# =========================================================

@app.post("/api/digitize")
async def digitize(

    image: UploadFile = File(...),

    language: str = Form("English")

):

    try:

        # -----------------------------------------
        # Validate image
        # -----------------------------------------

        if not image.content_type:

            raise HTTPException(
                status_code=400,
                detail="Image type could not be detected."
            )

        allowed_types = [
            "image/jpeg",
            "image/png"
        ]

        if image.content_type not in allowed_types:

            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG and PNG images are supported."
            )


        # -----------------------------------------
        # Read image
        # -----------------------------------------

        image_bytes = await image.read()


        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="The uploaded image is empty."
            )


        # -----------------------------------------
        # Gemini
        # -----------------------------------------

        extracted_text = digitize_handwriting(
            image_bytes,
            language
        )


        if not extracted_text:

            raise HTTPException(
                status_code=422,
                detail="No handwritten text was detected."
            )


        # -----------------------------------------
        # Return result
        # -----------------------------------------

        return {

            "success": True,

            "text": extracted_text,

            "filename": image.filename,

            "content_type": image.content_type,

            "language": language

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "DIGITIZATION ERROR:",
            str(e)
        )

        return {

            "success": False,

            "error": str(e)

        }


# =========================================================
# CREATE / SAVE DOCUMENT
# =========================================================

@app.post("/api/documents")
async def create_document(

    image: UploadFile = File(...),

    text: str = Form(...),

    title: str = Form(...),

    language: str = Form("English")

):

    try:

        # -----------------------------------------
        # Read image
        # -----------------------------------------

        image_bytes = await image.read()


        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Image is empty."
            )


        # -----------------------------------------
        # Convert image to Base64
        # -----------------------------------------

        image_base64 = base64.b64encode(
            image_bytes
        ).decode("utf-8")


        # -----------------------------------------
        # Determine file type
        # -----------------------------------------

        content_type = (
            image.content_type
            or "image/jpeg"
        )


        if content_type == "image/png":

            file_type = "PNG"

        elif content_type == "image/jpeg":

            file_type = "JPG"

        else:

            file_type = "IMAGE"


        # -----------------------------------------
        # Timestamp
        # -----------------------------------------

        now = datetime.now().isoformat()


        # -----------------------------------------
        # Database
        # -----------------------------------------

        connection = get_db_connection()

        cursor = connection.cursor()


        cursor.execute(
            """
            INSERT INTO documents (

                title,
                text,
                language,
                file_type,
                status,
                image_data,
                created_at,
                updated_at

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,

            (
                title.strip()
                or "Untitled Handwritten Document",

                text,

                language,

                file_type,

                "Digitised",

                f"data:{content_type};base64,{image_base64}",

                now,

                now
            )
        )


        document_id = cursor.lastrowid

        connection.commit()


        # -----------------------------------------
        # Get newly created document
        # -----------------------------------------

        cursor.execute(
            "SELECT * FROM documents WHERE id = ?",
            (document_id,)
        )

        document = cursor.fetchone()

        connection.close()


        return {

            "success": True,

            "document": document_to_dict(
                document
            )

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "CREATE DOCUMENT ERROR:",
            str(e)
        )

        return {

            "success": False,

            "error": str(e)

        }


# =========================================================
# GET ALL DOCUMENTS
# =========================================================

@app.get("/api/documents")
def get_documents():

    try:

        connection = get_db_connection()

        cursor = connection.cursor()


        cursor.execute(
            """
            SELECT *

            FROM documents

            ORDER BY created_at DESC
            """
        )


        documents = cursor.fetchall()

        connection.close()


        return {

            "success": True,

            "documents": [

                document_to_dict(document)

                for document in documents

            ]

        }


    except Exception as e:

        print(
            "GET DOCUMENTS ERROR:",
            str(e)
        )

        return {

            "success": False,

            "error": str(e)

        }


# =========================================================
# GET SINGLE DOCUMENT
# =========================================================

@app.get("/api/documents/{document_id}")
def get_document(document_id: int):

    try:

        connection = get_db_connection()

        cursor = connection.cursor()


        cursor.execute(
            """
            SELECT *

            FROM documents

            WHERE id = ?
            """,

            (document_id,)
        )


        document = cursor.fetchone()

        connection.close()


        if not document:

            raise HTTPException(
                status_code=404,
                detail="Document not found."
            )


        return {

            "success": True,

            "document": document_to_dict(
                document
            )

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "GET DOCUMENT ERROR:",
            str(e)
        )

        return {

            "success": False,

            "error": str(e)

        }


# =========================================================
# UPDATE DOCUMENT
# =========================================================

@app.put("/api/documents/{document_id}")
def update_document(

    document_id: int,

    document_data: DocumentUpdate

):

    try:

        connection = get_db_connection()

        cursor = connection.cursor()


        # -----------------------------------------
        # Check document
        # -----------------------------------------

        cursor.execute(
            """
            SELECT *

            FROM documents

            WHERE id = ?
            """,

            (document_id,)
        )


        existing = cursor.fetchone()


        if not existing:

            connection.close()

            raise HTTPException(
                status_code=404,
                detail="Document not found."
            )


        # -----------------------------------------
        # Keep old values when not provided
        # -----------------------------------------

        title = (
            document_data.title
            if document_data.title is not None
            else existing["title"]
        )


        text = (
            document_data.text
            if document_data.text is not None
            else existing["text"]
        )


        language = (
            document_data.language
            if document_data.language is not None
            else existing["language"]
        )


        updated_at = datetime.now().isoformat()


        # -----------------------------------------
        # Update
        # -----------------------------------------

        cursor.execute(
            """
            UPDATE documents

            SET

                title = ?,

                text = ?,

                language = ?,

                updated_at = ?

            WHERE id = ?
            """,

            (
                title,
                text,
                language,
                updated_at,
                document_id
            )
        )


        connection.commit()


        # -----------------------------------------
        # Get updated document
        # -----------------------------------------

        cursor.execute(
            """
            SELECT *

            FROM documents

            WHERE id = ?
            """,

            (document_id,)
        )


        updated_document = cursor.fetchone()

        connection.close()


        return {

            "success": True,

            "document": document_to_dict(
                updated_document
            )

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "UPDATE DOCUMENT ERROR:",
            str(e)
        )

        return {

            "success": False,

            "error": str(e)

        }


# =========================================================
# DELETE DOCUMENT
# =========================================================

@app.delete("/api/documents/{document_id}")
def delete_document(document_id: int):

    try:

        connection = get_db_connection()

        cursor = connection.cursor()


        cursor.execute(
            """
            SELECT id

            FROM documents

            WHERE id = ?
            """,

            (document_id,)
        )


        document = cursor.fetchone()


        if not document:

            connection.close()

            raise HTTPException(
                status_code=404,
                detail="Document not found."
            )


        cursor.execute(
            """
            DELETE FROM documents

            WHERE id = ?
            """,

            (document_id,)
        )


        connection.commit()

        connection.close()


        return {

            "success": True,

            "message": "Document deleted successfully."

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "DELETE DOCUMENT ERROR:",
            str(e)
        )

        return {

            "success": False,

            "error": str(e)

        }