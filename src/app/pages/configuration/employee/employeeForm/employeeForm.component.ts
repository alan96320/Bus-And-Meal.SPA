import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Employee } from 'src/app/_models/employee';
import { EmployeeService } from 'src/app/_services/employee.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
   // tslint:disable-next-line:component-selector
   selector: 'app-employeeForm',
   templateUrl: './employeeForm.component.html',
})
export class EmployeeFormComponent implements OnInit {
   @Output() cancelAdd = new EventEmitter();
   model: any = {};
   update = false;
   employee: Employee;
   id = +this.route.snapshot.params.id;
   listDepartments: any;

   constructor(
      private employeeService: EmployeeService,
      private alertify: AlertifyService,
      private router: Router,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService,
      private http: HttpClient,
   ) { }

   ngOnInit() {
      this.loademployee();
      this.loadDepartment();
   }

   loademployee() {
      if (this.id) {
         this.route.data.subscribe(data => {
            this.model.hrCoreNo = data.employee.hrCoreNo;
            this.model.firstname = data.employee.firstname;
            this.model.lastname = data.employee.lastname;
            this.model.fullname = data.employee.fullname;
            this.model.hidNo = data.employee.hidNo;
            this.model.departmentId = data.employee.departmentId;
            this.update = true;
         });
      }
   }
   submit() {
      if (!this.update) {
         this.addEmployee();
      } else {
         this.updateEmployee();
      }
   }

   addEmployee() {
      this.model.isUpdate = false;
      this.employeeService.addEmployee(this.model).subscribe(() => {
         this.sweetAlert.successAdd('Added Successfully');
         this.router.navigate(['/employee']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

   cancel() {
      this.cancelAdd.emit(false);
   }

   updateEmployee() {
      this.model.isUpdate = true;
      this.employeeService.editEmployee(this.id, this.model).subscribe(() => {
         this.sweetAlert.successAdd('Edit Successfully');
         this.router.navigate(['/employee']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

   loadDepartment() {
      this.http.get(environment.apiUrl + 'department').subscribe(response => {
         this.listDepartments = response;
      }, error => {
         this.sweetAlert.error(error);
      });
   }

}
