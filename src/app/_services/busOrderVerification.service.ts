import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BusOrderVerification } from "../_models/busOrderVerification";
import { PaginatedResult } from "../_models/pagination";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BusOrderVerificationService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}

  // get meal order report
  getBusVerificationReport() {
    return this.http.get(this.baseUrl + "report/busverification/");
  }

  addBusOrderVerification(model: any) {
    return this.http.post(this.baseUrl + "BusOrderVerification/", model);
  }

  editBusOrderVerification(id: any, model: any) {
    return this.http.put(this.baseUrl + "BusOrderVerification/" + id, model);
  }

  getBusOrderVerification(id: any): Observable<BusOrderVerification> {
    return this.http.get<BusOrderVerification>(
      this.baseUrl + "BusOrderVerification/" + id
    );
  }

  deleteBusOrderVerification(id: any) {
    return this.http.delete(this.baseUrl + "BusOrderVerification/" + id);
  }

  getBusOrderVerifications(
    page?,
    itemsPerPage?,
    BusOrderVerificationParams?
  ): Observable<PaginatedResult<BusOrderVerification[]>> {
    const paginatedResult: PaginatedResult<BusOrderVerification[]> = new PaginatedResult<
      BusOrderVerification[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (BusOrderVerificationParams != null) {
      if (BusOrderVerificationParams.date != null) {
        params = params.append(
          "OrderEntryDate",
          BusOrderVerificationParams.date
        );
      }
      if (BusOrderVerificationParams.department != null) {
        params = params.append(
          "DepartmentId",
          BusOrderVerificationParams.department
        );
      }
      if (BusOrderVerificationParams.OrderBy != null) {
        params = params.append("OrderBy", BusOrderVerificationParams.OrderBy);
        params = params.append(
          "isDescending",
          BusOrderVerificationParams.isDesc
        );
      }
    }
    // console.log(BusOrderVerificationParams.date);

    return this.http
      .get<BusOrderVerification[]>(
        this.baseUrl + "BusOrderVerification/paged",
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
