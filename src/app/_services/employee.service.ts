import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Employee } from "../_models/employee";
import { PaginatedResult } from "../_models/pagination";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EmployeeService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) {}
  //get employee report
  getEmployeeReport() {
    return this.http.get(this.baseUrl + "report/employee/");
  }


  //for add data Employee
  addEmployee(model: any) {
    return this.http.post(this.baseUrl + "employee/", model);
  }

  //for delete data Employee
  deleteEmployee(id: any) {
    return this.http.delete(this.baseUrl + "employee/" + id);
  }
  //get by ID after update
  getEmployee(id: any): Observable<Employee> {
    return this.http.get<Employee>(this.baseUrl + "employee/" + id);
  }
  //for edit Employee
  editEmployee(id: any, model: any) {
    return this.http.put(this.baseUrl + "employee/" + id, model);
  }

  //get all
  getEmployees(
    page?,
    itemsPerPage?,
    employeeParams?
  ): Observable<PaginatedResult<Employee[]>> {
    const paginatedResult: PaginatedResult<Employee[]> = new PaginatedResult<
      Employee[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (employeeParams != null) {
      if (employeeParams.hrCoreNo != null) {
        params = params.append("HrCoreNo", employeeParams.hrCoreNo);
      }
      if (employeeParams.firstname != null) {
        params = params.append("firstname", employeeParams.firstname);
      }
      if (employeeParams.lastname != null) {
        params = params.append("Lastname", employeeParams.lastname);
      }
      if (employeeParams.fullname != null) {
        params = params.append("Fullname", employeeParams.fullname);
      }
      if (employeeParams.hIDNo != null) {
        params = params.append("HIDNo", employeeParams.hIDNo);
      }
      if (employeeParams.departmentName != null) {
        params = params.append("DepartmentName", employeeParams.departmentName);
      }
      if (employeeParams.OrderBy != null) {
        params = params.append("OrderBy", employeeParams.OrderBy);
        params = params.append("isDescending", employeeParams.isDesc);
      }
    }

    return this.http
      .get<Employee[]>(this.baseUrl + "Employee/paged", {
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
