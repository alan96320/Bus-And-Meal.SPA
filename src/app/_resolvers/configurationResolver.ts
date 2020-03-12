import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Configuration } from '../_models/configuration';
import { ConfigurationService } from '../_services/configuration.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';

@Injectable()
export class ConfigurationDetailResolver implements Resolve<Configuration> {
  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
    private alertify: AlertifyService,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Configuration> {
    return this.configurationService.getConfiguration(route.params.id).pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/depart']);
        // return of;
        return of(null);
      })
    );
  }
}
