import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { MealType } from "../_models/mealType";
import { PaginatedResult } from "../_models/pagination";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BusOrderService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // get meal order report
  getBusOrderReport() {
    return this.http.get(this.baseUrl + "report/busorder/");
  }
}
