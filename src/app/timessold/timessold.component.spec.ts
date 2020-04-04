import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesSoldComponent } from './timessold.component';

describe('TimessoldComponent', () => {
  let component: TimesSoldComponent;
  let fixture: ComponentFixture<TimesSoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesSoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
