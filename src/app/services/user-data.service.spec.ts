import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserDataService, UserData } from './user-data.service';

describe('UserDataService', () => {
  let service: UserDataService;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  const mockLocalStorageData: UserData[] = [
    {
      id: 100,
      name: 'Existing User',
      workouts: [{ type: 'Running', minutes: 20 }]
    }
  ];

  beforeEach(() => {

    getItemSpy = spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'users') {
        return JSON.stringify(mockLocalStorageData);
      }
      return null;
    });
    setItemSpy = spyOn(localStorage, 'setItem').and.callFake(() => {});

    TestBed.configureTestingModule({
      providers: [UserDataService]
    });
    service = TestBed.inject(UserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with data from localStorage', fakeAsync(() => {
    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();
    expect(users.some(u => u.name === 'Existing User')).toBeTrue();
  }));

  it('should return empty array if localStorage is empty', fakeAsync(() => {
    getItemSpy.and.returnValue(null);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [UserDataService]
    });
  
    const newService = TestBed.inject(UserDataService);
  
    let users: UserData[] = [];
    newService.users$.subscribe(u => users = u);
    tick();
  
    expect(users.length).toBe(0);
  }));

  it('should add a new user to real data source', fakeAsync(() => {
    service.switchToRealData();
    service.addUser('New Real User', { type: 'Yoga', minutes: 45 });
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const foundUser = users.find(u => u.name === 'New Real User');
    expect(foundUser).toBeTruthy();
    expect(foundUser?.workouts[0].type).toBe('Yoga');
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should add a new user to sample data source', fakeAsync(() => {
    service.switchToSampleData();
    service.addUser('New Sample User', { type: 'Boxing', minutes: 30 });
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const foundUser = users.find(u => u.name === 'New Sample User');
    expect(foundUser).toBeTruthy();
    expect(foundUser?.workouts[0].type).toBe('Boxing');
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should delete an existing user in real data', fakeAsync(() => {
    service.switchToRealData();
    service.deleteUser(100); 
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    expect(users.find(u => u.id === 100)).toBeUndefined();
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should delete an existing user in sample data', fakeAsync(() => {
    service.switchToSampleData();
    service.addUser('UserToDelete', { type: 'Running', minutes: 10 });
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const user = users.find(u => u.name === 'UserToDelete');
    expect(user).toBeTruthy();
    const userIdToDelete = user!.id;

    service.deleteUser(userIdToDelete);
    tick();

    service.users$.subscribe(u => users = u);
    tick();

    expect(users.find(u => u.name === 'UserToDelete')).toBeUndefined();
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should addOrUpdateUser by updating an existing workout (real data)', fakeAsync(() => {
    service.switchToRealData();
    service.addOrUpdateUser('Existing User', { type: 'Running', minutes: 15 });
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const existing = users.find(u => u.name === 'Existing User');
    expect(existing).toBeTruthy();
    expect(existing?.workouts.find(w => w.type === 'Running')?.minutes).toBe(35);
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should addOrUpdateUser by adding a new workout to an existing user', fakeAsync(() => {
    service.switchToRealData();
    service.addOrUpdateUser('Existing User', { type: 'Cycling', minutes: 30 });
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const existing = users.find(u => u.name === 'Existing User');
    expect(existing).toBeTruthy();
    expect(existing?.workouts.some(w => w.type === 'Cycling')).toBeTrue();
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should addOrUpdateUser by creating a new user if not existing', fakeAsync(() => {
    service.switchToRealData();
    service.addOrUpdateUser('Brand New User', { type: 'Swimming', minutes: 50 });
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const newUser = users.find(u => u.name === 'Brand New User');
    expect(newUser).toBeTruthy();
    expect(newUser?.workouts[0].type).toBe('Swimming');
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should generate unique ID based on real data length', fakeAsync(() => {
    service.switchToRealData();
    const realId = (service as any).generateUniqueId();
    expect(realId).toBe(service['userData'].length + 1);
  }));

  it('should generate unique ID based on sample data length', fakeAsync(() => {
    service.switchToSampleData();
    const sampleId = (service as any).generateUniqueId();
    expect(sampleId).toBe(service['sampleData'].length + 1);
  }));

  it('should get existing user from real data', fakeAsync(() => {
    service.switchToRealData();
    const existingUser = (service as any).getExistingUser('Existing User');
    expect(existingUser).toBeTruthy();
    expect(existingUser.name).toBe('Existing User');
  }));

  it('should get existing user from sample data', fakeAsync(() => {
    service.switchToSampleData();
    service.addUser('Sample Existing User', { type: 'Yoga', minutes: 20 });
    tick();

    const existingUser = (service as any).getExistingUser('Sample Existing User');
    expect(existingUser).toBeTruthy();
    expect(existingUser.name).toBe('Sample Existing User');
  }));

  it('should switch to sample data and emit sampleData', fakeAsync(() => {
    service.switchToSampleData();
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const sampleUserExists = users.some(u => u.name === 'Rishabh Sinha' || u.name === 'Neha Sharma');
    expect(sampleUserExists).toBeTrue();
  }));

  it('should switch back to real data and emit real data', fakeAsync(() => {
    service.switchToRealData();
    tick();

    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();

    const realUserExists = users.some(u => u.name === 'Existing User');
    expect(realUserExists).toBeTrue();
  }));

  it('should addOrUpdateUser on sample data with an existing user and existing workout', fakeAsync(() => {
    service.switchToSampleData();

    service.addUser('Sample Existing User Update', { type: 'Running', minutes: 20 });
    tick();
  

    service.addOrUpdateUser('Sample Existing User Update', { type: 'Running', minutes: 10 });
    tick();
  
    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();
  
    const user = users.find(u => u.name === 'Sample Existing User Update');
    expect(user).toBeTruthy();
    const runningWorkout = user!.workouts.find(w => w.type === 'Running');
    expect(runningWorkout?.minutes).toBe(30);
  }));
  
  it('should addOrUpdateUser on sample data with an existing user and a new workout type', fakeAsync(() => {
    service.switchToSampleData();

    service.addUser('Sample Existing User New Workout', { type: 'Cycling', minutes: 20 });
    tick();
  
    service.addOrUpdateUser('Sample Existing User New Workout', { type: 'Swimming', minutes: 15 });
    tick();
  
    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();
  
    const user = users.find(u => u.name === 'Sample Existing User New Workout');
    expect(user).toBeTruthy();
    const swimmingWorkout = user!.workouts.find(w => w.type === 'Swimming');
    expect(swimmingWorkout?.minutes).toBe(15);
  }));
  
  it('should addOrUpdateUser on sample data with a completely new user', fakeAsync(() => {
    service.switchToSampleData();
    service.addOrUpdateUser('Completely New Sample User', { type: 'Yoga', minutes: 25 });
    tick();
  
    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();
  
    const user = users.find(u => u.name === 'Completely New Sample User');
    expect(user).toBeTruthy();
    expect(user?.workouts[0].type).toBe('Yoga');
    expect(user?.workouts[0].minutes).toBe(25);
  }));
  
  it('should handle deleteUser on sample data when user does not exist', fakeAsync(() => {
    service.switchToSampleData();
    service.deleteUser(9999);
    tick();
  
    let users: UserData[] = [];
    service.users$.subscribe(u => users = u);
    tick();
    expect(users.length).toBeGreaterThan(0);
    expect(users.find(u => u.id === 9999)).toBeUndefined();
  }));
  
  it('should return undefined from getExistingUser on sample data if user does not exist', fakeAsync(() => {
    service.switchToSampleData();
    const nonExisting = (service as any).getExistingUser('NonExistentSampleUser');
    expect(nonExisting).toBeUndefined();
  }));
});