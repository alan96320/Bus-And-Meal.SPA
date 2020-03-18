import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, enableProdMode } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";

import { NgbModule, NgbPagination } from "@ng-bootstrap/ng-bootstrap";

import { JwtModule } from "@auth0/angular-jwt";
import { appRouting } from "./routes";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AuthService } from "./_services/auth.service";
import { DepartmentService } from "./_services/department.service";
import { DepartmentDetailResolver } from "./_resolvers/departmentResolver";
import { DepartmentListResolver } from "./_resolvers/departmentResolver";
import { NavbarComponent } from "./layouts/navbar/navbar.component";
import { HomeComponent } from "./pages/home/home.component";
import { PaginationModule } from "../../node_modules/ngx-bootstrap";
import { DepartmentListComponent } from "./pages/configuration/department/departmentList/departmentList.component";
import { DepartmentFormComponent } from "./pages/configuration/department/departmentForm/departmentForm.component";
// tslint:disable-next-line: max-line-length
import { DormitoryBlokAreaListComponent } from "./pages/configuration/dormitoryBlokArea/dormitoryBlokAreaList/dormitoryBlokAreaList.component";
// tslint:disable-next-line:max-line-length
import { DormitoryBlokAreaFormComponent } from "./pages/configuration/dormitoryBlokArea/dormitoryBlokAreaForm/dormitoryBlokAreaForm.component";
import { MealTypeListComponent } from "./pages/configuration/mealType/mealTypeList/mealTypeList.component";
import { MealTypeFormComponent } from "./pages/configuration/mealType/mealTypeForm/mealTypeForm.component";
import { MealVendorListComponent } from "./pages/configuration/mealVendor/mealVendorList/mealVendorList.component";
import { MealVendorFormComponent } from "./pages/configuration/mealVendor/mealVendorForm/mealVendorForm.component";
import { RolesListComponent } from "./pages/configuration/roles/rolesList/rolesList.component";
import { RolesFormComponent } from "./pages/configuration/roles/rolesForm/rolesForm.component";
import { UserListComponent } from "./pages/configuration/user/userList/userList.component";
import { UserFormComponent } from "./pages/configuration/user/userForm/userForm.component";
import { BusOrderEntryListComponent } from "./pages/transaction/busOrderEntry/busOrderEntryList/busOrderEntryList.component";
import { BusOrderEntryFormComponent } from "./pages/transaction/busOrderEntry/busOrderEntryForm/busOrderEntryForm.component";
// tslint:disable-next-line:max-line-length
import { BusOrderVerificationListComponent } from "./pages/transaction/busOrderVerification/busOrderVerificationList/busOrderVerificationList.component";
// tslint:disable-next-line:max-line-length
import { BusOrderVerificationFormComponent } from "./pages/transaction/busOrderVerification/busOrderVerificationForm/busOrderVerificationForm.component";
import { MealOrderEntryListComponent } from "./pages/transaction/mealOrderEntry/mealOrderEntryList/mealOrderEntryList.component";
import { MealOrderEntryFormComponent } from "./pages/transaction/mealOrderEntry/mealOrderEntryForm/mealOrderEntryForm.component";
// tslint:disable-next-line:max-line-length
import { MealOrderVerficationListComponent } from "./pages/transaction/mealOrderVerfication/mealOrderVerficationList/mealOrderVerficationList.component";
// tslint:disable-next-line:max-line-length
import { MealOrderVerficationFormComponent } from "./pages/transaction/mealOrderVerfication/mealOrderVerficationForm/mealOrderVerficationForm.component";
import {
  MealVendorListResolver,
  MealVendorDetailResolver
} from "./_resolvers/mealVendorResolver";
import {
  MealTypeListResolver,
  MealTypeDetailResolver
} from "./_resolvers/mealTypeResolver";
import {
  DormitoryBlockListResolver,
  DormitoryBlockDetailResolver
} from "./_resolvers/dormitoryBlockResolver";
import {
  BusTimeListResolver,
  BusTimeDetailResolver
} from "./_resolvers/busTimeResolver";
import { BusTimeListComponent } from "./pages/configuration/busTime/busTimeList/busTimeList.component";
import { BusTimeFormComponent } from "./pages/configuration/busTime/busTimeForm/busTimeForm.component";
import { ConfigurationFormComponent } from "./pages/configuration/configuration/configurationForm.component";
import { CounterListComponent } from "./pages/configuration/counter/counterList/counterList.component";
import { EmployeeListComponent } from "./pages/configuration/employee/employeeList/employeeList.component";
import { EmployeeFormComponent } from "./pages/configuration/employee/employeeForm/employeeForm.component";
import {
  CounterListResolver,
  CounterDetailResolver
} from "./_resolvers/counterResolver";
import { ConfigurationDetailResolver } from "./_resolvers/configurationResolver";
import {
  EmployeeListResolver,
  EmployeeDetailResolver
} from "./_resolvers/employeeResolver";
import {
  UsersListResolver,
  UsersDetailResolver
} from "./_resolvers/usersResolver";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { DepartmentReportComponent } from "./pages/reports/departmentReport/departmentReport.component";
import { EmployeeReportComponent } from "./pages/reports/employeeReport/employeeReport.component";
import {
  DepartmentReportResolver,
  EmployeeReportResolver,
  MealTypeReportResolver,
  DormitoryBlockReportResolver,
  MealVendorReportResolver,
  BusTimeReportResolver,
  CounterReportResolver,
  UsersReportResolver,
  MealOrderReportResolver,
  BusOrderReportResolver,
  MealVerificationReportResolver,
  BusVerificationReportResolver
} from "./_resolvers/reportResolver";
import { MealTypeReportComponent } from "./pages/reports/mealTypeReport/mealTypeReport.component";
import { DormitoryBlockReportComponent } from "./pages/reports/dormitoryBlockReport/dormitoryBlockReport.component";
import { MealVendorReportComponent } from "./pages/reports/mealVendorReport/mealVendorReport.component";
import { BusTimeReportComponent } from "./pages/reports/busTimeReport/busTimeReport.component";
import { UsersReportComponent } from "./pages/reports/usersReport/usersReport.component";
import { CounterReportComponent } from "./pages/reports/CounterReport/CounterReport.component";
import { MealOrderReportComponent } from "./pages/reports/mealOrderReport/mealOrderReport.component";

