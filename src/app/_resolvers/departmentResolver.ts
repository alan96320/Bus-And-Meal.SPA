import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Department } from '../_models/department';
import { DepartmentService } from '../_services/department.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';

@Injectable()
export class DepartmentListResolver implements Resolve<Department[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Department[]> {
        this.pageNumber = 1;
        this.pageSize = this.departmentService.itemPerPage;
        return this.departmentService.getDepartments(this.pageNumber, this.pageSize).pipe(
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
export class DepartmentDetailResolver implements Resolve<Department> {
    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Department> {
        return this.departmentService.getDepartment(route.params.id).pipe(
            catchError(error => {
                this.sweetAlert.error(error);
                this.router.navigate(['/depart']);
                // return of;
                return of(null);
            })
        );
    }
}
