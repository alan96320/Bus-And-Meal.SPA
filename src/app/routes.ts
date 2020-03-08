import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

import { DepartmentDetailResolver } from './_resolvers/departmentResolver';
import { DepartmentListResolver } from './_resolvers/departmentResolver';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { DepartmentListComponent } from './pages/configuration/department/departmentList/departmentList.component';
import { DepartmentFormComponent } from './pages/configuration/department/departmentForm/departmentForm.component';
// tslint:disable-next-line:max-line-length
import { DormitoryBlokAreaFormComponent } from './pages/configuration/dormitoryBlokArea/dormitoryBlokAreaForm/dormitoryBlokAreaForm.component';
// tslint:disable-next-line:max-line-length
import { DormitoryBlokAreaListComponent } from './pages/configuration/dormitoryBlokArea/dormitoryBlokAreaList/dormitoryBlokAreaList.component';
import { MealTypeListComponent } from './pages/configuration/mealType/mealTypeList/mealTypeList.component';
import { MealTypeFormComponent } from './pages/configuration/mealType/mealTypeForm/mealTypeForm.component';
import { MealVendorListComponent } from './pages/configuration/mealVendor/mealVendorList/mealVendorList.component';
import { MealVendorFormComponent } from './pages/configuration/mealVendor/mealVendorForm/mealVendorForm.component';
import { RolesListComponent } from './pages/configuration/roles/rolesList/rolesList.component';
import { RolesFormComponent } from './pages/configuration/roles/rolesForm/rolesForm.component';
import { UserListComponent } from './pages/configuration/user/userList/userList.component';
import { UserFormComponent } from './pages/configuration/user/userForm/userForm.component';
import { BusOrderEntryListComponent } from './pages/transaction/busOrderEntry/busOrderEntryList/busOrderEntryList.component';
import { BusOrderEntryFormComponent } from './pages/transaction/busOrderEntry/busOrderEntryForm/busOrderEntryForm.component';
// tslint:disable-next-line:max-line-length
import { BusOrderVerificationListComponent } from './pages/transaction/busOrderVerification/busOrderVerificationList/busOrderVerificationList.component';
// tslint:disable-next-line:max-line-length
import { BusOrderVerificationFormComponent } from './pages/transaction/busOrderVerification/busOrderVerificationForm/busOrderVerificationForm.component';
import { MealOrderEntryListComponent } from './pages/transaction/mealOrderEntry/mealOrderEntryList/mealOrderEntryList.component';
import { MealOrderEntryFormComponent } from './pages/transaction/mealOrderEntry/mealOrderEntryForm/mealOrderEntryForm.component';
// tslint:disable-next-line:max-line-length
import { MealOrderVerficationListComponent } from './pages/transaction/mealOrderVerfication/mealOrderVerficationList/mealOrderVerficationList.component';
// tslint:disable-next-line:max-line-length
import { MealOrderVerficationFormComponent } from './pages/transaction/mealOrderVerfication/mealOrderVerficationForm/mealOrderVerficationForm.component';
import { MealVendorListResolver, MealVendorDetailResolver } from './_resolvers/mealVendorResolver';
import { MealTypeDetailResolver, MealTypeListResolver } from './_resolvers/mealTypeResolver';
import { DormitoryBlockListResolver, DormitoryBlockDetailResolver } from './_resolvers/dormitoryBlockResolver';
import { BusTimeListComponent } from './pages/configuration/busTime/busTimeList/busTimeList.component';
import { BusTimeFormComponent } from './pages/configuration/busTime/busTimeForm/busTimeForm.component';
import { BusTimeListResolver, BusTimeDetailResolver } from './_resolvers/busTimeResolver';
import { ConfigurationFormComponent } from './pages/configuration/configuration/configurationForm.component';
import { CounterListComponent } from './pages/configuration/counter/counterList/counterList.component';
import { CounterFormComponent } from './pages/configuration/counter/counterForm/counterForm.component';
import { EmployeeListComponent } from './pages/configuration/employee/employeeList/employeeList.component';
import { EmployeeFormComponent } from './pages/configuration/employee/employeeForm/employeeForm.component';
import { CounterListResolver, CounterDetailResolver } from './_resolvers/counterResolver';
import { ConfigurationDetailResolver } from './_resolvers/configurationResolver';
import { EmployeeListResolver, EmployeeDetailResolver } from './_resolvers/employeeResolver';
import { UsersListResolver, UsersDetailResolver } from './_resolvers/usersResolver';
import { MealOrderEntryListResolver, MealOrderEntryDetailResolver } from './_resolvers/mealOrderEntryResolver';
import { MealOrderVerificationListResolver, MealOrderVerificationDetailResolver } from './_resolvers/mealOrderVerificationResolver';
import { BusOrderEntryDetailResolver, BusOrderEntryListResolver } from './_resolvers/busOrderEntryResolver';

