import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Department } from '../_models/department';
import { PaginatedResult } from '../_models/pagination';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}

  // get department report
  getDepartmentReport() {
    return this.http.get(this.baseUrl + 'report/department/');
  }
  // for add data department
  addDepartment(model: any) {
    return this.http.post(this.baseUrl + 'department/', model);
  }

  // for delete data department
  deleteDepartment(id: any) {
    return this.http.delete(this.baseUrl + 'department/' + id);
  }
  // get by ID after update
  getDepartment(id: any): Observable<Department> {
    return this.http.get<Department>(this.baseUrl + 'department/' + id);
  }
  // for edit department
  editDepartment(id: any, model: any) {
    return this.http.put(this.baseUrl + 'department/' + id, model);
  }

  // get all
  getDepartments(
    page?,
    itemsPerPage?,
    departmentParams?
  ): Observable<PaginatedResult<Department[]>> {
    const paginatedResult: PaginatedResult<Department[]> = new PaginatedResult<
      Department[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (departmentParams != null) {
      if (departmentParams.code != null) {
        params = params.append('code', departmentParams.code);
      }
      if (departmentParams.name != null) {
        params = params.append('name', departmentParams.name);
      }
      if (departmentParams.OrderBy != null) {
        params = params.append('OrderBy', departmentParams.OrderBy);
        params = params.append('isDescending', departmentParams.isDesc);
      }
    }

    return this.http
      .get<Department[]>(this.baseUrl + 'department/paged', {
        observe: 'response',
        params
      })
      .pipe(
        map(response => {
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

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.headers}`;
      console.log(error);
      console.log();
    }
    return throwError(errorMessage);
  }
}
