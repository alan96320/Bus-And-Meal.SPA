import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { DormitoryBlock } from '../_models/DormitoryBlock';
import { DormitoryBlockService } from '../_services/DormitoryBlock.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';

@Injectable()
export class DormitoryBlockListResolver implements Resolve<DormitoryBlock[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        // tslint:disable-next-line:no-shadowed-variable
        private DormitoryBlockService: DormitoryBlockService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<DormitoryBlock[]> {
        this.pageNumber = 1;
        this.pageSize = this.DormitoryBlockService.itemPerPage;
        return this.DormitoryBlockService.getDormitoryBlocks(this.pageNumber, this.pageSize).pipe(
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
export class DormitoryBlockDetailResolver implements Resolve<DormitoryBlock> {
    constructor(
        // tslint:disable-next-line:no-shadowed-variable
        private DormitoryBlockService: DormitoryBlockService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<DormitoryBlock> {
        return this.DormitoryBlockService.getDormitoryBlock(route.params.id).pipe(
            catchError(error => {
                this.sweetAlert.error('Problem Retrieving Data ');
                this.router.navigate(['/depart']);
                // return of;
                return of(null);
            })
        );
    }
}
