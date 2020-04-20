import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListinglogComponent } from './listinglog.component';

describe('ListinglogComponent', () => {
  let component: ListinglogComponent;
  let fixture: ComponentFixture<ListinglogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListinglogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListinglogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
