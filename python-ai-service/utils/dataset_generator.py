import pandas as pd
import random
import os

def generate_job_dataset(num_samples=1200, output_path="datasets/fake_job_postings.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    real_titles = [
        "Software Engineer", "Senior Full Stack Developer", "Data Scientist", "Java Backend Developer",
        "Frontend React Developer", "DevOps Engineer", "Product Manager", "UI/UX Designer",
        "Cloud Solutions Architect", "QA Automation Engineer", "Machine Learning Engineer", "Cybersecurity Analyst"
    ]
    
    scam_titles = [
        "Work from Home Data Entry Clerk", "Earn $5000/week Online Assistant", "Immediate Hiring Package Handler",
        "Remote Financial Assistant - High Pay", "Easy Copy Paste Job - Daily Payment", "Cryptocurrency Investment Rep",
        "VIP Personal Assistant - No Experience Needed", "Urgent Wire Transfer Manager", "Home Assembly Worker"
    ]
    
    real_companies = [
        "TechCorp Solutions", "CloudScale Systems", "InnoSoft Labs", "DataMind AI",
        "Apex Digital", "NextGen Enterprise", "CyberShield Inc", "Global Logic Technologies"
    ]
    
    scam_companies = [
        "Global Money Transfer Ltd", "Quick Cash Solutions", "Anonymous Holdings",
        "WorkAtHome Direct", "International Wealth Group", "Crypto Earnings Co"
    ]
    
    real_descriptions = [
        "We are looking for an experienced software developer to join our core engineering team. You will build scalable microservices, collaborate with product managers, and optimize database performance.",
        "Seeking a passionate frontend developer proficient in React, TypeScript, and modern CSS. You will build intuitive user interfaces and work closely with backend APIs.",
        "Join our data science team to build machine learning models and predictive pipelines. Requirements include Python, scikit-learn, SQL, and strong statistical background.",
        "High-growth tech company looking for a DevOps engineer with experience in AWS, Kubernetes, Terraform, and CI/CD pipelines. Competitive salary and full benefits provided."
    ]
    
    scam_descriptions = [
        "Earn up to $1000 daily from home! No experience required. Must have a bank account to process payments. Contact via Telegram or WhatsApp immediately.",
        "Urgent requirement for online assistant. Job involves receiving wire transfers and forwarding funds via Western Union or Crypto. Earn 10% commission on every transaction.",
        "Work 2 hours a day and earn $5000 a week! Registration fee of $50 required for processing laptop and training kit. Guaranteed earnings from day one.",
        "Immediate opening for package reshipper. We send electronics to your address, you repackage and forward them. Must provide copy of ID and bank details upfront."
    ]
    
    data = []
    
    for i in range(num_samples):
        is_fraudulent = 1 if random.random() < 0.35 else 0
        
        if is_fraudulent:
            title = random.choice(scam_titles)
            company = random.choice(scam_companies)
            description = random.choice(scam_descriptions)
            requirements = "Must have bank account, WhatsApp active, willing to pay small initial processing fee. No degree needed."
            telecommuting = 1
            has_company_logo = 0 if random.random() < 0.8 else 1
            has_questions = 0 if random.random() < 0.7 else 1
            salary_range = "$3000 - $10000 / month" if random.random() < 0.6 else ""
        else:
            title = random.choice(real_titles)
            company = random.choice(real_companies)
            description = random.choice(real_descriptions)
            requirements = "Bachelor's degree in CS or equivalent experience. 3+ years with Python/Java/React. Strong communication skills."
            telecommuting = random.choice([0, 1])
            has_company_logo = 1 if random.random() < 0.9 else 0
            has_questions = 1 if random.random() < 0.8 else 0
            salary_range = "$80,000 - $120,000" if random.random() < 0.5 else ""
            
        full_text = f"{title} {company} {description} {requirements}"
        
        data.append({
            "job_id": i + 1,
            "title": title,
            "company_profile": company,
            "description": description,
            "requirements": requirements,
            "telecommuting": telecommuting,
            "has_company_logo": has_company_logo,
            "has_questions": has_questions,
            "salary_range": salary_range,
            "full_text": full_text,
            "fraudulent": is_fraudulent
        })
        
    df = pd.DataFrame(data)
    df.to_csv(output_path, index=False)
    print(f"Dataset generated at {output_path} with {len(df)} samples.")
    return output_path

if __name__ == "__main__":
    generate_job_dataset()
