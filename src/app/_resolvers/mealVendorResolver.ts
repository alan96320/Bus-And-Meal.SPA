import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MealVendor } from '../_models/mealVendor';
import { MealVendorService } from '../_services/mealVendor.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';

@Injectable()
export class MealVendorListResolver implements Resolve<MealVendor[]> {
  pageNumber: number;
  pageSize: number;
  constructor(
    // tslint:disable-next-line:no-shadowed-variable
    private MealVendorService: MealVendorService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealVendor[]> {
    this.pageNumber = 1;
    this.pageSize = this.MealVendorService.itemPerPage;
    return this.MealVendorService.getMealVendors(
      this.pageNumber,
      this.pageSize
    ).pipe(
      catchError(error => {
        this.sweetAlert.error('Problem Retrieving Data ');
        this.router.navigate(['/home']);
        // return of;
        return of(null);
      })
    );
  }
}

@Injectable()
export class MealVendorDetailResolver implements Resolve<MealVendor> {
  constructor(
    // tslint:disable-next-line:no-shadowed-variable
    private MealVendorService: MealVendorService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealVendor> {
    return this.MealVendorService.getMealVendor(route.params.id).pipe(
      catchError(error => {
        this.sweetAlert.error('Problem Retrieving Data ');
        this.router.navigate(['/depart']);
        // return of;
        return of(null);
      })
    );
  }
}
