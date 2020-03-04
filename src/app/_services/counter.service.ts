import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Counter } from '../_models/counter';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})
export class CounterService {
   baseUrl = environment.apiUrl;
   itemPerPage = 5;

   constructor(private http: HttpClient, ) { }

   // for add data Counter
   addCounter(model: any) {
      return this.http.post(this.baseUrl + 'counter/', model);
   }

   // for delete data Counter
   deleteCounter(id: any) {
      return this.http.delete(this.baseUrl + 'counter/' + id);
   }
   // get by ID after update
   getCounter(id: any): Observable<Counter> {
      return this.http.get<Counter>(this.baseUrl + 'counter/' + id);
   }
   // for edit Counter
   editCounter(id: any, model: any) {
      return this.http.put(this.baseUrl + 'counter/' + id, model);
   }

   // get all
   getCounters(page?, itemsPerPage?, counterParams?): Observable<PaginatedResult<Counter[]>> {
      const paginatedResult: PaginatedResult<Counter[]> = new PaginatedResult<Counter[]>();

      let params = new HttpParams();
      if (page != null && itemsPerPage != null) {
         params = params.append('pageNumber', page);
         params = params.append('pageSize', itemsPerPage);
      }
      if (counterParams != null) {
         if (counterParams.code != null) {
            params = params.append('code', counterParams.code);
         }
         if (counterParams.name != null) {
            params = params.append('name', counterParams.name);
         }
         if (counterParams.location != null) {
            params = params.append('Location', counterParams.location);
         }
         if (counterParams.status != null) {
            params = params.append('Status', counterParams.status);
         }
         if (counterParams.OrderBy != null) {
            params = params.append('OrderBy', counterParams.OrderBy);
            params = params.append('isDescending', counterParams.isDesc);
         }
      }

      return this.http.get<Counter[]>(this.baseUrl + 'counter/paged', { observe: 'response', params })
         .pipe(
            map(response => {
               paginatedResult.result = response.body;
               if (response.headers.get('Pagination') != null) {
                  paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
               }
               return paginatedResult;
            })
         );
   }

}
