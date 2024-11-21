import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFacultyComponent } from './my-faculty.component';

describe('MyFacultyComponent', () => {
  let component: MyFacultyComponent;
  let fixture: ComponentFixture<MyFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyFacultyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
