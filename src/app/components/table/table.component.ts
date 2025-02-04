import { Component } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { FiltersComponent } from '../filters/filters.component';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [CommonModule, TableModule, FiltersComponent],
})
export class TableComponent {
  users$;
  first = 0;

  filteredUsers$;
  nameFilter$ = new BehaviorSubject<string>(''); 
  workoutFilter$ = new BehaviorSubject<string>('');

  constructor(private userDataService: UserDataService) {
    this.users$ = this.userDataService.users$;

     this.filteredUsers$ = combineLatest([
      this.users$,
      this.nameFilter$,
      this.workoutFilter$,
    ]).pipe(
      map(([users, nameFilter, workoutFilter]) =>
        users.filter((user) =>
          this.filterUser(user, nameFilter, workoutFilter)
        )
      )
    );
  }

  filterUser(user: any, nameFilter: string, workoutFilter: string): boolean {
    const nameMatch = user.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const workoutMatch = user.workouts.some((workout: any) =>
      workout.type.toLowerCase().includes(workoutFilter.toLowerCase())
    );
    return nameMatch && workoutMatch;
  }

  onNameFilterChange(value: string): void {
    this.nameFilter$.next(value); 
  }


  getTotalWorkoutMinutes(workouts: any[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  deleteUser(userId: number): void {
    this.userDataService.deleteUser(userId); 
  }

  getWorkoutDetails(workouts: any[]): string {
    return workouts.map(workout => `${workout.type} (${workout.minutes} min)`).join(', ');
  }

  
  addUser(userName: string, workout: { type: string; minutes: number }) {
    this.userDataService.addUser(userName, workout);
    
    this.first = 0;
  }

  onPage(event: any) {
  this.first = event.first;
}
}
