from fastapi import FastAPI, Form, File, UploadFile
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import spacy
import matplotlib.pyplot as plt
import io
import base64
from typing import List

# Initialize the FastAPI app
app = FastAPI()

# Allow CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/corporationForm"],  # Your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store uploaded files
UPLOAD_DIR = "./uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Load a SpaCy model for NLP (for extracting skills)
nlp = spacy.load("en_core_web_sm")

# A simple list of skills (you can expand this list or use a more advanced method)
available_skills = ["Python", "JavaScript", "React", "Data Science", "Machine Learning", "SQL"]

def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from the given text."""
    doc = nlp(text)
    extracted_skills = [token.text for token in doc if token.text in available_skills]
    return extracted_skills

def calculate_skill_gap(cv_skills: List[str], job_skills: List[str]) -> List[str]:
    """Calculate the gap between the CV skills and job description skills."""
    return [skill for skill in job_skills if skill not in cv_skills]

def generate_gap_graph(gap: List[str]) -> str:
    """Generate a graph of the skill gap and return it as a base64 string."""
    # Create a bar chart for the skill gap
    plt.figure(figsize=(10, 5))
    plt.bar(gap, [1] * len(gap))  # Just a simple count of each missing skill
    plt.title("Skill Gap")
    plt.xlabel("Skills")
    plt.ylabel("Gap")

    # Save the plot to a BytesIO object and encode it to base64
    img_stream = io.BytesIO()
    plt.savefig(img_stream, format="png")
    img_stream.seek(0)
    img_base64 = base64.b64encode(img_stream.read()).decode("utf-8")
    plt.close()
    
    return img_base64

@app.post("/calculate_gap")
async def calculate_gap(
    companyName: str = Form(...),
    email: str = Form(...),
    jobDescription: str = Form(...),
    uploadedFile: UploadFile = File(...),
):
    # Save the uploaded file (e.g., CV)
    file_location = os.path.join(UPLOAD_DIR, uploadedFile.filename)
    with open(file_location, "wb") as file:
        file.write(await uploadedFile.read())
    
    # Extract skills from the job description and CV (for simplicity, assume CV is a text file)
    with open('uploads/Ahmad.pdf', 'r') as file:
        cv_text = file.read()

    
    job_skills = extract_skills_from_text(jobDescription)
    cv_skills = extract_skills_from_text(cv_text)

    # Calculate the gap
    skill_gap = calculate_skill_gap(cv_skills, job_skills)

    # Generate the graph
    gap_graph = generate_gap_graph(skill_gap)

    # Return the response with gap and graph
    return JSONResponse(
        content={
            "message": "Form submitted successfully!",
            "gap": skill_gap,
            "graph": gap_graph,
        }
    )
