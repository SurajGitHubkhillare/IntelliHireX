-- Initial Seed Data for IntelliHireX

INSERT INTO users (email, password, full_name, role) VALUES 
('admin@intellihirex.com', '$2a$10$e8WqE1ePzB1R.u1m9Q5j.O9hR5KzR7t5F.v3e1L4O0m.8w6Y7g1.', 'System Admin', 'ROLE_ADMIN'),
('employer@techcorp.com', '$2a$10$e8WqE1ePzB1R.u1m9Q5j.O9hR5KzR7t5F.v3e1L4O0m.8w6Y7g1.', 'TechCorp Recruiter', 'ROLE_EMPLOYER'),
('candidate@gmail.com', '$2a$10$e8WqE1ePzB1R.u1m9Q5j.O9hR5KzR7t5F.v3e1L4O0m.8w6Y7g1.', 'Suraj Khillare', 'ROLE_USER');

INSERT INTO job_postings (title, company, description, requirements, location, salary_range, job_type, fake_job_risk_score, risk_level, is_fake, posted_by_email) VALUES
('Senior Java Microservices Backend Developer', 'TechCorp Solutions', 'We are seeking an experienced Java developer to build microservices using Spring Boot, Kafka, and PostgreSQL.', 'BS in Computer Science, 3+ years experience with Spring Boot, SQL, and Docker.', 'Bangalore, India (Hybrid)', '$100,000 - $130,000', 'Full-time', 12.5, 'LOW RISK (VERIFIED)', FALSE, 'employer@techcorp.com'),
('Work from Home Data Entry Assistant', 'Global Money Transfer Ltd', 'Earn $1000 daily from home! Must have active bank account to process wire transfers. Send $50 registration fee via Western Union.', 'No experience required. Must respond immediately on WhatsApp.', 'Remote', '$5,000 / week', 'Part-time', 89.0, 'HIGH RISK (LIKELY FAKE)', TRUE, 'scammer@fake.com'),
('AI / ML Software Engineer', 'DataMind AI Labs', 'Develop scalable machine learning pipelines with Python FastAPI, PyTorch, and Kubernetes.', 'Master degree in CS, proficiency in Python, scikit-learn, and MLOps.', 'Hyderabad, India (Remote)', '$110,000 - $140,000', 'Full-time', 10.0, 'LOW RISK (VERIFIED)', FALSE, 'hr@datamind.ai');
