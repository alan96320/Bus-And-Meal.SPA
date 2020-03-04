import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { BusTime } from "../_models/busTime";
import { BusTimeService } from "../_services/busTime.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { SweetAlertService } from "../_services/sweetAlert.service";

@Injectable()
export class BusTimeListResolver implements Resolve<BusTime[]> {
  pageNumber: number;
  pageSize: number;
  constructor(
    private BusTimeService: BusTimeService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BusTime[]> {
    this.pageNumber = 1;
    this.pageSize = this.BusTimeService.itemPerPage;
    return this.BusTimeService.getBusTimes(this.pageNumber, this.pageSize).pipe(
      catchError(error => {
        this.sweetAlert.error("Problem Retrieving Data ");
        this.router.navigate(["/home"]);
        // return of;
        return of(null);
      })
    );
  }
}

@Injectable()
export class BusTimeDetailResolver implements Resolve<BusTime> {
  constructor(
    private BusTimeService: BusTimeService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BusTime> {
    return this.BusTimeService.getBusTime(route.params["id"]).pipe(
      catchError(error => {
        this.sweetAlert.error("Problem Retrieving Data ");
        this.router.navigate(["/depart"]);
        return of;
        // return of(null);
      })
    );
  }
}
