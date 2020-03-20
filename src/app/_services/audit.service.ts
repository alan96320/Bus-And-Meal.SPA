import { Injectable } from '@angular/core';
import { Audit } from '../_models/audit';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { environment } from 'src/environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) { }

  getAudits(page?, itemsPerPage?, auditParams?): Observable<PaginatedResult<Audit[]>> {
    const paginatedResult: PaginatedResult<Audit[]> = new PaginatedResult<Audit[]>();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (auditParams != null) {
      if (auditParams.table != null) {
        params = params.append('TableName', auditParams.table);
      }
      if (auditParams.time != null) {
        params = params.append('Date', auditParams.time);
      }
      if (auditParams.OrderBy != null) {
        params = params.append('OrderBy', auditParams.OrderBy);
        params = params.append('isDescending', auditParams.isDesc);
      }
    }

    return this.http.get<Audit[]>(this.baseUrl + 'Audit/paged', {observe: 'response', params}).pipe(map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }


}
