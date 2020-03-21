import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MealOrderEntryService } from '../_services/mealOrderEntry.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';
import { MealOrderEntry } from '../_models/mealOrderEntry';

@Injectable()
export class MealOrderEntryListResolver implements Resolve<MealOrderEntry[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private mealOrderEntryService: MealOrderEntryService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MealOrderEntry[]> {
        this.pageNumber = 1;
        this.pageSize = this.mealOrderEntryService.itemPerPage;
        return this.mealOrderEntryService.getMealOrderEntrys(this.pageNumber, this.pageSize).pipe(
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
export class MealOrderEntryDetailResolver implements Resolve<MealOrderEntry> {
    constructor(
        private mealOrderEntryService: MealOrderEntryService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MealOrderEntry> {
        return this.mealOrderEntryService.getMealOrderEntry(route.params.id).pipe(
            catchError(error => {
                this.sweetAlert.error(error);
                this.router.navigate(['/mealOrderEntry']);
                // return of;
                return of(null);
            })
        );
    }
}
