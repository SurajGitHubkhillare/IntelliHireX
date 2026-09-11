from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
from services.fake_job_service import fake_job_service
from services.resume_service import resume_service

router = APIRouter(prefix="/api/v1", tags=["AI Operations"])

class JobCheckRequest(BaseModel):
    title: str
    company: Optional[str] = ""
    description: str
    requirements: Optional[str] = ""
    salary_range: Optional[str] = ""
    has_company_logo: Optional[int] = 1
    # New metadata fraud-signal fields
    verified_profile: Optional[int] = 1
    has_company_website: Optional[int] = 1
    has_recruiter_contact: Optional[int] = 1
    has_salary_info: Optional[int] = 1

class AtsCheckRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/predict-fake-job")
def predict_fake_job(request: JobCheckRequest):
    try:
        result = fake_job_service.analyze_job(request.dict())
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/parse-resume")
def parse_resume(request: dict):
    resume_text = request.get("resume_text", "")
    if not resume_text:
        raise HTTPException(status_code=400, detail="resume_text is required")
    parsed = resume_service.parse_resume(resume_text)
    return {
        "status": "success",
        "data": parsed
    }

@router.post("/calculate-ats-score")
def calculate_ats_score(request: AtsCheckRequest):
    try:
        res = resume_service.calculate_ats_score(request.resume_text, request.job_description)
        return {
            "status": "success",
            "data": res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-resume-file")
async def upload_resume_file(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form("")
):
    try:
        file_bytes = await file.read()
        extracted_text = resume_service.extract_text_from_file(file_bytes, file.filename)
        
        parsed_data = resume_service.parse_resume(extracted_text)
        ats_result = None

        if job_description:
            ats_result = resume_service.calculate_ats_score(extracted_text, job_description)

        return {
            "status": "success",
            "filename": file.filename,
            "extracted_text": extracted_text,
            "parsed_data": parsed_data,
            "ats_result": ats_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
