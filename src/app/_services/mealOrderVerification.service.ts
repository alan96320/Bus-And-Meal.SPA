import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { MealOrderVerification } from "../_models/mealOrderVerification";
import { PaginatedResult } from "../_models/pagination";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MealOrderVerificationService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}

  // get meal order report
  getMealVerificationReport() {
    return this.http.get(this.baseUrl + "report/mealverification/");
  }

  addMealOrderVerification(model: any) {
    return this.http.post(this.baseUrl + "MealOrderVerification/", model);
  }

  getMealOrderVerification(id: any): Observable<MealOrderVerification> {
    return this.http.get<MealOrderVerification>(
      this.baseUrl + "MealOrderVerification/" + id
    );
  }

  deleteMealOrderVerification(id: any) {
    return this.http.delete(this.baseUrl + "MealOrderVerification/" + id);
  }

  editMealOrderVerificationVerification(id: any, model: any) {
    return this.http.put(this.baseUrl + "MealOrderVerification/" + id, model);
  }

  getMealOrderVerifications(
    page?,
    itemsPerPage?,
    MealOrderVerificationParams?
  ): Observable<PaginatedResult<MealOrderVerification[]>> {
    const paginatedResult: PaginatedResult<MealOrderVerification[]> = new PaginatedResult<
      MealOrderVerification[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (MealOrderVerificationParams != null) {
      if (MealOrderVerificationParams.date != null) {
        params = params.append(
          "OrderEntryDate",
          MealOrderVerificationParams.date
        );
      }
      if (MealOrderVerificationParams.department != null) {
        params = params.append(
          "DepartmentId",
          MealOrderVerificationParams.department
        );
      }
      if (MealOrderVerificationParams.OrderBy != null) {
        params = params.append("OrderBy", MealOrderVerificationParams.OrderBy);
        params = params.append(
          "isDescending",
          MealOrderVerificationParams.isDesc
        );
      }
    }
    // console.log(MealOrderVerificationParams.date);

    return this.http
      .get<MealOrderVerification[]>(
        this.baseUrl + "MealOrderVerification/paged",
        { observe: "response", params }
      )
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
