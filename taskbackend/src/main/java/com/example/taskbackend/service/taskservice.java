package com.example.taskbackend.service;

import com.example.taskbackend.model.task;
import com.example.taskbackend.repository.taskrepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class taskservice {
    private final taskrepo repo;

    public taskservice(taskrepo repo) {
        this.repo = repo;
    }

    public List<task> getAllTasks() {
        return repo.findAll();
    }

    public Optional<task> getTaskById(Long id) {
        return repo.findById(id);
    }

    public task createTask(task task) {
        return repo.save(task);
    }

    public task updateTask(Long id, task updated) {
        return repo.findById(id).map(existing -> {
            existing.setAssignedDate(updated.getAssignedDate());
            existing.setProjectTitle(updated.getProjectTitle());
            existing.setAssignedTo(updated.getAssignedTo());
            existing.setRole(updated.getRole());
            existing.setStatus(updated.getStatus());
            existing.setRemarks(updated.getRemarks());
            existing.setEndDate(updated.getEndDate());
            existing.setProjectName(updated.getProjectName());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Long id) {
        repo.deleteById(id);
    }
}