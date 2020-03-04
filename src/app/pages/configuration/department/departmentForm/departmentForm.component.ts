import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Department } from 'src/app/_models/department';
import { DepartmentService } from 'src/app/_services/department.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

@Component({
   selector: 'app-departmentForm',
   templateUrl: './departmentForm.component.html'
})
export class DepartmentFormComponent implements OnInit {
   @Output() cancelAdd = new EventEmitter();
   model: any = {};
   update: boolean = false;
   department: Department;
   id = +this.route.snapshot.params['id'];

   constructor(
      private departmentService: DepartmentService,
      private alertify: AlertifyService,
      private router: Router,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService
   ) { }

   ngOnInit() {
      this.loadDepartment();
   }

   loadDepartment() {
      if (this.id) {
         this.route.data.subscribe(data => {
            this.model.code = data['department'].code;
            this.model.name = data['department'].name;
            this.update = true;
         });
      }
   }

   submit() {
      if (!this.update) {
         this.addDepartment();
      } else {
         this.updateDepartment();
      }
   }

   addDepartment() {
      console.log(this.model);
      this.departmentService.addDepartment(this.model).subscribe(() => {
         this.sweetAlert.successAdd('Added Successfully');
         this.router.navigate(['/department']);
      }, error => {
            this.sweetAlert.warning(error);
      });
   }

   cancel() {
      this.cancelAdd.emit(false);
   }

   updateDepartment() {
      console.log(this.model);
      this.departmentService.editDepartment(this.id, this.model).subscribe(() => {
         this.sweetAlert.successAdd('Edit Successfully');
         this.router.navigate(['/department']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

}
