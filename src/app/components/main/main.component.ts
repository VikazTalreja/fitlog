import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { TableComponent } from "../table/table.component";
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData, UserDataService } from '../../services/user-data.service';
import { UserChartComponent } from "../user-chart/user-chart.component";

@Component({
  selector: 'app-main',
  imports: [TableComponent, CommonModule, UserChartComponent , HeaderComponent ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent {
  @Input() sidebarSelected: string = 'All';
  
  users: UserData[] = [];

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    
    this.userDataService.users$.subscribe((users) => {
      this.users = users; 
    });
}
}
