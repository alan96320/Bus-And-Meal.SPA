import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusOrderEntry } from '../_models/busOrderEntry';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusOrderEntryService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) { }

  addBusOrderEntry(model: any) {
    return this.http.post(this.baseUrl + 'BusOrder/', model);
  }

  deleteBusOrderEntry(id: any) {
    return this.http.delete(this.baseUrl + 'BusOrder/' + id);
  }

  getBusOrderEntry(id: any): Observable<BusOrderEntry> {
    return this.http.get<BusOrderEntry>(this.baseUrl + 'BusOrder/' + id);
  }

  editBusOrderEntry(id: any, model: any) {
    return this.http.put(this.baseUrl + 'BusOrder/' + id, model);
  }


  getBusOrderEntrys(page?, itemsPerPage?, BusOrderEntryParams?): Observable<PaginatedResult<BusOrderEntry[]>> {
    const paginatedResult: PaginatedResult<BusOrderEntry[]> = new PaginatedResult<BusOrderEntry[]>();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (BusOrderEntryParams != null) {
      if (BusOrderEntryParams.date != null) {
        params = params.append('OrderEntryDate', BusOrderEntryParams.date);
      }
      if (BusOrderEntryParams.department != null) {
        params = params.append('DepartmentId', BusOrderEntryParams.department);
      }
      if (BusOrderEntryParams.dormitory != null) {
        params = params.append('dormitoryBlockId', BusOrderEntryParams.dormitory);
      } 
      if (BusOrderEntryParams.OrderBy != null) {
        params = params.append('OrderBy', BusOrderEntryParams.OrderBy);
        params = params.append('isDescending', BusOrderEntryParams.isDesc);
      }
    }
    // console.log(BusOrderEntryParams.date);

    return this.http.get<BusOrderEntry[]>(this.baseUrl + 'BusOrder/paged', { observe: 'response', params })
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
