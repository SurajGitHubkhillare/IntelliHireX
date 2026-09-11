from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ai_routes import router as ai_router

app = FastAPI(
    title="IntelliHireX AI Service",
    description="AI Service for Fake Job Detection, Resume Parsing, and ATS Score Calculation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to IntelliHireX AI Service!",
        "status": "online",
        "endpoints": [
            "/api/v1/predict-fake-job",
            "/api/v1/parse-resume",
            "/api/v1/calculate-ats-score"
        ]
    }

