import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService, Task, Project } from 'src/app/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() existingData: Task | null = null;
  @Input() refresh!: () => void;
  @Input() resetEdit!: () => void;
  @Input() selectedProject: string | null = null;

  taskForm: FormGroup;
  editId: number | null = null;
  userName: string = '';
  allUsers: { name: string }[] = [];
  allProjects: Project[] = [];  // 🔹 store projects list

  predefinedRoles = [
    'PM',
    'Cloud Engineer',
    'Architect',
    'DevOps Engineer',
    'AI Engineer',
    'Developer'
  ];

  constructor(
    private fb: FormBuilder,
    private service: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      assignedDate: ['', Validators.required],
      projectName: ['', Validators.required],
      projectTitle: ['', Validators.required],
      assignedTo: ['', Validators.required], // Created by
      role: ['', Validators.required],       // Role
      roleUser: ['', Validators.required],   // Assigned user
      status: ['', Validators.required],
      remarks: [''],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || '';

    // Default Created By = logged-in user
    this.taskForm.patchValue({
      assignedTo: this.userName,
      roleUser: this.userName
    });

    // Fetch users for dropdown
    this.service.getAllUsers().subscribe((data: any[]) => {
      this.allUsers = data;
    });

    // 🔹 Fetch projects for dropdown
    this.service.getProjects().subscribe((projects: Project[]) => {
      this.allProjects = projects;
    });
  }

  ngOnChanges(): void {
    if (this.selectedProject) {
      this.taskForm.patchValue({
        projectName: this.selectedProject
      });
      this.taskForm.get('projectName')?.disable(); // cannot edit project name when selected
    }

    if (this.existingData) {
      this.editId = this.existingData.id!;
      const [role, roleUser] = this.existingData.role.split(' - ');
      this.taskForm.patchValue({
        ...this.existingData,
        role: role?.trim(),
        roleUser: roleUser?.trim()
      });
    }
  }

  onCancel(): void {
    if (this.resetEdit) {
      this.resetEdit();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  submit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const finalRole = `${this.taskForm.value.role} - ${this.taskForm.value.roleUser}`;
    const formData: Task = {
      ...this.taskForm.getRawValue(),
      role: finalRole,
      createdBy: this.userName
    };

    if (this.editId) {
      // update
      this.service.updateTask(this.editId, formData).subscribe(() => {
        alert('✅ Task updated');
        this.resetEdit();
        this.refresh();
      });
    } else {
      // create
      this.service.createTask(formData).subscribe(() => {
        alert('✅ Task added');
        this.taskForm.reset();
        this.taskForm.patchValue({
          assignedTo: this.userName,
          roleUser: this.userName
        });
        this.refresh();
      });
    }
  }
}
