import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskTableComponent } from '../task-table/task-table.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedProject: string = '';
  showForm = false;
  selectedRow: any = null;
  userName: string = '';
  userFilterEnabled: boolean = false;
  assignedFilterEnabled: boolean = false;
  ProjectForm = false;

  @ViewChild(TaskTableComponent)
  tableComponent!: TaskTableComponent;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userName');
    if (!storedUser) {
      this.router.navigate(['/login']);
    } else {
      this.userName = storedUser;
    }

    this.route.queryParams.subscribe(params => {
      this.selectedProject = params['project'] || '';
    });
  }

  toggleUserFilter() {
  if (this.userFilterEnabled) {
    // ✅ Disable the other toggle
    this.assignedFilterEnabled = false;
    this.tableComponent.applyAssignedFilter(false, this.userName);
  }

  if (this.tableComponent) {
    this.tableComponent.applyUserFilter(this.userFilterEnabled, this.userName);
  }
}

toggleAssignedFilter() {
  if (this.assignedFilterEnabled) {
    // ✅ Disable the other toggle
    this.userFilterEnabled = false;
    this.tableComponent.applyUserFilter(false, this.userName);
  }

  if (this.tableComponent) {
    this.tableComponent.applyAssignedFilter(this.assignedFilterEnabled, this.userName);
  }
}


  goHome(): void {
    this.router.navigate(['/']);
  }

  clearSelection = () => {
    this.selectedRow = null;
    this.showForm = false;
  };

  openForm() {
    this.selectedRow = null;
    this.showForm = true;
  }

  editRow(row: any) {
    this.selectedRow = row;
    this.showForm = true;
  }

  clearForm = () => {
    this.selectedRow = null;
    this.showForm = false;
  };

  reload = () => {
    this.clearForm();
    setTimeout(() => (this.showForm = false), 0);
  };

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToAllTasks(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    }).then(() => {
      this.selectedProject = '';
    });
  }

  closeProjectForm() {
  this.ProjectForm = false;
}
}
