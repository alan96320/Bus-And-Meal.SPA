import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MealOrderVerificationServiceService {
  baseUrl = environment.apiUrl;
  itemPerPage = 5;

  constructor(private http: HttpClient) { }

  addMealOrderVerification(model: any) {
    return this.http.post(this.baseUrl + 'MealOrderVerification/', model);
  }
}
