import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserData {
  id: number;
  name: string;
  workouts: { type: string; minutes: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private sampleData: UserData[] = [
    {
      id: 1,
      name: 'Vikas Talreja',
      workouts: [
        { type: 'Running', minutes: 35 },
        { type: 'Cycling', minutes: 20 },
        { type: 'Yoga', minutes: 15 },
        { type: 'Swimming', minutes: 90 },
      ],
    },
    {
      id: 2,  
      name: 'Vikaz Talreja',
      workouts: [
        { type: 'Yoga', minutes: 20 },
        { type: 'Pilates', minutes: 10 },
        { type: 'Running', minutes: 4 },
        { type: 'Cycling', minutes: 100 },
      ],
    },
    {
      id: 3,
      name: 'harshvardhan Rihjwani',
      workouts: [
        { type: 'Weightlifting', minutes: 60 },
        { type: 'Running', minutes: 4 },
        { type: 'Cycling', minutes: 100 },
      ],
    },
    {
      id: 4,
      name: 'Maviya Qureshi',
      workouts: [
        { type: 'Swimming', minutes: 35 },
        { type: 'Yoga', minutes: 50 },
        { type: 'Running', minutes: 4 },
        { type: 'Cycling', minutes: 100 },
      ],
    },
    {
      id: 5,
      name: 'Rohit sharma',
      workouts: [
        { type: 'Boxing', minutes: 10 },
        { type: 'Running', minutes: 20 },
        { type: 'Swimming', minutes: 4 },
        { type: 'Cycling', minutes: 100 },
      ],
    },
    {
      id: 6,
      name: 'Ashutosh Singh',
      workouts: [
        { type: 'Pilates', minutes: 11 },
        { type: 'Cycling', minutes: 11 },
        { type: 'Yoga', minutes: 11 },
        { type: 'Running', minutes: 4 },
        { type: 'Cycling', minutes: 100 },
      ],
    },
    {
      id: 7,
      name: 'User1304',
      workouts: [
        { type: 'Weightlifting', minutes: 50 },
        { type: 'Swimming', minutes: 40 },
        { type: 'Running', minutes: 4 },
        { type: 'Cycling', minutes: 100 },
      ],
    },
    {
      id: 8,
      name: 'Aryan Shah',
      workouts: [
        { type: 'Cycling', minutes: 25 },
        { type: 'Running', minutes: 25 },
        { type: 'Yoga', minutes: 35 },
      ],
    },
    {
      id: 9,
      name: 'Vansh Ahuja',
      workouts: [
        { type: 'Boxing', minutes: 13 },
        { type: 'Weightlifting', minutes: 61 },
        { type: 'Running', minutes: 4 },
        { type: 'Cycling', minutes: 100 },
      ],
    },
  ];

  private userSubject = new BehaviorSubject<UserData[]>(this.getUsersFromLocalStorage());
  public users$ = this.userSubject.asObservable();

  constructor() {
    this.loadSampleData(); // Load sample data on initialization
  }

  private getUsersFromLocalStorage(): UserData[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : this.sampleData; // Return localStorage data or fallback to sample data
  }

  private saveUsersToLocalStorage(users: UserData[]): void {
    localStorage.setItem('users', JSON.stringify(users));
    this.userSubject.next(users); // Update BehaviorSubject with the new data
  }

  deleteUser(userId: number): void {
    const updatedUsers = this.sampleData.filter(user => user.id !== userId);
    this.sampleData = updatedUsers;
    this.saveUsersToLocalStorage(this.sampleData); // Save the updated list to localStorage
  }

  addUser(userName: string, workout: { type: string; minutes: number }) {
    const newUser: UserData = {
      id: this.generateUniqueId(),
      name: userName,
      workouts: [workout],
    };
    this.sampleData.push(newUser);
    this.saveUsersToLocalStorage(this.sampleData); // Save updated list to localStorage
  }

  addOrUpdateUser(userName: string, workout: { type: string; minutes: number }) {
    const existingUser = this.getExistingUser(userName);

    if (existingUser) {
      const existingWorkout = existingUser.workouts.find(
        (w) => w.type === workout.type
      );
      if (existingWorkout) {
        existingWorkout.minutes += workout.minutes;
      } else {
        existingUser.workouts.push(workout);
      }
    } else {
      const newUser: UserData = {
        id: this.generateUniqueId(),
        name: userName,
        workouts: [workout],
      };
      this.sampleData.push(newUser);
    }

    this.saveUsersToLocalStorage(this.sampleData); // Save updated list to localStorage
  }

  private generateUniqueId(): number {
    return this.sampleData.length > 0
      ? Math.max(...this.sampleData.map(user => user.id)) + 1
      : 1;
  }

  private getExistingUser(userName: string): UserData | undefined {
    return this.sampleData.find((user) => user.name === userName);
  }

  private loadSampleData() {
    // If no data is found in localStorage, use the sample data
    const users = this.getUsersFromLocalStorage();
    if (!users || users.length === 0) {
      this.saveUsersToLocalStorage(this.sampleData); // Initialize localStorage with sample data if it's empty
    }
  }
}