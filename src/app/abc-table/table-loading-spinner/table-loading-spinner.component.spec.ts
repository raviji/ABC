import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLoadingSpinnerComponent } from './table-loading-spinner.component';

describe('TableLoadingSpinnerComponent', () => {
  let component: TableLoadingSpinnerComponent;
  let fixture: ComponentFixture<TableLoadingSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableLoadingSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
