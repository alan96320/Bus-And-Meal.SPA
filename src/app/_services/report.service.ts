import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { MealOrder } from '../_models/mealOrder';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { MealOrderVerification } from '../_models/mealOrderVerification';
import { BusOrder } from '../_models/busOrder';
import { BusOrderVerification } from '../_models/busOrderVerification';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getMealOrderReports(mealOrderReortParams?): Observable<PaginatedResult<MealOrder[]>> {
    const paginatedResult: PaginatedResult<MealOrder[]> = new PaginatedResult<MealOrder[]>();
    let params = new HttpParams();
    if (mealOrderReortParams != null) {
      if (mealOrderReortParams.startDate != null) {
        params = params.append('StartDate', mealOrderReortParams.startDate);
      }
      if (mealOrderReortParams.endDate != null) {
        params = params.append('EndDate', mealOrderReortParams.endDate);
      }
      if (mealOrderReortParams.department != null) {
        params = params.append('DepartmentId', mealOrderReortParams.department);
      }
    }
    return this.http.get<MealOrder[]>(this.baseUrl + 'report/mealorder', { observe: 'response', params }).pipe(map(response => {
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

  getMealVerificationReports(mealVerificationReportParams?): Observable<PaginatedResult<MealOrderVerification[]>> {
    const paginatedResult: PaginatedResult<MealOrderVerification[]> = new PaginatedResult<MealOrderVerification[]>();
    let params = new HttpParams();
    if (mealVerificationReportParams != null) {
      if (mealVerificationReportParams.startDate != null) {
        params = params.append('StartDate', mealVerificationReportParams.startDate);
      }
      if (mealVerificationReportParams.endDate != null) {
        params = params.append('EndDate', mealVerificationReportParams.endDate);
      }
      if (mealVerificationReportParams.department != null) {
        params = params.append('DepartmentId', mealVerificationReportParams.department);
      }
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<MealOrderVerification[]>(this.baseUrl + 'report/mealverification', { observe: 'response', params }).pipe(map(response => {
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

  getBusOrderReports(mealBusReortParams?): Observable<PaginatedResult<BusOrder[]>> {
    const paginatedResult: PaginatedResult<BusOrder[]> = new PaginatedResult<BusOrder[]>();
    let params = new HttpParams();
    if (mealBusReortParams != null) {
      if (mealBusReortParams.startDate != null) {
        params = params.append('StartDate', mealBusReortParams.startDate);
      }
      if (mealBusReortParams.endDate != null) {
        params = params.append('EndDate', mealBusReortParams.endDate);
      }
      if (mealBusReortParams.department != null) {
        params = params.append('DepartmentId', mealBusReortParams.department);
      }
    }
    return this.http.get<BusOrder[]>(this.baseUrl + 'report/busorder', { observe: 'response', params }).pipe(map(response => {
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

  getBusVerificationReports(busVerificationReportParams?): Observable<PaginatedResult<BusOrderVerification[]>> {
    const paginatedResult: PaginatedResult<BusOrderVerification[]> = new PaginatedResult<BusOrderVerification[]>();
    let params = new HttpParams();
    if (busVerificationReportParams != null) {
      if (busVerificationReportParams.startDate != null) {
        params = params.append('StartDate', busVerificationReportParams.startDate);
      }
      if (busVerificationReportParams.endDate != null) {
        params = params.append('EndDate', busVerificationReportParams.endDate);
      }
      if (busVerificationReportParams.department != null) {
        params = params.append('DepartmentId', busVerificationReportParams.department);
      }
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<BusOrderVerification[]>(this.baseUrl + 'report/busverification', { observe: 'response', params }).pipe(map(response => {
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
}


