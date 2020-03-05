import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { BusTime } from "../_models/busTime";
import { PaginatedResult } from "../_models/pagination";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BusTimeService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}

  addBusTime(model: any) {
    return this.http.post(this.baseUrl + "BusTime/", model);
  }

  deleteBusTime(id: any) {
    return this.http.delete(this.baseUrl + "BusTime/" + id);
  }

  getBusTime(id: any): Observable<BusTime> {
    return this.http.get<BusTime>(this.baseUrl + "BusTime/" + id);
  }

  editBusTime(id: any, model: any) {
    return this.http.put(this.baseUrl + "BusTime/" + id, model);
  }

  getBusTimes(
    page?,
    itemsPerPage?,
    BusTimeParams?
  ): Observable<PaginatedResult<BusTime[]>> {
    const paginatedResult: PaginatedResult<BusTime[]> = new PaginatedResult<
      BusTime[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (BusTimeParams != null) {
      if (BusTimeParams.code != null) {
        params = params.append("code", BusTimeParams.code);
      }
      if (BusTimeParams.time != null) {
        params = params.append("time", BusTimeParams.time);
      }
      if (BusTimeParams.direction != null) {
        params = params.append("DirectionEnum", BusTimeParams.direction);
      }
      if (BusTimeParams.OrderBy != null) {
        params = params.append("OrderBy", BusTimeParams.OrderBy);
        params = params.append("isDescending", BusTimeParams.isDesc);
      }
    }

    return this.http
      .get<BusTime[]>(this.baseUrl + "BusTime/paged", {
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
