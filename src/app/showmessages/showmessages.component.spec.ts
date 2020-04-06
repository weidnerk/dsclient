import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowmessagesComponent } from './showmessages.component';

describe('ShowmessagesComponent', () => {
  let component: ShowmessagesComponent;
  let fixture: ComponentFixture<ShowmessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowmessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
