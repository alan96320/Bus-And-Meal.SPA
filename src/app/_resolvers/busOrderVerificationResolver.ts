import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';
import { BusOrderVerification } from '../_models/busOrderVerification';
import { BusOrderVerificationService } from '../_services/busOrderVerification.service';

@Injectable()
export class BusOrderVerificationListResolver implements Resolve<BusOrderVerification[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private busOrderVerificationService: BusOrderVerificationService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BusOrderVerification[]> {
        this.pageNumber = 1;
        this.pageSize = this.busOrderVerificationService.itemPerPage;
        return this.busOrderVerificationService.getBusOrderVerifications(this.pageNumber, this.pageSize).pipe(
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
export class BusOrderVerificationDetailResolver implements Resolve<BusOrderVerification> {
    constructor(
        private busOrderVerificationService: BusOrderVerificationService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BusOrderVerification> {
        return this.busOrderVerificationService.getBusOrderVerification(route.params.id).pipe(
            catchError(error => {
                this.sweetAlert.error(error);
                this.router.navigate(['/busOrderVerification']);
                // return of;
                return of(null);
            })
        );
    }
}
