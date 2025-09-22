package com.example.taskbackend.repository;
import com.example.taskbackend.model.TimeAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
public interface TimeAllocationRepository extends JpaRepository<TimeAllocation, Long> {
    List<TimeAllocation> findByCreatedBy(String createdBy);
    List<TimeAllocation> findByProjectName(String projectName);
    List<TimeAllocation> findByDate(LocalDate date);
}
