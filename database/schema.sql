-- IntelliHireX Database Schema Definition
-- Suitable for SQL Server, PostgreSQL, MySQL, and H2 Database

-- Users Table
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job Postings Table
CREATE TABLE job_postings (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    job_type VARCHAR(50) DEFAULT 'Full-time',
    fake_job_risk_score DOUBLE PRECISION DEFAULT 0.0,
    risk_level VARCHAR(50) DEFAULT 'LOW RISK',
    is_fake BOOLEAN DEFAULT FALSE,
    posted_by_email VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications Table
CREATE TABLE job_applications (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    job_id BIGINT NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    ats_score DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'APPLIED',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
);
