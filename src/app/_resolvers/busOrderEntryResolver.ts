import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BusOrderEntryService } from '../_services/busOrderEntry.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';
import { BusOrderEntry } from '../_models/busOrderEntry';

@Injectable()
export class BusOrderEntryListResolver implements Resolve<BusOrderEntry[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private busOrderEntryService: BusOrderEntryService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BusOrderEntry[]> {
        this.pageNumber = 1;
        this.pageSize = this.busOrderEntryService.itemPerPage;
        return this.busOrderEntryService.getBusOrderEntrys(this.pageNumber, this.pageSize).pipe(
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
export class BusOrderEntryDetailResolver implements Resolve<BusOrderEntry> {
    constructor(
        private busOrderEntryService: BusOrderEntryService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BusOrderEntry> {
        return this.busOrderEntryService.getBusOrderEntry(route.params.id).pipe(
            catchError(error => {
                this.sweetAlert.error(error);
                this.router.navigate(['/busOrderEntry']);
                // return of;
                return of(null);
            })
        );
    }
}
