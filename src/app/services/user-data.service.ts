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
  private userData: UserData[] = [];

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

  private currentDataSource: 'real' | 'sample' = 'sample';
  private userSubject = new BehaviorSubject<UserData[]>(this.getUsersFromLocalStorage());
  public users$ = this.userSubject.asObservable();

  constructor() {
    const storedUsers = this.getUsersFromLocalStorage();
    this.userData = storedUsers;
  }

  private getUsersFromLocalStorage(): UserData[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.userData));
  }

  deleteUser(userId: number): void {
    let updatedUsers;
    if (this.currentDataSource === 'real') {
      updatedUsers = this.userData.filter(user => user.id !== userId);
      this.userData = updatedUsers;
    } else {
      updatedUsers = this.sampleData.filter(user => user.id !== userId);
      this.sampleData = updatedUsers;
    }
    this.userSubject.next(this.currentDataSource === 'real' ? this.userData : this.sampleData);
    this.saveUsersToLocalStorage();
  }

  addUser(userName: string, workout: { type: string; minutes: number }) {
    const newUser: UserData = {
      id: this.generateUniqueId(),
      name: userName,
      workouts: [workout],
    };

    if (this.currentDataSource === 'real') {
      this.userData.push(newUser);
    } else {
      this.sampleData.push(newUser);
    }

    this.userSubject.next(this.currentDataSource === 'real' ? this.userData : this.sampleData);
    this.saveUsersToLocalStorage(); 
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
      if (this.currentDataSource === 'real') {
        this.userData.push(newUser);
      } else {
        this.sampleData.push(newUser);
      }
    }

    this.userSubject.next(this.currentDataSource === 'real' ? this.userData : this.sampleData);
    this.saveUsersToLocalStorage(); 
  }

  private generateUniqueId(): number {
    return this.currentDataSource === 'real'
      ? this.userData.length + 1
      : this.sampleData.length + 1;
  }

  private getExistingUser(userName: string): UserData | undefined {
    return this.currentDataSource === 'real'
      ? this.userData.find((user) => user.name === userName)
      : this.sampleData.find((user) => user.name === userName);
  }

  switchToSampleData(): void {
    this.currentDataSource = 'sample';
    this.userSubject.next(this.sampleData);
  }

  switchToRealData(): void {
    this.currentDataSource = 'real';
    this.userSubject.next(this.userData);
  }
}