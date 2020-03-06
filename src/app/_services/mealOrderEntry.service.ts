import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MealOrderEntry } from '../_models/mealOrderEntry';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MealOrderEntryService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) { }

  addMealOrderEntry(model: any) {
    return this.http.post(this.baseUrl + 'MealOrder/', model);
  }

  deleteMealOrderEntry(id: any) {
    return this.http.delete(this.baseUrl + 'MealOrder/' + id);
  }

  getMealOrderEntry(id: any): Observable<MealOrderEntry> {
    return this.http.get<MealOrderEntry>(this.baseUrl + 'MealOrder/' + id);
  }

  editMealOrderEntry(id: any, model: any) {
    return this.http.put(this.baseUrl + 'MealOrder/' + id, model);
  }


  getMealOrderEntrys(page?, itemsPerPage?, MealOrderEntryParams?): Observable<PaginatedResult<MealOrderEntry[]>> {
    const paginatedResult: PaginatedResult<MealOrderEntry[]> = new PaginatedResult<MealOrderEntry[]>();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (MealOrderEntryParams != null) {
      if (MealOrderEntryParams.date != null) {
        params = params.append('OrderEntryDate', MealOrderEntryParams.date);
      }
      if (MealOrderEntryParams.department != null) {
        params = params.append('DepartmentId', MealOrderEntryParams.department);
      }
      if (MealOrderEntryParams.OrderBy != null) {
        params = params.append('OrderBy', MealOrderEntryParams.OrderBy);
        params = params.append('isDescending', MealOrderEntryParams.isDesc);
      }
    }
    // console.log(MealOrderEntryParams.date);
    
    return this.http.get<MealOrderEntry[]>(this.baseUrl + 'MealOrder/paged', { observe: 'response', params })
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
