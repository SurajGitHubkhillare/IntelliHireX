package com.intellihirex.backend.repository;

import com.intellihirex.backend.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByIsFakeFalseOrderByCreatedAtDesc();
    List<JobPosting> findByPostedByEmail(String email);
}
