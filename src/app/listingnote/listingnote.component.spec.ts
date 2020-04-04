import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingnoteComponent } from './listingnote.component';

describe('ListingnoteComponent', () => {
  let component: ListingnoteComponent;
  let fixture: ComponentFixture<ListingnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
