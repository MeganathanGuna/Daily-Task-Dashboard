package com.example.taskbackend.service;

import com.example.taskbackend.model.Project;
import com.example.taskbackend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final ProjectRepository repo;

    public ProjectService(ProjectRepository repo) {
        this.repo = repo;
    }

    public List<Project> getAllProjects() {
        return repo.findAll();
    }

    // ✅ Add missing method
    public Optional<Project> getProjectById(Long id) {
        return repo.findById(id);
    }

    public Project createProject(Project project) {
        if (project.getAccount() != null) {
            project.setAccount(project.getAccount()); // ensures account is set
        }
        return repo.save(project);
    }

    public Project updateProject(Long id, Project updated) {
        return repo.findById(id).map(existing -> {
            existing.setAssignedDate(updated.getAssignedDate());
            existing.setProjectName(updated.getProjectName());
            existing.setPmName(updated.getPmName());
            existing.setStatus(updated.getStatus());
            existing.setRemarks(updated.getRemarks());

            if (updated.getAccount() != null) {
                existing.setAccount(updated.getAccount());
            }

            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public void deleteProject(Long id) {
        repo.deleteById(id);
    }
}
