import { Component, OnInit } from '@angular/core';
import { UserDataService, UserData } from '../../services/user-data.service';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule], 
})
export class SidebarComponent implements OnInit {
  users: UserData[] = [];

  sidebarSelected = 'All';

  @Output() sidebarChangeEvent: EventEmitter<string> = new EventEmitter<string>();

  sidebarChange(selected: string): void {
    this.sidebarSelected = selected;
    this.sidebarChangeEvent.emit(this.sidebarSelected);
  };

  getInitials(name: string): string {
    if (!name) return '';
  
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    
    this.userDataService.users$.subscribe((users) => {
      this.users = users;
    });
  }
}
