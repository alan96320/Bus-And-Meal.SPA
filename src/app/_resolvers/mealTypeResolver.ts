import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { MealType } from "../_models/mealType";
import { MealTypeService } from "../_services/mealType.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { SweetAlertService } from "../_services/sweetAlert.service";

@Injectable()
export class MealTypeListResolver implements Resolve<MealType[]> {
  pageNumber: number;
  pageSize: number;
  constructor(
    private MealTypeService: MealTypeService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealType[]> {
    this.pageNumber = 1;
    this.pageSize = this.MealTypeService.itemPerPage;
    return this.MealTypeService.getMealTypes(
      this.pageNumber,
      this.pageSize
    ).pipe(
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
export class MealTypeDetailResolver implements Resolve<MealType> {
  constructor(
    private MealTypeService: MealTypeService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealType> {
    return this.MealTypeService.getMealType(route.params["id"]).pipe(
      catchError(error => {
        this.sweetAlert.error("Problem Retrieving Data ");
        this.router.navigate(["/depart"]);
        return of;
        // return of(null);
      })
    );
  }
}