import {
  MealOrderEntryListResolver,
  MealOrderEntryDetailResolver
} from "./_resolvers/mealOrderEntryResolver";
import {
  MealOrderVerificationListResolver,
  MealOrderVerificationDetailResolver
} from "./_resolvers/mealOrderVerificationResolver";
import {
  BusOrderEntryListResolver,
  BusOrderEntryDetailResolver
} from "./_resolvers/busOrderEntryResolver";
import {
  BusOrderVerificationListResolver,
  BusOrderVerificationDetailResolver
} from "./_resolvers/busOrderVerificationResolver";
import { ErrorInterceptorProvider } from "./_services/error.interceptor";
import { CounterFormComponent } from "./pages/configuration/counter/CounterForm/CounterForm.component";
import { BusOrderReportComponent } from "./pages/reports/busOrderReport/busOrderReport.component";
import { MealVerificationReportComponent } from "./pages/reports/mealVerificationReport/mealVerificationReport.component";
import { BusVerificationReportComponent } from "./pages/reports/busVerificationReport/busVerificationReport.component";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(appRouting),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ["localhost:5000"],
        blacklistedRoutes: ["localhost:5000/api/auth"]
      }
    }),
    PaginationModule.forRoot(),
    AngularMultiSelectModule
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    // declarations for menu configuration
    DepartmentListComponent,
    DepartmentFormComponent,
    DormitoryBlokAreaListComponent,
    DormitoryBlokAreaFormComponent,
    MealTypeListComponent,
    MealTypeFormComponent,
    MealVendorListComponent,
    MealVendorFormComponent,
    RolesListComponent,
    RolesFormComponent,
    UserListComponent,
    UserFormComponent,
    BusTimeListComponent,
    BusTimeFormComponent,
    ConfigurationFormComponent,
    CounterListComponent,
    CounterFormComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    UserListComponent,
    UserFormComponent,
    // decaration for menu transaction
    BusOrderEntryListComponent,
    BusOrderEntryFormComponent,
    BusOrderVerificationListComponent,
    BusOrderVerificationFormComponent,
    MealOrderEntryListComponent,
    MealOrderEntryFormComponent,
    MealOrderVerficationListComponent,
    MealOrderVerficationFormComponent,

    // decaration for menu report
    DepartmentReportComponent,
    EmployeeReportComponent,
    MealTypeReportComponent,
    DormitoryBlockReportComponent,
    MealVendorReportComponent,
    BusTimeReportComponent,
    CounterReportComponent,
    UsersReportComponent,
    MealOrderReportComponent,
    BusOrderReportComponent,
    MealVerificationReportComponent,
    BusVerificationReportComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: "/" },
    AuthService,
    DepartmentService,
    DepartmentDetailResolver,
    DepartmentListResolver,
    MealVendorListResolver,
    MealVendorDetailResolver,
    MealTypeListResolver,
    MealTypeDetailResolver,
    DormitoryBlockListResolver,
    DormitoryBlockDetailResolver,
    BusTimeListResolver,
    BusTimeDetailResolver,
    CounterListResolver,
    CounterDetailResolver,
    ConfigurationDetailResolver,
    EmployeeListResolver,
    EmployeeDetailResolver,
    UsersListResolver,
    UsersDetailResolver,
    DepartmentReportResolver,
    EmployeeReportResolver,
    MealTypeReportResolver,
    DormitoryBlockReportResolver,
    MealVendorReportResolver,
    BusTimeReportResolver,
    CounterReportResolver,
    UsersReportResolver,
    MealOrderReportResolver,
    BusOrderReportResolver,
    MealVerificationReportResolver,
    BusVerificationReportResolver,
    MealOrderEntryListResolver,
    MealOrderEntryDetailResolver,
    MealOrderVerificationListResolver,
    MealOrderVerificationDetailResolver,
    BusOrderEntryListResolver,
    BusOrderEntryDetailResolver,
    BusOrderVerificationListResolver,
    BusOrderVerificationDetailResolver,
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
