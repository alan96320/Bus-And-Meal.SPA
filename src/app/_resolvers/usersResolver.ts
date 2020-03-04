import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Users } from '../_models/Users';
import { UsersService } from '../_services/Users.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';

@Injectable()
export class UsersListResolver implements Resolve<Users[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private userService: UsersService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Users[]> {
        this.pageNumber = 1;
        this.pageSize = this.userService.itemPerPage;
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
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
export class UsersDetailResolver implements Resolve<Users> {
    constructor(
        private userService: UsersService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Users> {
        return this.userService.getUser(route.params.id).pipe(
            catchError(error => {
                this.sweetAlert.error('Problem Retrieving Data ');
                this.router.navigate(['/depart']);
                // return of;
                return of(null);
            })
        );
    }
}