export const appRouting: Routes = [
    { path: '', component: HomeComponent },
    {
        path : '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            // path for menu configuration
            { path: 'department', component: DepartmentListComponent, resolve: { department: DepartmentListResolver }},
            { path: 'formDepartment', component: DepartmentFormComponent },
            { path: 'formDepartment/:id', component: DepartmentFormComponent, resolve: { department: DepartmentDetailResolver } },
            { path: 'dormitory', component: DormitoryBlokAreaListComponent, resolve: { DormitoryBlock: DormitoryBlockListResolver }},
            { path: 'formDormitory', component: DormitoryBlokAreaFormComponent },
            // tslint:disable-next-line:max-line-length
            { path: 'formDormitory/:id', component: DormitoryBlokAreaFormComponent, resolve: { DormitoryBlock: DormitoryBlockDetailResolver } },
            { path: 'mealType', component: MealTypeListComponent, resolve: { MealType: MealTypeListResolver }},
            { path: 'formMealType', component: MealTypeFormComponent },
            { path: 'formMealType/:id', component: MealTypeFormComponent, resolve: { MealType: MealTypeDetailResolver } },
            { path: 'mealVendor', component: MealVendorListComponent, resolve: { mealVendor: MealVendorListResolver }},
            { path: 'formMealVendor', component: MealVendorFormComponent },
            { path: 'formMealVendor/:id', component: MealVendorFormComponent, resolve: { mealVendor: MealVendorDetailResolver } },
            { path: 'busTime', component: BusTimeListComponent, resolve: { BusTime: BusTimeListResolver } },
            { path: 'formBusTime', component: BusTimeFormComponent },
            { path: 'formBusTime/:id', component: BusTimeFormComponent, resolve: { BusTime: BusTimeDetailResolver } },
            { path: 'roles', component: RolesListComponent },
            { path: 'formRoles', component: RolesFormComponent },
            { path: 'formRoles/:id', component: RolesFormComponent },

            { path: 'user', component: UserListComponent, resolve: { user: UsersListResolver } },
            { path: 'formUser', component: UserFormComponent },
            { path: 'formUser/:id', component: UserFormComponent, resolve: { user: UsersDetailResolver } },

            // tslint:disable-next-line:max-line-length
            { path: 'formConfiguration/:id', component: ConfigurationFormComponent, resolve: { configuration: ConfigurationDetailResolver } },
            { path: 'counter', component: CounterListComponent, resolve: { counter: CounterListResolver } },
            { path: 'formCounter', component: CounterFormComponent },
            { path: 'formCounter/:id', component: CounterFormComponent, resolve: { counter: CounterDetailResolver } },

            { path: 'employee', component: EmployeeListComponent, resolve: { employee: EmployeeListResolver } },
            { path: 'formEmployee', component: EmployeeFormComponent },
            { path: 'formEmployee/:id', component: EmployeeFormComponent, resolve: { employee: EmployeeDetailResolver } },

            // path for menu transaction
            { path: 'busOrderEntry', component: BusOrderEntryListComponent, resolve: { busOrderEntry: BusOrderEntryListResolver } },
            { path: 'formBusOrderEntry', component: BusOrderEntryFormComponent },
            // tslint:disable-next-line:max-line-length
            { path: 'formBusOrderEntry/:id', component: BusOrderEntryFormComponent, resolve: { busOrderEntry: BusOrderEntryDetailResolver } },
            { path: 'busOrderVerification', component: BusOrderVerificationListComponent },
            { path: 'formBusOrderVerification', component: BusOrderVerificationFormComponent },
            { path: 'formBusOrderVerification/:id', component: BusOrderVerificationFormComponent },
            { path: 'mealOrderEntry', component: MealOrderEntryListComponent, resolve: { mealOrderEntry: MealOrderEntryListResolver }  },
            { path: 'formMealOrderEntry', component: MealOrderEntryFormComponent },
            // tslint:disable-next-line:max-line-length
            { path: 'formMealOrderEntry/:id', component: MealOrderEntryFormComponent, resolve: { mealOrderEntry: MealOrderEntryDetailResolver } },

            // tslint:disable-next-line:max-line-length
            { path: 'mealOrderVerification', component: MealOrderVerficationListComponent, resolve: {mealOrderVerification: MealOrderVerificationListResolver}},
            // tslint:disable-next-line:max-line-length
            { path: 'formMealOrderVerification', component: MealOrderVerficationFormComponent},
            // tslint:disable-next-line:max-line-length
            { path: 'formMealOrderVerification/:id', component: MealOrderVerficationFormComponent, resolve: {mealOrderVerification: MealOrderVerificationDetailResolver}},

        ]
    },

    { path: '**', pathMatch: 'full', redirectTo: '' }
];
