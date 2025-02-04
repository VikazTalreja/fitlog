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


});