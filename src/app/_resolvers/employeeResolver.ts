import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Employee } from '../_models/employee';
import { EmployeeService } from '../_services/employee.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';

@Injectable()
export class EmployeeListResolver implements Resolve<Employee[]> {
  pageNumber: number;
  pageSize: number;
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Employee[]> {
    this.pageNumber = 1;
    this.pageSize = this.employeeService.itemPerPage;
    return this.employeeService
      .getEmployees(this.pageNumber, this.pageSize)
      .pipe(
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
export class EmployeeDetailResolver implements Resolve<Employee> {
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Employee> {
    return this.employeeService.getEmployee(route.params.id).pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/depart']);
        // return of;
        return of(null);
      })
    );
  }
}
