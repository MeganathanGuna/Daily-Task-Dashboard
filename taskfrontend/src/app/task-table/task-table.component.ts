import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TaskService, Task } from 'src/app/task.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit, OnChanges {
  @Input() projectFilter: string = '';
  @Input() userName: string = '';
  @Input() userFilterEnabled: boolean = false;
  @Input() assignedFilterEnabled: boolean = false;
  @Output() editRequested = new EventEmitter<Task>();

  allTasks: Task[] = [];
  tasks: Task[] = [];
  projectNames: string[] = [];
  selectedProject: string | null = null;
  showActions: boolean = false;
  statusFilter: string[] = ['Open', 'WIP'];
  roleTypeFilterList: string[] = [];
  assigneeFilterList: string[] = [];
  globalSearch: string = '';
  roleTypes: string[] = [];
  roleUsers: string[] = [];
  openDropdown: string | null = null;

  constructor(private service: TaskService) {}

  ngOnInit(): void {
    this.loadProjects(); 
    this.loadTasks();
  }

  loadProjects(): void {
  this.service.getProjects().subscribe(data => {
    // projects are coming from Project Form API
    this.projectNames = data.map(p => p.projectName);
  });
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectFilter'] && !changes['projectFilter'].firstChange) {
      this.applyFilters();
    }
  }

  loadTasks(): void {
    this.service.getTasks().subscribe(data => {
      this.allTasks = data;
      
      this.extractRoleTypes();
      this.extractRoleUsers();
      this.applyFilters();
    });
  }

  extractRoleTypes(): void {
    const set = new Set<string>();
    this.allTasks.forEach(task => {
      const type = task.role?.split('-')[0]?.trim();
      if (type) set.add(type);
    });
    this.roleTypes = Array.from(set);
  }

  extractRoleUsers(): void {
    const set = new Set<string>();
    this.allTasks.forEach(task => {
      const user = this.getAssigneeFromRole(task.role);
      if (user) set.add(user);
    });
    this.roleUsers = Array.from(set);
  }

  toggleDropdown(type: string): void {
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  onCheckboxChange(filterType: string, value: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    let targetArray: string[];
    if (filterType === 'status') targetArray = this.statusFilter;
    else if (filterType === 'role') targetArray = this.roleTypeFilterList;
    else targetArray = this.assigneeFilterList;

    const index = targetArray.indexOf(value);
    if (checked && index === -1) targetArray.push(value);
    else if (!checked && index > -1) targetArray.splice(index, 1);

    this.applyFilters();
  }

  filterByProject(project: string): void {
    this.selectedProject = project;
    this.applyFilters();
  }

  clearProjectFilter(): void {
    this.selectedProject = null;
    this.applyFilters();
  }

  

  applyUserFilter(enableFilter: boolean, currentUser: string): void {
    this.userFilterEnabled = enableFilter;
    this.userName = currentUser;
    this.applyFilters();
  }

  applyAssignedFilter(enableFilter: boolean, currentUser: string): void {
    this.assignedFilterEnabled = enableFilter;
    this.userName = currentUser;
    this.applyFilters();
  }

  // ✅ Extracts assignee name from role like "AI Engineer - MADHI"
  private getAssigneeFromRole(role: string | undefined): string {
    if (!role) return '';
    const parts = role.split('-');
    return parts.length > 1 ? parts[1].trim() : '';
  }

  applyFilters(): void {
    let filtered = [...this.allTasks];

    if (this.selectedProject) {
      filtered = filtered.filter(task => task.projectName === this.selectedProject);
    }
    if (this.statusFilter.length > 0) {
      filtered = filtered.filter(task => this.statusFilter.includes(task.status || ''));
    }
    if (this.roleTypeFilterList.length > 0) {
      filtered = filtered.filter(task =>
        this.roleTypeFilterList.some(role => task.role?.toLowerCase().startsWith(role.toLowerCase()))
      );
    }
    if (this.assigneeFilterList.length > 0) {
      filtered = filtered.filter(task => {
        const assignee = this.getAssigneeFromRole(task.role).toLowerCase();
        return this.assigneeFilterList.some(user => user.toLowerCase() === assignee);
      });
    }
    if (this.globalSearch.trim() !== '') {
      const search = this.globalSearch.toLowerCase();
      filtered = filtered.filter(task =>
        Object.values(task).some(val => val?.toString().toLowerCase().includes(search))
      );
    }

    // ✅ My Tasks toggle (createdBy OR assigned user)
    if (this.userFilterEnabled) {
      this.showActions = true;
      filtered = filtered.filter(task =>
        task.createdBy?.trim().toLowerCase() === this.userName.trim().toLowerCase() ||
        this.getAssigneeFromRole(task.role).toLowerCase() === this.userName.trim().toLowerCase()
      );
    }

    // ✅ Assigned To Me toggle (only assigned user)
    if (this.assignedFilterEnabled) {
      this.showActions = true;
      filtered = filtered.filter(task =>
        this.getAssigneeFromRole(task.role).toLowerCase() === this.userName.trim().toLowerCase()
      );
    }

    // If no filter → hide actions
    if (!this.userFilterEnabled && !this.assignedFilterEnabled) {
      this.showActions = false;
    }

    this.tasks = filtered;
  }

  isExpired(task: Task): boolean {
    const today = new Date();
    const endDate = new Date(task.endDate);
    const status = task.status?.toLowerCase();
    return endDate < today && status !== 'closed' && status !== 'completed';
  }

  canEdit(task: Task): boolean {
    const currentUser = this.userName.trim().toLowerCase();
    const createdBy = task.createdBy?.trim().toLowerCase();
    const assignee = this.getAssigneeFromRole(task.role).toLowerCase();
    return createdBy === currentUser || assignee === currentUser;
  }

  canEditLimited(task: Task): boolean {
    const currentUser = this.userName.trim().toLowerCase();
    const assignee = this.getAssigneeFromRole(task.role).toLowerCase();
    return assignee === currentUser;
  }

  edit(task: Task): void {
    this.editRequested.emit(task);
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.service.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  clearFilters(): void {
    this.statusFilter = ['Open', 'WIP'];
    this.roleTypeFilterList = [];
    this.assigneeFilterList = [];
    this.globalSearch = '';
    this.selectedProject = null;
    this.applyFilters();
  }
}
