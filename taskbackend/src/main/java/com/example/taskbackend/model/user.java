package com.example.taskbackend.model;
import jakarta.persistence.*;
@Entity
public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "email", unique = true)
    private String email;
    private String password;
    private String name;
    private String role;
    private boolean pm; // ✅ New field for Project Manager toggle
    protected user() {}
    public user(String email, String password, String name, String role, boolean pm) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.pm = pm;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isPm() { return pm; }
    public void setPm(boolean pm) { this.pm = pm; }
}
