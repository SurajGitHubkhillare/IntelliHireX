package com.intellihirex.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private String location;

    private String salaryRange;

    private String jobType; // Full-time, Remote, Contract

    private Double fakeJobRiskScore; // 0.0 to 100.0

    private String riskLevel; // LOW RISK, MODERATE RISK, HIGH RISK

    private Boolean isFake;

    private String postedByEmail;

    private LocalDateTime createdAt;

    public JobPosting() {
        this.createdAt = LocalDateTime.now();
    }

    public JobPosting(String title, String company, String description, String requirements, String location, String salaryRange, String jobType, String postedByEmail) {
        this.title = title;
        this.company = company;
        this.description = description;
        this.requirements = requirements;
        this.location = location;
        this.salaryRange = salaryRange;
        this.jobType = jobType;
        this.postedByEmail = postedByEmail;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public Double getFakeJobRiskScore() { return fakeJobRiskScore; }
    public void setFakeJobRiskScore(Double fakeJobRiskScore) { this.fakeJobRiskScore = fakeJobRiskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Boolean getIsFake() { return isFake; }
    public void setIsFake(Boolean isFake) { this.isFake = isFake; }

    public String getPostedByEmail() { return postedByEmail; }
    public void setPostedByEmail(String postedByEmail) { this.postedByEmail = postedByEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
