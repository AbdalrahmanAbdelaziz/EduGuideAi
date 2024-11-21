import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGeneralComponent } from './my-general.component';

describe('MyGeneralComponent', () => {
  let component: MyGeneralComponent;
  let fixture: ComponentFixture<MyGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
