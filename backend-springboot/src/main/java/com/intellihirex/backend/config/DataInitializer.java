package com.intellihirex.backend.config;

import com.intellihirex.backend.entity.JobApplication;
import com.intellihirex.backend.entity.JobPosting;
import com.intellihirex.backend.entity.Role;
import com.intellihirex.backend.entity.User;
import com.intellihirex.backend.repository.JobApplicationRepository;
import com.intellihirex.backend.repository.JobPostingRepository;
import com.intellihirex.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin User if not exists
        if (!userRepository.existsByEmail("admin@intellihirex.com")) {
            User admin = new User(
                    "admin@intellihirex.com",
                    passwordEncoder.encode("admin123"),
                    "System Admin",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
            System.out.println(">>> Pre-seeded Default Admin User: admin@intellihirex.com / admin123");
        }

        // 2. Seed Demo Candidate User if not exists
        if (!userRepository.existsByEmail("user@intellihirex.com")) {
            User demoUser = new User(
                    "user@intellihirex.com",
                    passwordEncoder.encode("user123"),
                    "Demo Candidate",
                    Role.ROLE_USER
            );
            userRepository.save(demoUser);
            System.out.println(">>> Pre-seeded Default Candidate User: user@intellihirex.com / user123");
        }

        // 3. Seed / Update Recruiter User
        User recruiter = userRepository.findByEmail("recruiter@intellihirex.com").orElse(null);
        if (recruiter == null) {
            recruiter = new User(
                    "recruiter@intellihirex.com",
                    passwordEncoder.encode("recruiter123"),
                    "Recruiter",
                    Role.ROLE_EMPLOYER
            );
        } else {
            recruiter.setFullName("Recruiter");
            recruiter.setRole(Role.ROLE_EMPLOYER);
        }
        userRepository.save(recruiter);
        System.out.println(">>> Pre-seeded Default Recruiter User: recruiter@intellihirex.com / recruiter123");

        // 4. Seed Sample Jobs if repository is empty
        if (jobPostingRepository.count() == 0) {
            JobPosting legitJob = new JobPosting();
            legitJob.setTitle("Senior Java Backend Engineer");
            legitJob.setCompany("TechCorp Solutions");
            legitJob.setDescription("Looking for an experienced Java Backend Engineer proficient in Spring Boot, Microservices, and SQL database architecture.");
            legitJob.setRequirements("BS in CS, 3+ years experience with Spring Boot, REST APIs, and Docker.");
            legitJob.setLocation("Bangalore, India (Hybrid)");
            legitJob.setSalaryRange("$100,000 - $130,000");
            legitJob.setJobType("Full-time");
            legitJob.setFakeJobRiskScore(12.5);
            legitJob.setRiskLevel("LOW RISK (VERIFIED / LEGIT)");
            legitJob.setIsFake(false);
            legitJob.setPostedByEmail("admin@intellihirex.com");
            jobPostingRepository.save(legitJob);

            JobPosting fakeJob = new JobPosting();
            fakeJob.setTitle("Work from Home Data Entry Clerk - Earn $1000/day");
            fakeJob.setCompany("Global Cash Transfer Ltd");
            fakeJob.setDescription("Earn $1000 daily from home! Must process wire transfers. Pay $50 registration fee upfront via Western Union.");
            fakeJob.setRequirements("No experience required. Must respond immediately on WhatsApp.");
            fakeJob.setLocation("Remote");
            fakeJob.setSalaryRange("$5,000 / week");
            fakeJob.setJobType("Part-time");
            fakeJob.setFakeJobRiskScore(89.0);
            fakeJob.setRiskLevel("HIGH RISK (LIKELY FAKE)");
            fakeJob.setIsFake(true);
            fakeJob.setPostedByEmail("scammer@fake.com");
            jobPostingRepository.save(fakeJob);

            System.out.println(">>> Pre-seeded Sample Job Postings in Database");
        }

        // 5. Seed Sample Applications if repository is empty
        if (applicationRepository.count() == 0 && jobPostingRepository.count() > 0) {
            JobPosting job = jobPostingRepository.findAll().get(0);
            JobApplication app1 = new JobApplication(
                    job.getId(),
                    job.getTitle(),
                    job.getCompany(),
                    "user@intellihirex.com",
                    "Demo Candidate",
                    88.5,
                    "Java, Spring Boot, SQL, Microservices, REST API"
            );
            app1.setStatus("APPLIED");
            applicationRepository.save(app1);

            JobApplication app2 = new JobApplication(
                    job.getId(),
                    job.getTitle(),
                    job.getCompany(),
                    "ananya.sharma@example.com",
                    "Ananya Sharma",
                    82.0,
                    "Java, Spring Boot, React, SQL"
            );
            app2.setStatus("APPLIED");
            applicationRepository.save(app2);

            System.out.println(">>> Pre-seeded Sample Job Applications in Database");
        }
    }
}
