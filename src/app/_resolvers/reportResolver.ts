import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Department } from "../_models/department";
import { DepartmentService } from "../_services/department.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { SweetAlertService } from "../_services/sweetAlert.service";

@Injectable()
export class DepartmentReportResolver implements Resolve<Department[]> {
  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Department[]> {
    return this.departmentService.getDepartmentReport().pipe(
      catchError(error => {
        this.sweetAlert.error("Problem Retrieving Data ");
        this.router.navigate(["/home"]);
        return of(null);
      })
    );
  }
}
