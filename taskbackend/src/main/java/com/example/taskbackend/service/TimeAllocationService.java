package com.example.taskbackend.service;
import com.example.taskbackend.model.TimeAllocation;
import com.example.taskbackend.repository.TimeAllocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class TimeAllocationService {
    @Autowired
    private TimeAllocationRepository repository;
    public List<TimeAllocation> getAll() {
        return repository.findAll();
    }
    public Optional<TimeAllocation> getById(Long id) {
        return repository.findById(id);
    }
    public TimeAllocation create(TimeAllocation timeAllocation) {
        return repository.save(timeAllocation);
    }
    public TimeAllocation update(Long id, TimeAllocation updated) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setProjectName(updated.getProjectName());
                    existing.setTaskName(updated.getTaskName());
                    existing.setDate(updated.getDate());
                    existing.setHours(updated.getHours());
                    existing.setCreatedBy(updated.getCreatedBy());
                    return repository.save(existing);
                })
                .orElse(null);
    }
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
