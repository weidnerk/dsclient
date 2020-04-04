import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboardv2Component } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: Dashboardv2Component;
  let fixture: ComponentFixture<Dashboardv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dashboardv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dashboardv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
