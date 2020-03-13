/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BusOrderReportComponent } from './busOrderReport.component';

describe('BusOrderReportComponent', () => {
  let component: BusOrderReportComponent;
  let fixture: ComponentFixture<BusOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
