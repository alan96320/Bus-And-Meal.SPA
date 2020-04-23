/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MealVendorReportComponent } from './mealVendorReport.component';

describe('MealVendorReportComponent', () => {
  let component: MealVendorReportComponent;
  let fixture: ComponentFixture<MealVendorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealVendorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealVendorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
