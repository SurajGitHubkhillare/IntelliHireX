package com.intellihirex.backend.repository;

import com.intellihirex.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicantEmailOrderByAppliedAtDesc(String email);
    List<JobApplication> findByJobIdOrderByAtsScoreDesc(Long jobId);
    List<JobApplication> findAllByOrderByAtsScoreDesc();
    List<JobApplication> findAllByOrderByAppliedAtDesc();
}
