package com.example.taskbackend.repository;
import com.example.taskbackend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
