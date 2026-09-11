import os
import re
import joblib

class FakeJobService:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self._load_models()

    def _load_models(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "trained_models", "fake_job_detector.joblib")
        vectorizer_path = os.path.join(base_dir, "trained_models", "tfidf_vectorizer.joblib")

        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vectorizer_path)
            print("Successfully loaded Fake Job ML Model and Vectorizer.")
        else:
            print("WARNING: Model files not found. Run training script first.")

    def analyze_job(self, job_data: dict) -> dict:
        title = job_data.get("title", "")
        company = job_data.get("company", "")
        description = job_data.get("description", "")
        requirements = job_data.get("requirements", "")
        
        # Extracted Metadata (Defaults to 1/True to avoid penalizing standard requests missing these fields unintentionally, but honors 0/False)
        has_logo = job_data.get("has_company_logo", 1)
        verified_profile = job_data.get("verified_profile", 1)
        has_company_website = job_data.get("has_company_website", 1)
        has_recruiter_contact = job_data.get("has_recruiter_contact", 1)
        has_salary_info = job_data.get("has_salary_info", 1)
        
        full_text = f"{title} {company} {description} {requirements}"
        
        # Rule-based red flags detection
        red_flags = []
        rule_risk_points = 0
        
        # 1. Metadata Checks (Based on user-defined fraud signals)
        if not verified_profile:
            red_flags.append("No verified company profile.")
            rule_risk_points += 25
        if not has_company_website:
            red_flags.append("No official company website or career page provided.")
            rule_risk_points += 20
        if not has_recruiter_contact:
            red_flags.append("No recruiter contact (email/phone) provided.")
            rule_risk_points += 15
        if not has_logo:
            red_flags.append("Missing official company logo or branding.")
            rule_risk_points += 10
        if not has_salary_info:
            red_flags.append("Salary information is not specified.")
            rule_risk_points += 10

        # 2. Check suspicious keywords in text
        suspicious_keywords = [
            (r"wire transfer|western union|moneygram", "Mentions wire transfer or money transfer services."),
            (r"upfront fee|registration fee|laptop fee|processing fee", "Requires upfront payment or registration fee."),
            (r"earn \$[0-9]+ (daily|per week|a day)", "Unrealistic high income promises for minimal work."),
            (r"contact via whatsapp|telegram|gmail\.com|yahoo\.com", "Uses informal/free communication channels (WhatsApp/Telegram/Gmail)."),
            (r"no experience (needed|required)|easy copy paste", "Suspicious low bar for entry with high compensation claims."),
            (r"package reshipper|forward package", "Known package reshipping scam pattern.")
        ]

        for pattern, flag_msg in suspicious_keywords:
            if re.search(pattern, full_text, re.IGNORECASE):
                red_flags.append(flag_msg)
                rule_risk_points += 25

        # ML Model prediction
        ml_prob = 0.0
        if self.model and self.vectorizer and full_text.strip():
            X_vec = self.vectorizer.transform([full_text])
            ml_prob = float(self.model.predict_proba(X_vec)[0][1])

        # Combined score calculation
        # ML Probability contributes up to 50 points, hard-coded rules can aggressively push score to 100.
        combined_score = (ml_prob * 50) + rule_risk_points
        final_risk_score = round(min(max(combined_score, 0), 100), 2)

        if final_risk_score >= 65:
            risk_level = "HIGH RISK (LIKELY FAKE)"
            is_fake = True
        elif final_risk_score >= 35:
            risk_level = "MODERATE RISK"
            is_fake = False
        else:
            risk_level = "LOW RISK (VERIFIED / LEGIT)"
            is_fake = False

        return {
            "fraud_probability": round(ml_prob * 100, 2),
            "risk_score": final_risk_score,
            "risk_level": risk_level,
            "is_fake": is_fake,
            "red_flags": red_flags,
            "recommendation": "Do not pay any upfront fees or share bank details." if is_fake else "Job listing appears legitimate."
        }

fake_job_service = FakeJobService()
