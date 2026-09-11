package com.intellihirex.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jobId;

    private String jobTitle;
    private String company;

    @Column(nullable = false)
    private String applicantEmail;

    private String applicantName;

    private Double atsScore;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    private String status; // APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED

    private LocalDateTime appliedAt;

    public JobApplication() {
        this.appliedAt = LocalDateTime.now();
        this.status = "APPLIED";
    }

    public JobApplication(Long jobId, String jobTitle, String company, String applicantEmail, String applicantName, Double atsScore, String matchedSkills) {
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.applicantEmail = applicantEmail;
        this.applicantName = applicantName;
        this.atsScore = atsScore;
        this.matchedSkills = matchedSkills;
        this.status = "APPLIED";
        this.appliedAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public Double getAtsScore() { return atsScore; }
    public void setAtsScore(Double atsScore) { this.atsScore = atsScore; }

    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
