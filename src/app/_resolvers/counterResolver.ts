import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Counter } from '../_models/counter';
import { CounterService } from '../_services/counter.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';

@Injectable()
export class CounterListResolver implements Resolve<Counter[]> {
  pageNumber: number;
  pageSize: number;
  constructor(
    // tslint:disable-next-line:no-shadowed-variable
    private CounterService: CounterService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Counter[]> {
    this.pageNumber = 1;
    this.pageSize = this.CounterService.itemPerPage;
    return this.CounterService.getCounters(this.pageNumber, this.pageSize).pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        // return of;
        return of(null);
      })
    );
  }
}

@Injectable()
export class CounterDetailResolver implements Resolve<Counter> {
  constructor(
    // tslint:disable-next-line:no-shadowed-variable
    private CounterService: CounterService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Counter> {
    return this.CounterService.getCounter(route.params.id).pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/counter']);
        // return of;
        return of(null);
      })
    );
  }
}
