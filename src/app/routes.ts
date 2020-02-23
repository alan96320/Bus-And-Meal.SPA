import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

import { DepartmentDetailResolver } from './_resolvers/departmentResolver';
import { DepartmentListResolver } from './_resolvers/departmentResolver';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { DepartmentListComponent } from './pages/configuration/department/departmentList/departmentList.component';
import { DepartmentFormComponent } from './pages/configuration/department/departmentForm/departmentForm.component';
import { DormitoryBlokAreaFormComponent } from './pages/configuration/dormitoryBlokArea/dormitoryBlokAreaForm/dormitoryBlokAreaForm.component';
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
import { BusOrderVerificationListComponent } from './pages/transaction/busOrderVerification/busOrderVerificationList/busOrderVerificationList.component';
import { BusOrderVerificationFormComponent } from './pages/transaction/busOrderVerification/busOrderVerificationForm/busOrderVerificationForm.component';
import { MealOrderEntryListComponent } from './pages/transaction/mealOrderEntry/mealOrderEntryList/mealOrderEntryList.component';
import { MealOrderEntryFormComponent } from './pages/transaction/mealOrderEntry/mealOrderEntryForm/mealOrderEntryForm.component';
import { MealOrderVerficationListComponent } from './pages/transaction/mealOrderVerfication/mealOrderVerficationList/mealOrderVerficationList.component';
import { MealOrderVerficationFormComponent } from './pages/transaction/mealOrderVerfication/mealOrderVerficationForm/mealOrderVerficationForm.component';
import { MealVendorListResolver, MealVendorDetailResolver } from './_resolvers/mealVendorResolver';
import { MealTypeDetailResolver, MealTypeListResolver } from './_resolvers/mealTypeResolver';
import { DormitoryBlockListResolver, DormitoryBlockDetailResolver } from './_resolvers/dormitoryBlockResolver';

export const appRouting:Routes = [
    { path: '', component: HomeComponent },
    {
        path :'',
        runGuardsAndResolvers:'always',
        canActivate:[AuthGuard],
        children:[
            { path: 'dashboard', component: DashboardComponent },
            //path for menu configuration
            { path: 'department', component: DepartmentListComponent, resolve: { department: DepartmentListResolver }},
            { path: 'formDepartment', component: DepartmentFormComponent },
            { path: 'formDepartment/:id', component: DepartmentFormComponent, resolve: { department: DepartmentDetailResolver } },
            { path: 'dormitory', component: DormitoryBlokAreaListComponent, resolve: { DormitoryBlock: DormitoryBlockListResolver }},
            { path: 'formDormitory', component: DormitoryBlokAreaFormComponent },
            { path: 'formDormitory/:id', component: DormitoryBlokAreaFormComponent, resolve: { DormitoryBlock: DormitoryBlockDetailResolver } },
            { path: 'mealType', component: MealTypeListComponent, resolve: { MealType: MealTypeListResolver }},
            { path: 'formMealType', component: MealTypeFormComponent },
            { path: 'formMealType/:id', component: MealTypeFormComponent, resolve: { MealType: MealTypeDetailResolver } },
            { path: 'mealVendor', component: MealVendorListComponent, resolve: { mealVendor: MealVendorListResolver }},
            { path: 'formMealVendor', component: MealVendorFormComponent },
            { path: 'formMealVendor/:id', component: MealVendorFormComponent, resolve: { mealVendor: MealVendorDetailResolver } },
            { path: 'roles', component: RolesListComponent },
            { path: 'formRoles', component: RolesFormComponent },
            { path: 'formRoles/:id', component: RolesFormComponent },
            { path: 'user', component: UserListComponent },
            { path: 'formUser', component: UserFormComponent },
            { path: 'formUser/:id', component: UserFormComponent },
            //path for menu transaction
            { path: 'busOrderEntry', component: BusOrderEntryListComponent },
            { path: 'formBusOrderEntry', component: BusOrderEntryFormComponent },
            { path: 'formBusOrderEntry/:id', component: BusOrderEntryFormComponent },
            { path: 'busOrderVerification', component: BusOrderVerificationListComponent },
            { path: 'formBusOrderVerification', component: BusOrderVerificationFormComponent },
            { path: 'formBusOrderVerification/:id', component: BusOrderVerificationFormComponent },
            { path: 'mealOrderEntry', component: MealOrderEntryListComponent },
            { path: 'formMealOrderEntry', component: MealOrderEntryFormComponent },
            { path: 'formMealOrderEntry/:id', component: MealOrderEntryFormComponent },
            { path: 'mealOrderVerification', component: MealOrderVerficationListComponent },
            { path: 'formMealOrderVerification', component: MealOrderVerficationFormComponent },
            { path: 'formMealOrderVerification/:id', component: MealOrderVerficationFormComponent },

        ]
    },
    
    { path: '**', pathMatch: 'full', redirectTo: '' }
];