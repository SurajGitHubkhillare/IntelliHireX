from services.fake_job_service import fake_job_service
from services.resume_service import resume_service

print("Testing Fake Job Service:")
legit_job = {
    "title": "Senior Java Backend Developer",
    "company": "TechCorp Solutions",
    "description": "Looking for a Java developer with 5+ years experience in Spring Boot, Microservices, and SQL.",
    "requirements": "BS in Computer Science. Strong communication skills.",
    "has_company_logo": 1
}
res_legit = fake_job_service.analyze_job(legit_job)
print("Legit Job Analysis:", res_legit)

fake_job = {
    "title": "Work from Home Data Entry Clerk - Earn $5000/week",
    "company": "Quick Cash Solutions",
    "description": "Earn $1000 daily. Must pay $50 upfront fee for training kit. Wire transfer required. Contact via WhatsApp.",
    "requirements": "Must have bank account to process wire transfers.",
    "has_company_logo": 0
}
res_fake = fake_job_service.analyze_job(fake_job)
print("Fake Job Analysis:", res_fake)

print("\nTesting ATS Resume Service:")
resume_text = "Experienced Senior Java Developer with expertise in Spring Boot, React, SQL, REST APIs, Microservices, and Docker. Bachelor's degree in CS. Contact: dev@example.com, Phone: 555-123-4567"
job_desc = "Seeking Java Developer proficient in Spring Boot, React, SQL, Kubernetes, and AWS."
ats_res = resume_service.calculate_ats_score(resume_text, job_desc)
print("ATS Score Result:", ats_res)
