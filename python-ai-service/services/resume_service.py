import re
import io
import docx
import fitz  # PyMuPDF

class ResumeService:
    def __init__(self):
        self.common_skills = [
            "python", "java", "javascript", "react", "node.js", "express", "spring boot", "sql", "mysql",
            "postgresql", "mongodb", "aws", "docker", "kubernetes", "git", "ci/cd", "html", "css", "tailwind",
            "rest api", "graphql", "microservices", "machine learning", "deep learning", "pandas", "numpy",
            "scikit-learn", "tensorflow", "pytorch", "fastapi", "typescript", "c++", "c#", ".net", "kafka"
        ]

    def extract_text_from_file(self, file_bytes: bytes, filename: str) -> str:
        filename_lower = filename.lower()
        extracted_text = ""

        try:
            if filename_lower.endswith(".pdf"):
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                for page in doc:
                    extracted_text += page.get_text() + "\n"
            elif filename_lower.endswith(".docx"):
                doc = docx.Document(io.BytesIO(file_bytes))
                for paragraph in doc.paragraphs:
                    extracted_text += paragraph.text + "\n"
            else:
                extracted_text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            print(f"Error extracting text from file {filename}: {e}")
            extracted_text = file_bytes.decode("utf-8", errors="ignore")

        return extracted_text.strip()

    def parse_resume(self, text: str) -> dict:
        text_lower = text.lower()
        
        # Extract email
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        email = email_match.group(0) if email_match else "Not found"
        
        # Extract phone number
        phone_match = re.search(r'(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}', text)
        phone = phone_match.group(0) if phone_match else "Not found"

        # Detect skills
        detected_skills = []
        for skill in self.common_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                detected_skills.append(skill.capitalize())

        # Simple education detector
        education = []
        if "bachelor" in text_lower or "b.tech" in text_lower or "b.e" in text_lower or "bs" in text_lower:
            education.append("Bachelor's Degree")
        if "master" in text_lower or "m.tech" in text_lower or "ms" in text_lower or "mca" in text_lower:
            education.append("Master's Degree")
        if "phd" in text_lower or "doctorate" in text_lower:
            education.append("Doctorate / PhD")

        return {
            "email": email,
            "phone": phone,
            "skills": list(set(detected_skills)),
            "education": education if education else ["Degree listed in resume"],
            "character_count": len(text)
        }

    def calculate_ats_score(self, resume_text: str, job_description: str) -> dict:
        parsed_resume = self.parse_resume(resume_text)
        resume_skills = set([s.lower() for s in parsed_resume["skills"]])

        job_desc_lower = job_description.lower()
        required_skills = set()
        for skill in self.common_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', job_desc_lower):
                required_skills.add(skill.lower())

        if not required_skills:
            words = set(re.findall(r'\b[a-z]{4,}\b', job_desc_lower))
            matched_words = words.intersection(set(re.findall(r'\b[a-z]{4,}\b', resume_text.lower())))
            ats_score = round(min(100, (len(matched_words) / max(len(words), 1)) * 100 * 2), 2)
            matched_skills = list(matched_words)[:10]
            missing_skills = []
        else:
            matched_skills = list(resume_skills.intersection(required_skills))
            missing_skills = list(required_skills - resume_skills)
            
            skill_match_ratio = len(matched_skills) / len(required_skills) if required_skills else 1.0
            ats_score = round(skill_match_ratio * 100, 2)

        formatting_tips = []
        if len(resume_text) < 300:
            formatting_tips.append("Resume length is short. Add more detailed project descriptions and achievements.")
        if parsed_resume["email"] == "Not found":
            formatting_tips.append("Include a clear email address at the top of your resume.")
        if not missing_skills:
            formatting_tips.append("Excellent keyword coverage! Quantify achievements with metrics (e.g. reduced latency by 35%).")

        return {
            "ats_score": ats_score,
            "matched_skills": [s.capitalize() for s in matched_skills],
            "missing_skills": [s.capitalize() for s in missing_skills],
            "parsed_resume": parsed_resume,
            "formatting_tips": formatting_tips
        }

resume_service = ResumeService()
