package com.example.taskbackend.controller;
import com.example.taskbackend.model.Project;
import com.example.taskbackend.model.TimeAllocation;
import com.example.taskbackend.service.ProjectService;
import com.example.taskbackend.service.TimeAllocationService;
import com.example.taskbackend.service.userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.taskbackend.model.user;
import com.example.taskbackend.repository.userrepo;
import com.example.taskbackend.service.taskservice;
import com.example.taskbackend.model.task;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class taskcontrol {
    private final taskservice taskService;

    @Autowired
    private userrepo userRepository;

    @Autowired
    private TimeAllocationService timeAllocationService;

    @Autowired
    private userservice userService;

    @Autowired
    private ProjectService projectService;

    public taskcontrol(taskservice taskService) {
        this.taskService = taskService;
    }

    // ====================== USER ROUTES ======================
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody user user) {
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "Request body cannot be null");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            response.put("error", "Email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        userService.registerUser(user);
        response.put("message", "User registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody user user) {
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "Request body cannot be null");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        user foundUser = userService.findByEmail(user.getEmail());
        if (foundUser == null) {
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        if (!user.getPassword().equals(foundUser.getPassword())) {
            response.put("error", "Invalid password");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        response.put("message", "Login successful");
        response.put("email", foundUser.getEmail());
        response.put("password", foundUser.getPassword());
        response.put("name", foundUser.getName());
        response.put("role", foundUser.getRole());
        response.put("pm", String.valueOf(foundUser.isPm())); // ✅ send PM flag
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public List<user> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/pms")
    public List<user> getAllPMs() {
        return userService.getAllPMs();
    }

    // ====================== TASK ROUTES ======================
    @GetMapping
    public List<task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @PostMapping
    public task createTask(@RequestBody task task) {
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public task updateTask(@PathVariable Long id, @RequestBody task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    // ====================== TIME ALLOCATION ROUTES ======================
    @GetMapping("/time/all")
    public List<TimeAllocation> getAllTimeAllocations() {
        return timeAllocationService.getAll();
    }

    @GetMapping("/time/{id}")
    public TimeAllocation getTimeAllocationById(@PathVariable Long id) {
        return timeAllocationService.getById(id).orElse(null);
    }

    @PostMapping("/time")
    public TimeAllocation createTimeAllocation(@RequestBody TimeAllocation timeAllocation) {
        return timeAllocationService.create(timeAllocation);
    }

    @PutMapping("/time/{id}")
    public TimeAllocation updateTimeAllocation(@PathVariable Long id, @RequestBody TimeAllocation timeAllocation) {
        return timeAllocationService.update(id, timeAllocation);
    }

    @DeleteMapping("/time/{id}")
    public void deleteTimeAllocation(@PathVariable Long id) {
        timeAllocationService.delete(id);
    }

    // ====================== PROJECT ROUTES ======================
    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/projects/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @PostMapping("/projects")
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project); // ✅ auto-fills account_name
    }

    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectService.updateProject(id, project); // ✅ auto-fills account_name
    }

    @DeleteMapping("/projects/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
