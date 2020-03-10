/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CounterReportComponent } from './CounterReport.component';

describe('CounterReportComponent', () => {
  let component: CounterReportComponent;
  let fixture: ComponentFixture<CounterReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
