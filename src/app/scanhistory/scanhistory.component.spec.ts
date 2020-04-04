import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanhistoryComponent } from './scanhistory.component';

describe('ScanhistoryComponent', () => {
  let component: ScanhistoryComponent;
  let fixture: ComponentFixture<ScanhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
