import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';
import { MealOrderVerification } from '../_models/mealOrderVerification';
import { MealOrderVerificationService } from '../_services/mealOrderVerification.service';

@Injectable()
export class MealOrderVerificationListResolver implements Resolve<MealOrderVerification[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private mealOrderVerificationService: MealOrderVerificationService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MealOrderVerification[]> {
        this.pageNumber = 1;
        this.pageSize = this.mealOrderVerificationService.itemPerPage;
        return this.mealOrderVerificationService.getMealOrderVerifications(this.pageNumber, this.pageSize).pipe(
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
export class MealOrderVerificationDetailResolver implements Resolve<MealOrderVerification> {
    constructor(
        private mealOrderVerificationService: MealOrderVerificationService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MealOrderVerification> {
        return this.mealOrderVerificationService.getMealOrderVerification(route.params.id).pipe(
            catchError(error => {
                this.sweetAlert.error(error);
                this.router.navigate(['/mealOrderVerification']);
                // return of;
                return of(null);
            })
        );
    }
}
