/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BusOrderService } from './busOrder.service';

describe('Service: BusOrder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusOrderService]
    });
  });

  it('should ...', inject([BusOrderService], (service: BusOrderService) => {
    expect(service).toBeTruthy();
  }));
});
