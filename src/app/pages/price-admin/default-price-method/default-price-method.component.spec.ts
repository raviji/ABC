import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPriceMethodComponent } from './default-price-method.component';

describe('DefaultPriceMethodComponent', () => {
  let component: DefaultPriceMethodComponent;
  let fixture: ComponentFixture<DefaultPriceMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultPriceMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPriceMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
