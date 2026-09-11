# IntelliHireX Architecture & API Documentation

IntelliHireX is an AI-powered Recruitment & Job Platform featuring **Fake Job Detection**, **AI Resume Parsing**, **ATS Compatibility Scoring**, and **Verified Job Postings**.

---

## 1. System Architecture Overview

```
+---------------------------------------------------------------------------------+
|                               React Frontend                                    |
|                      (Vite + React 19 + Tailwind CSS)                           |
|       [Dashboard]   [Fake Job Detector]   [ATS Checker]   [Job Board]           |
+---------------------------------------+-----------------------------------------+
                                        |
                                        | HTTP REST Requests
                                        v
+---------------------------------------+-----------------------------------------+
|                          Spring Boot Backend Service                            |
|                            (Java 17 / Spring Security)                          |
|    - Authentication & JWT Token Validation                                      |
|    - Job Postings & Application Persistence                                     |
|    - H2 / MS SQL Server Database Layer                                          |
+---------------------------------------+-----------------------------------------+
                                        |
                                        | Inter-Service REST API Call
                                        v
+---------------------------------------+-----------------------------------------+
|                           Python AI Microservice                                |
|                           (FastAPI + scikit-learn)                              |
|    - Fake Job Detection (TF-IDF + Random Forest / XGBoost ML Model)             |
|    - Rule-based Red Flag Safety Checker (Upfront Fees, Wire Transfers)           |
|    - Resume NLP Parser & ATS Keyword Gap Calculator                             |
+---------------------------------------------------------------------------------+
```

---

## 2. Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Axios, React Router v7.
- **Backend**: Java 17, Spring Boot 3/4, Spring Security, JWT (io.jsonwebtoken), Spring Data JPA, H2 Database / MS SQL Server.
- **AI Microservice**: Python 3.11+, FastAPI, Uvicorn, scikit-learn, joblib, pandas, numpy, re (regular expressions).
- **Machine Learning Models**:
  - `fake_job_detector.joblib` (Random Forest / XGBoost classifier)
  - `tfidf_vectorizer.joblib` (TF-IDF 2,500 feature n-gram vectorizer)

---

## 3. Microservice API Reference

### Python AI Microservice (`http://localhost:8000`)

#### 1. Predict Fake Job Risk
- **Endpoint**: `POST /api/v1/predict-fake-job`
- **Request Body**:
```json
{
  "title": "Work from Home Data Entry Clerk",
  "company": "Global Cash Transfer",
  "description": "Earn $1000 daily. Send $50 registration fee via Western Union.",
  "requirements": "Must have bank account to process wire transfers.",
  "salary_range": "$5,000 / week",
  "has_company_logo": 0
}
```
- **Response**:
```json
{
  "status": "success",
  "data": {
    "fraud_probability": 65.0,
    "risk_score": 79.0,
    "risk_level": "HIGH RISK (LIKELY FAKE)",
    "is_fake": true,
    "red_flags": [
      "Mentions wire transfer or money transfer services.",
      "Requires upfront payment or registration fee.",
      "Unrealistic high income promises for minimal work."
    ],
    "recommendation": "Do not pay any upfront fees or share bank details."
  }
}
```

#### 2. Calculate ATS Resume Match Score
- **Endpoint**: `POST /api/v1/calculate-ats-score`
- **Request Body**:
```json
{
  "resume_text": "Experienced Java Developer with Spring Boot, React, SQL, and Docker...",
  "job_description": "Seeking Java Developer proficient in Spring Boot, React, SQL, AWS..."
}
```
- **Response**:
```json
{
  "status": "success",
  "data": {
    "ats_score": 75.0,
    "matched_skills": ["Java", "Spring Boot", "React", "Sql"],
    "missing_skills": ["Aws"],
    "parsed_resume": {
      "email": "dev@example.com",
      "phone": "+91 9876543210",
      "skills": ["Java", "Spring Boot", "React", "Sql", "Docker"],
      "education": ["Bachelor's Degree"]
    },
    "formatting_tips": [
      "Quantify achievements with metrics and bullet points."
    ]
  }
}
```

---

### Spring Boot Backend API (`http://localhost:8080`)

- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login & JWT issuance
- `GET /api/jobs` - Retrieve all job listings
- `POST /api/jobs` - Create a job posting (automatically triggers Python AI risk evaluation)
- `POST /api/ai/check-fake-job` - Proxy for Python fake job scan
- `POST /api/ai/calculate-ats` - Proxy for ATS resume calculation

---

## 4. How to Run the Project Locally

### 1. Python AI Service
```bash
cd python-ai-service
pip install -r requirements.txt
python services/train_model.py
uvicorn main:app --reload --port 8000
```

### 2. Spring Boot Backend
```bash
cd backend-springboot
.\mvnw.cmd spring-boot:run
```

### 3. React Frontend
```bash
cd frontend-react
npm run dev
```
Access the web application at `http://localhost:5173`.
