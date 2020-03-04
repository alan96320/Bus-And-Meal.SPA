import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../_models/Configuration';

@Injectable({
   providedIn: 'root'
})
export class ConfigurationService {

   baseUrl = environment.apiUrl;

   constructor(private http: HttpClient, ) { }


   // get by ID after update
   getConfiguration(id: any): Observable<Configuration> {
      return this.http.get<Configuration>(this.baseUrl + 'configuration/' + id);
   }
   // for edit Configuration
   editConfiguration(id: any, model: any) {
      return this.http.put(this.baseUrl + 'configuration/' + id, model);
   }

}
