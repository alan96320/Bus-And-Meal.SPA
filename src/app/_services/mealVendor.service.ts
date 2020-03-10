import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { MealVendor } from "../_models/mealVendor";
import { PaginatedResult } from "../_models/pagination";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MealVendorService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}
  
  //get meal vendor report
  getMealVendorReport() {
    return this.http.get(this.baseUrl + "report/mealVendor/");
  }

  //for add data MealVendor
  addMealVendor(model: any) {
    return this.http.post(this.baseUrl + "mealVendor/", model);
  }

  //for delete data MealVendor
  deleteMealVendor(id: any) {
    return this.http.delete(this.baseUrl + "mealVendor/" + id);
  }
  //get by ID after update
  getMealVendor(id: any): Observable<MealVendor> {
    return this.http.get<MealVendor>(this.baseUrl + "mealVendor/" + id);
  }
  //for edit MealVendor
  editMealVendor(id: any, model: any) {
    return this.http.put(this.baseUrl + "mealVendor/" + id, model);
  }

  //get all
  getMealVendors(
    page?,
    itemsPerPage?,
    MealVendorParams?
  ): Observable<PaginatedResult<MealVendor[]>> {
    const paginatedResult: PaginatedResult<MealVendor[]> = new PaginatedResult<
      MealVendor[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (MealVendorParams != null) {
      if (MealVendorParams.code != null) {
        params = params.append("code", MealVendorParams.code);
      }
      if (MealVendorParams.name != null) {
        params = params.append("name", MealVendorParams.name);
      }
      if (MealVendorParams.ContactName != null) {
        params = params.append("ContactName", MealVendorParams.ContactName);
      }
      if (MealVendorParams.ContactPhone != null) {
        params = params.append("ContactPhone", MealVendorParams.ContactPhone);
      }
      if (MealVendorParams.ContactEmail != null) {
        params = params.append("ContactEmail", MealVendorParams.ContactEmail);
      }
      if (MealVendorParams.OrderBy != null) {
        params = params.append("OrderBy", MealVendorParams.OrderBy);
        params = params.append("isDescending", MealVendorParams.isDesc);
      }
    }

    return this.http
      .get<MealVendor[]>(this.baseUrl + "MealVendor/paged", {
        observe: "response",
        params
      })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginatedResult;
        })
      );
  }
}
