package com.intellihirex.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiServiceClient {

    @Value("${ai.service.url:http://localhost:8000/api/v1}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> analyzeFakeJob(String title, String company, String description, String requirements) {
        try {
            String url = aiServiceUrl + "/predict-fake-job";
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("title", title);
            requestBody.put("company", company);
            requestBody.put("description", description);
            requestBody.put("requirements", requirements);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

            if (response != null && response.containsKey("data")) {
                return (Map<String, Object>) response.get("data");
            }
        } catch (Exception e) {
            System.err.println("Failed to connect to Python AI microservice: " + e.getMessage());
        }

        // Fallback default calculation if AI microservice is offline
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("risk_score", 15.0);
        fallback.put("risk_level", "LOW RISK (FALLBACK)");
        fallback.put("is_fake", false);
        return fallback;
    }

    public Map<String, Object> calculateAtsScore(String resumeText, String jobDescription) {
        try {
            String url = aiServiceUrl + "/calculate-ats-score";

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("resume_text", resumeText);
            requestBody.put("job_description", jobDescription);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

            if (response != null && response.containsKey("data")) {
                return (Map<String, Object>) response.get("data");
            }
        } catch (Exception e) {
            System.err.println("Failed to connect to Python AI microservice for ATS calculation: " + e.getMessage());
        }

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("ats_score", 70.0);
        fallback.put("matched_skills", java.util.List.of("Java", "SQL", "Communication"));
        fallback.put("missing_skills", java.util.List.of("Kubernetes", "AWS"));
        return fallback;
    }
}
