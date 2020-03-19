import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Department } from '../_models/department';
import { DepartmentService } from '../_services/department.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../_services/sweetAlert.service';
import { MealType } from '../_models/mealType';
import { MealTypeService } from '../_services/mealType.service';
import { DormitoryBlock } from '../_models/dormitoryBlock';
import { DormitoryBlockService } from '../_services/dormitoryBlock.service';
import { Employee } from '../_models/employee';
import { EmployeeService } from '../_services/employee.service';
import { MealVendor } from '../_models/mealVendor';
import { MealVendorService } from '../_services/mealVendor.service';
import { BusTime } from '../_models/busTime';
import { BusTimeService } from '../_services/busTime.service';
import { Counter } from '../_models/counter';
import { CounterService } from '../_services/counter.service';
import { Users } from '../_models/users';
import { UsersService } from '../_services/users.service';
import { MealOrder } from '../_models/mealOrder';
import { BusOrder } from '../_models/busOrder';
import { MealOrderEntryService } from '../_services/mealOrderEntry.service';
import { MealOrderVerificationService } from '../_services/mealOrderVerification.service';
import { BusOrderEntryService } from '../_services/busOrderEntry.service';
import { BusOrderVerificationService } from '../_services/busOrderVerification.service';
import { MealVerification } from '../_models/mealVerification';
import { BusVerification } from '../_models/busVerification';

@Injectable()
export class DepartmentReportResolver implements Resolve<Department[]> {
  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Department[]> {
    return this.departmentService.getDepartmentReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class MealTypeReportResolver implements Resolve<MealType[]> {
  constructor(
    private mealTypeService: MealTypeService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealType[]> {
    return this.mealTypeService.getmealTypeReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class DormitoryBlockReportResolver implements Resolve<DormitoryBlock[]> {
  constructor(
    private dormitoryBlockService: DormitoryBlockService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<DormitoryBlock[]> {
    return this.dormitoryBlockService.getDormitoryBlockReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class EmployeeReportResolver implements Resolve<Employee[]> {
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Employee[]> {
    return this.employeeService.getEmployeeReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class MealVendorReportResolver implements Resolve<MealVendor[]> {
  constructor(
    private mealvendorService: MealVendorService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealVendor[]> {
    return this.mealvendorService.getMealVendorReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class BusTimeReportResolver implements Resolve<BusTime[]> {
  constructor(
    private bustimeService: BusTimeService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BusTime[]> {
    return this.bustimeService.getBusTimeReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class CounterReportResolver implements Resolve<Counter[]> {
  constructor(
    private counterService: CounterService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Counter[]> {
    return this.counterService.getCounterReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class UsersReportResolver implements Resolve<Users[]> {
  constructor(
    private usersService: UsersService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Users[]> {
    return this.usersService.getUsersReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class MealOrderReportResolver implements Resolve<MealOrder[]> {
  constructor(
    private mealOrderEntryService: MealOrderEntryService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealOrder[]> {
    return this.mealOrderEntryService.getMealOrderReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class MealVerificationReportResolver
  implements Resolve<MealVerification[]> {
  constructor(
    private mealOrderVerificationService: MealOrderVerificationService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MealVerification[]> {
    return this.mealOrderVerificationService.getMealVerificationReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class BusOrderReportResolver implements Resolve<BusOrder[]> {
  constructor(
    private busOrderEntryService: BusOrderEntryService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BusOrder[]> {
    return this.busOrderEntryService.getBusOrderReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}

@Injectable()
export class BusVerificationReportResolver
  implements Resolve<BusVerification[]> {
  constructor(
    private busOrderVerificationService: BusOrderVerificationService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BusVerification[]> {
    return this.busOrderVerificationService.getBusVerificationReport().pipe(
      catchError(error => {
        this.sweetAlert.error(error);
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
