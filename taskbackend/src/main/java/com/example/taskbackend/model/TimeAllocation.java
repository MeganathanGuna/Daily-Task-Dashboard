package com.example.taskbackend.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity
@Table(name = "time-details")
public class TimeAllocation {
    @Id
    @GeneratedValue
    private Long id;
    private String projectName;
    private String taskName;
    private LocalDate date;
    private double hours;
    @Column(name = "created_by")
    private String createdBy;  // <-- renamed
    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getProjectName() {
        return projectName;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    public String getTaskName() {
        return taskName;
    }
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public double getHours() {
        return hours;
    }
    public void setHours(double hours) {
        this.hours = hours;
    }
    public String getCreatedBy() {
        return createdBy;
    }
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}

