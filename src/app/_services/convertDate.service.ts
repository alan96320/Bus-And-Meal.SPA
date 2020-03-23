import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertDateService {

  constructor() { }

  convertAB(date) { // for dd-mm-yyyy to yyyy-mm-dd
    const d = date.substr(0, 2);
    const m = date.substr(3, 2);
    const y = date.substr(6, 4);
    const newdate = y + '-' + m + '-' + d;
    return newdate;
  }

  convertBA(date) { // for yyyy-mm-dd to dd-mm-yyyy
    const d = date.substr(8, 2);
    const m = date.substr(5, 2);
    const y = date.substr(0, 4);
    const newdate = d + '-' + m + '-' + y;
    return newdate;
  }

}
