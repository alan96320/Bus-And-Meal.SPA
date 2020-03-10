import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { DormitoryBlock } from "../_models/dormitoryBlock";
import { PaginatedResult } from "../_models/pagination";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DormitoryBlockService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}
  //get dormitory block report
  
  getDormitoryBlockReport() {
    return this.http.get(this.baseUrl + "report/dormitoryblock/");
  }

  addDormitoryBlock(model: any) {
    return this.http.post(this.baseUrl + "DormitoryBlock/", model);
  }

  deleteDormitoryBlock(id: any) {
    return this.http.delete(this.baseUrl + "DormitoryBlock/" + id);
  }

  getDormitoryBlock(id: any): Observable<DormitoryBlock> {
    return this.http.get<DormitoryBlock>(this.baseUrl + "DormitoryBlock/" + id);
  }

  editDormitoryBlock(id: any, model: any) {
    return this.http.put(this.baseUrl + "DormitoryBlock/" + id, model);
  }

  getDormitoryBlocks(
    page?,
    itemsPerPage?,
    DormitoryBlockParams?
  ): Observable<PaginatedResult<DormitoryBlock[]>> {
    const paginatedResult: PaginatedResult<DormitoryBlock[]> = new PaginatedResult<
      DormitoryBlock[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (DormitoryBlockParams != null) {
      if (DormitoryBlockParams.code != null) {
        params = params.append("code", DormitoryBlockParams.code);
      }
      if (DormitoryBlockParams.name != null) {
        params = params.append("name", DormitoryBlockParams.name);
      }
      if (DormitoryBlockParams.OrderBy != null) {
        params = params.append("OrderBy", DormitoryBlockParams.OrderBy);
        params = params.append("isDescending", DormitoryBlockParams.isDesc);
      }
    }

    return this.http
      .get<DormitoryBlock[]>(this.baseUrl + "DormitoryBlock/paged", {
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
