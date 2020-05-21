import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndlistingComponent } from './endlisting.component';

describe('EndlistingComponent', () => {
  let component: EndlistingComponent;
  let fixture: ComponentFixture<EndlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
