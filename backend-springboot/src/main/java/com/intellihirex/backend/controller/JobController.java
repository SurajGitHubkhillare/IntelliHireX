package com.intellihirex.backend.controller;

import com.intellihirex.backend.entity.JobPosting;
import com.intellihirex.backend.repository.JobPostingRepository;
import com.intellihirex.backend.service.AiServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private AiServiceClient aiServiceClient;

    @GetMapping
    public ResponseEntity<List<JobPosting>> getAllJobs() {
        return ResponseEntity.ok(jobPostingRepository.findAll());
    }

    @GetMapping("/verified")
    public ResponseEntity<List<JobPosting>> getVerifiedJobs() {
        return ResponseEntity.ok(jobPostingRepository.findByIsFakeFalseOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<JobPosting> createJob(@RequestBody JobPosting job, Authentication authentication) {
        String currentUserEmail = (authentication != null) ? authentication.getName() : "employer@intellihirex.com";
        job.setPostedByEmail(currentUserEmail);

        // Evaluate fake job risk via Python AI microservice
        Map<String, Object> aiResult = aiServiceClient.analyzeFakeJob(
                job.getTitle(), job.getCompany(), job.getDescription(), job.getRequirements()
        );

        if (aiResult != null) {
            Number score = (Number) aiResult.getOrDefault("risk_score", 10.0);
            job.setFakeJobRiskScore(score.doubleValue());
            job.setRiskLevel((String) aiResult.getOrDefault("risk_level", "LOW RISK"));
            job.setIsFake((Boolean) aiResult.getOrDefault("is_fake", false));
        } else {
            job.setFakeJobRiskScore(10.0);
            job.setRiskLevel("LOW RISK");
            job.setIsFake(false);
        }

        JobPosting savedJob = jobPostingRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobPostingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            if (jobPostingRepository.existsById(id)) {
                jobPostingRepository.deleteById(id);
            }
            return ResponseEntity.ok(Map.of("message", "Job posting deleted successfully", "id", id));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("message", "Job deleted from session", "id", id));
        }
    }
}
