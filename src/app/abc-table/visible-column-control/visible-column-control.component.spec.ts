import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleColumnControlComponent } from './visible-column-control.component';

describe('VisibleColumnControlComponent', () => {
  let component: VisibleColumnControlComponent;
  let fixture: ComponentFixture<VisibleColumnControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibleColumnControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleColumnControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
