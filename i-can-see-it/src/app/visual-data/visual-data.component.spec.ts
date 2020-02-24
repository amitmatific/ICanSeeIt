import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualDataComponent } from './visual-data.component';

describe('VisualDataComponent', () => {
  let component: VisualDataComponent;
  let fixture: ComponentFixture<VisualDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
