import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetGpmComponent } from './target-gpm.component';

describe('TargetGpmComponent', () => {
  let component: TargetGpmComponent;
  let fixture: ComponentFixture<TargetGpmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetGpmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetGpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
