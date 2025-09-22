import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  isPM: boolean = false;

  editingProject: any = null;
  projects: any[] = [];
  filteredProjects: any[] = [];
  projectTasksMap: { [key: string]: any[] } = {};
  expandedProjects = new Set<string>();
  accountNames: string[] = [];
  selectedAccount: string | null = null;
  showProjectForm = false;
  showAccountForm = false;

  // Filters
  statusOptions: string[] = ['Open', 'WIP', 'Completed', 'Closed'];
  selectedStatuses: string[] = ['Open', 'WIP'];
  assigneeOptions: string[] = [];
  selectedPMs: string[] = [];
  searchText: string = '';

  constructor(private service: TaskService, private router: Router) {}

  ngOnInit(): void {
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');
    const storedIsPM = localStorage.getItem('isPM');

    if (!storedUserName || !storedUserRole) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = storedUserName;
    this.userRole = storedUserRole;
    this.isPM = storedIsPM === '1';

    this.loadProjects();
  }

  loadProjects() {
    this.service.getProjects().subscribe(projects => {
      this.projects = projects;
      this.filteredProjects = [...projects];

      // Accounts
      this.service.getAccounts().subscribe(accounts => {
        this.accountNames = accounts.map(a => a.accountName);
      });

      // PM names
      const pmSet = new Set<string>();
      projects.forEach(p => { if (p.pmName) pmSet.add(p.pmName); });
      this.assigneeOptions = Array.from(pmSet);

      this.applyFilters();
    });
  }

  toggleStatus(status: string) {
    this.selectedStatuses = this.selectedStatuses.includes(status)
      ? this.selectedStatuses.filter(s => s !== status)
      : [...this.selectedStatuses, status];
    this.applyFilters();
  }

  togglePM(pm: string) {
    this.selectedPMs = this.selectedPMs.includes(pm)
      ? this.selectedPMs.filter(p => p !== pm)
      : [...this.selectedPMs, pm];
    this.applyFilters();
  }

  filterByAccount(account: string) {
    this.selectedAccount = account;
    this.applyFilters();
  }

  showAllAccounts() {
    this.selectedAccount = null;
    this.applyFilters();
  }

  clearFilters() {
    this.selectedAccount = null;
    this.selectedPMs = [];
    this.selectedStatuses = ['Open', 'WIP'];
    this.searchText = '';
    this.applyFilters();
  }

  applyFilters() {
  this.filteredProjects = this.projects.filter(p => {
    const accountMatch = this.selectedAccount
      ? (p.account?.accountName === this.selectedAccount || p.accountName === this.selectedAccount)
      : true;
    const pmMatch = this.selectedPMs.length ? this.selectedPMs.includes(p.pmName) : true;
    const statusMatch = this.selectedStatuses.length ? this.selectedStatuses.includes(p.status) : true;
    const searchMatch = this.searchText ? p.projectName.toLowerCase().includes(this.searchText.toLowerCase()) : true;
    return accountMatch && pmMatch && statusMatch && searchMatch;
  });
}



  openForm() {
    if (this.userRole === 'Admin' || this.isPM) {
      this.editingProject = null;
      this.showProjectForm = true;
    } else alert('❌ You don’t have access to add projects.');
  }

  editProject(project: any) {
    if (this.userRole === 'Admin') {
      this.editingProject = { ...project, limitedEdit: false };
      this.showProjectForm = true;
    } else if (this.isPM && project.pmName === this.userName) {
      this.editingProject = { ...project, limitedEdit: true };
      this.showProjectForm = true;
    } else alert('❌ You don’t have access to edit this project.');
  }

  closeProjectForm() {
    this.showProjectForm = false;
    this.loadProjects();
  }

  openAccountForm() {
    if (this.userRole === 'Admin') this.showAccountForm = true;
    else alert('❌ You don’t have access.');
  }

  closeAccountForm() {
    this.showAccountForm = false;
    this.loadProjects();
  }

  deleteProject(projectName: string) {
    if (this.userRole !== 'Admin') { alert('❌ Only Admin can delete projects.'); return; }
    if (confirm(`Are you sure you want to delete project "${projectName}"?`)) {
      this.service.getProjects().subscribe(projects => {
        const projectToDelete = projects.find(p => p.projectName === projectName);
        if (projectToDelete?.id) {
          this.service.deleteProject(projectToDelete.id).subscribe({
            next: () => { alert(`Project "${projectName}" deleted successfully`); this.loadProjects(); },
            error: (err) => { console.error("Error deleting project", err); alert("❌ Failed to delete project"); }
          });
        } else alert("❌ Project not found");
      });
    }
  }

  toggleTasks(project: string) {
    if (this.expandedProjects.has(project)) this.expandedProjects.delete(project);
    else { this.expandedProjects.add(project); if (!this.projectTasksMap[project]) this.loadTasksForProject(project); }
  }

  isProjectExpanded(project: string) { return this.expandedProjects.has(project); }

  loadTasksForProject(project: string) {
    this.service.getTasks().subscribe(tasks => { this.projectTasksMap[project] = tasks.filter(t => t.projectName === project); });
  }

  isExpiredTask(task: any): boolean {
    const today = new Date();
    const endDate = new Date(task.endDate);
    const status = task.status?.toLowerCase();
    return endDate < today && status !== 'closed' && status !== 'completed';
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
  goHome() { this.router.navigate(['/']); }
  goToAllTasks() { this.router.navigate(['/dashboard']); }
}
