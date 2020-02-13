import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedColumnControlComponent } from './fixed-column-control.component';

describe('FixedColumnControlComponent', () => {
  let component: FixedColumnControlComponent;
  let fixture: ComponentFixture<FixedColumnControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedColumnControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedColumnControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
