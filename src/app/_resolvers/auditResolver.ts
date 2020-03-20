import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Audit } from '../_models/audit';
import { AuditService } from '../_services/audit.service';
import { AlertifyService } from '../_services/alertify.service';
import { SweetAlertService } from '../_services/sweetAlert.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuditResolver implements Resolve<Audit[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private auditService: AuditService,
        private router: Router,
        private alertify: AlertifyService,
        private sweetAlert: SweetAlertService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Audit[]> {
        this.pageNumber = 1;
        this.pageSize = this.auditService.itemPerPage;
        return this.auditService.getAudits(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.sweetAlert.error(error);
                this.router.navigate(['/home']);
                // return of;
                return of(null);
            })
        );
    }
}
