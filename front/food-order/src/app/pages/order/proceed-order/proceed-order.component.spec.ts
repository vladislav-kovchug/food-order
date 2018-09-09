import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedOrderComponent } from './proceed-order.component';

describe('ProceedOrderComponent', () => {
  let component: ProceedOrderComponent;
  let fixture: ComponentFixture<ProceedOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceedOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
