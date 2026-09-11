package com.intellihirex.backend.controller;

import com.intellihirex.backend.service.AiServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiServiceClient aiServiceClient;

    @PostMapping("/check-fake-job")
    public ResponseEntity<?> checkFakeJob(@RequestBody Map<String, String> request) {
        String title = request.getOrDefault("title", "");
        String company = request.getOrDefault("company", "");
        String description = request.getOrDefault("description", "");
        String requirements = request.getOrDefault("requirements", "");

        Map<String, Object> result = aiServiceClient.analyzeFakeJob(title, company, description, requirements);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/calculate-ats")
    public ResponseEntity<?> calculateAts(@RequestBody Map<String, String> request) {
        String resumeText = request.getOrDefault("resume_text", "");
        String jobDescription = request.getOrDefault("job_description", "");

        Map<String, Object> result = aiServiceClient.calculateAtsScore(resumeText, jobDescription);
        return ResponseEntity.ok(result);
    }
}
