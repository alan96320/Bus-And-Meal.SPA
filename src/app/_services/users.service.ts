import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Observable } from 'rxjs';
import { Users } from '../_models/users';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}

  //get employee report
  getUsersReport() {
    return this.http.get(this.baseUrl + "report/users/");
  }

  getUser(id: any): Observable<Users> {
    return this.http.get<Users>(this.baseUrl + 'User/' + id);
  }

  getUsers(page?, itemsPerPage?, employeeParams?): Observable<PaginatedResult<Users[]>> {
    const paginatedResult: PaginatedResult<Users[]> = new PaginatedResult<Users[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (employeeParams != null) {
      if (employeeParams.hrCoreNo != null) {
        params = params.append('HrCoreNo', employeeParams.hrCoreNo);
      }
      if (employeeParams.firstname != null) {
        params = params.append('firstname', employeeParams.firstname);
      }
      if (employeeParams.lastname != null) {
        params = params.append('Lastname', employeeParams.lastname);
      }
      if (employeeParams.fullname != null) {
        params = params.append('Fullname', employeeParams.fullname);
      }
      if (employeeParams.hIDNo != null) {
        params = params.append('HIDNo', employeeParams.hIDNo);
      }
      if (employeeParams.departmentName != null) {
        params = params.append('DepartmentName', employeeParams.departmentName);
      }
      if (employeeParams.OrderBy != null) {
        params = params.append('OrderBy', employeeParams.OrderBy);
        params = params.append('isDescending', employeeParams.isDesc);
      }
    }

    return this.http.get<Users[]>(this.baseUrl + 'User/paged', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );
  }

  deleteUser(id: any) {
    return this.http.delete(this.baseUrl + "User/" + id);
  }

  editUser(id: any, model: any) {
    console.log(model); 
    return this.http.put(this.baseUrl + "User/" + id, model);
  }

}
