import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MealType } from '../_models/mealType';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})
export class MealTypeService {
   baseUrl = environment.apiUrl;
   itemPerPage = 5;

   constructor(private http: HttpClient, ) { }

   // for add data MealType
   addMealType(model: any) {
      return this.http.post(this.baseUrl + 'MealType/', model);
   }

   // for delete data MealType
   deleteMealType(id: any) {
      return this.http.delete(this.baseUrl + 'MealType/' + id);
   }
   // get by ID after update
   getMealType(id: any): Observable<MealType> {
      return this.http.get<MealType>(this.baseUrl + 'MealType/' + id);
   }
   // for edit MealType
   editMealType(id: any, model: any) {
      return this.http.put(this.baseUrl + 'MealType/' + id, model);
   }

   // get all for per page
   getMealTypes(page?, itemsPerPage?, MealTypeParams?): Observable<PaginatedResult<MealType[]>> {
      const paginatedResult: PaginatedResult<MealType[]> = new PaginatedResult<MealType[]>();

      let params = new HttpParams();
      if (page != null && itemsPerPage != null) {
         params = params.append('pageNumber', page);
         params = params.append('pageSize', itemsPerPage);
      }
      if (MealTypeParams != null) {
         if (MealTypeParams.code != null) {
            params = params.append('code', MealTypeParams.code);
         }
         if (MealTypeParams.name != null) {
            params = params.append('name', MealTypeParams.name);
         }
         if (MealTypeParams.mealVendor != null) {
            params = params.append('vendorName', MealTypeParams.mealVendor);
         }
         if (MealTypeParams.OrderBy != null) {
            params = params.append('OrderBy', MealTypeParams.OrderBy);
            params = params.append('isDescending', MealTypeParams.isDesc);
         }
      }

      return this.http.get<MealType[]>(this.baseUrl + 'MealType/paged', { observe: 'response', params })
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
