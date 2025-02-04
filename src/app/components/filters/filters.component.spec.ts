import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDataService } from '../../services/user-data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { FiltersComponent } from './filters.component'; 

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let userDataServiceMock: jasmine.SpyObj<UserDataService>;

  beforeEach(async () => {

    userDataServiceMock = jasmine.createSpyObj('UserDataService', ['addOrUpdateUser']);


    await TestBed.configureTestingModule({
      imports: [CommonModule, FiltersComponent],
      providers: [
        { provide: UserDataService, useValue: userDataServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the FiltersComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should show the dialog when showDialog() is called', () => {
    component.showDialog();
    expect(component.visible).toBeTrue();
  });

  it('should hide the dialog when hideDialog() is called', () => {
    component.hideDialog();
    expect(component.visible).toBeFalse();
  });

  it('should toggle dialog visibility when showDialog() and hideDialog() are called', () => {
    component.showDialog();
    expect(component.visible).toBeTrue();

    component.hideDialog();
    expect(component.visible).toBeFalse();
  });

  it('should reset form fields when cancelModal() is called', () => {
    component.name = 'John';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.cancelModal();

    expect(component.name).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.workoutMinutes).toBe(0);
    expect(component.visible).toBeFalse();
  });

  it('should call addOrUpdateUser when addWorkout() is called with valid inputs', () => {
    component.name = 'john doe';
    component.workoutType = 'running';
    component.workoutMinutes = 30;

    component.addWorkout();

    expect(userDataServiceMock.addOrUpdateUser).toHaveBeenCalledWith('John Doe', {
      type: 'Running',
      minutes: 30,
    });
    expect(component.name).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.workoutMinutes).toBe(0);
    expect(component.visible).toBeFalse();
  });

  it('should not call addOrUpdateUser when addWorkout() is called with invalid inputs', () => {
    component.name = '';
    component.workoutType = '';
    component.workoutMinutes = 0;

    component.addWorkout();

    expect(userDataServiceMock.addOrUpdateUser).not.toHaveBeenCalled();
  });

  it('should emit nameFilterChange when onNameFilterChange() is called', () => {
    spyOn(component.nameFilterChange, 'emit');
    
    const inputElement = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    inputElement.value = 'John';
    inputElement.dispatchEvent(new Event('input'));
    
    expect(component.nameFilterChange.emit).toHaveBeenCalledWith('John');
  });


  it('should capitalize words in name and workoutType', () => {
    const name = 'john doe';
    const workoutType = 'running';

    expect(component.capitalizeWords(name)).toBe('John Doe');
    expect(component.capitalizeWords(workoutType)).toBe('Running');
  });
});
