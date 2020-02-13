import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAdminComponent } from './price-admin.component';

describe('PriceAdminComponent', () => {
  let component: PriceAdminComponent;
  let fixture: ComponentFixture<PriceAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
