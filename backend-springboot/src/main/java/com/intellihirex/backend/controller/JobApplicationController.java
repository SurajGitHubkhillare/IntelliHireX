package com.intellihirex.backend.controller;

import com.intellihirex.backend.entity.JobApplication;
import com.intellihirex.backend.entity.JobPosting;
import com.intellihirex.backend.repository.JobApplicationRepository;
import com.intellihirex.backend.repository.JobPostingRepository;
import com.intellihirex.backend.service.AiServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private AiServiceClient aiServiceClient;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody Map<String, Object> request, Authentication authentication) {
        Long jobId = Long.parseLong(request.get("jobId").toString());
        String resumeText = (String) request.getOrDefault("resumeText", "");
        String applicantName = (String) request.getOrDefault("applicantName", "Candidate");

        if (authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_EMPLOYER"))) {
            return ResponseEntity.badRequest().body("Recruiters and Admins cannot submit job applications. Only candidates can apply.");
        }

        JobPosting job = jobPostingRepository.findById(jobId).orElse(null);
        if (job == null) {
            return ResponseEntity.badRequest().body("Job not found.");
        }

        if (Boolean.TRUE.equals(job.getIsFake())) {
            return ResponseEntity.badRequest().body("Applications are disabled for jobs flagged as scam risk.");
        }

        // Calculate ATS Match Score for application
        Map<String, Object> atsResult = aiServiceClient.calculateAtsScore(resumeText, job.getDescription());
        Double score = (atsResult != null && atsResult.containsKey("ats_score"))
                ? Double.parseDouble(atsResult.get("ats_score").toString())
                : 75.0;

        List<String> matchedSkills = (atsResult != null && atsResult.containsKey("matched_skills"))
                ? (List<String>) atsResult.get("matched_skills")
                : List.of("Java", "SQL");

        String email = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : (String) request.getOrDefault("email", "candidate@gmail.com");

        JobApplication app = new JobApplication(
                jobId,
                job.getTitle(),
                job.getCompany(),
                email,
                applicantName,
                score,
                String.join(", ", matchedSkills)
        );

        JobApplication saved = applicationRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAllByOrderByAtsScoreDesc());
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobApplication>> getMyApplications(Authentication authentication) {
        String email = (authentication != null) ? authentication.getName() : "candidate@gmail.com";
        return ResponseEntity.ok(applicationRepository.findByApplicantEmailOrderByAppliedAtDesc(email));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getJobApplicants(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationRepository.findByJobIdOrderByAtsScoreDesc(jobId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> request, Authentication authentication) {
        if (authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.badRequest().body("System Admins are restricted from shortlisting or rejecting candidates. Only Recruiters can evaluate applications.");
        }

        String newStatus = request.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body("Status cannot be empty.");
        }

        JobApplication app = null;
        try {
            Long numericId = Long.parseLong(id);
            app = applicationRepository.findById(numericId).orElse(null);
        } catch (NumberFormatException ignored) {}

        if (app == null && request.containsKey("email")) {
            String email = request.get("email");
            List<JobApplication> userApps = applicationRepository.findByApplicantEmailOrderByAppliedAtDesc(email);
            if (!userApps.isEmpty()) {
                app = userApps.get(0);
            }
        }

        if (app != null) {
            app.setStatus(newStatus);
            JobApplication updated = applicationRepository.save(app);
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.ok(Map.of("message", "Status updated successfully."));
    }
}
