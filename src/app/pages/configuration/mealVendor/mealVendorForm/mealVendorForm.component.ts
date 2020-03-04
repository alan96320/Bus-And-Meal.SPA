import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { MealVendor } from 'src/app/_models/MealVendor';
import { MealVendorService } from 'src/app/_services/MealVendor.service';

@Component({
   // tslint:disable-next-line:component-selector
   selector: 'app-mealVendorForm',
   templateUrl: './mealVendorForm.component.html'
})
export class MealVendorFormComponent implements OnInit {
   @Output() cancelAdd = new EventEmitter();
   model: any = {};
   update = false;
   mealVendors: MealVendor;
   id = +this.route.snapshot.params.id;

   constructor(
      private mealVendorService: MealVendorService,
      private alertify: AlertifyService,
      private router: Router,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService
   ) { }

   ngOnInit() {
      this.loadMealVendors();
   }

   loadMealVendors() {
      if (this.id) {
         this.route.data.subscribe(data => {
         this.model.code = data.mealVendor.code;
         this.model.name = data.mealVendor.name;
         this.model.contactName = data.mealVendor.contactName;
         this.model.contactPhone = data.mealVendor.contactPhone;
         this.model.contactEmail = data.mealVendor.contactEmail;
         this.update = true;
         });
      }
   }

   submit() {
      if (!this.update) {
         this.addMealVendor();
      } else {
         this.updateMealVendor();
      }
   }

   addMealVendor() {
      console.log(this.model);
      this.mealVendorService.addMealVendor(this.model).subscribe(() => {
         this.sweetAlert.successAdd('Added Successfully');
         this.router.navigate(['/mealVendor']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

   cancel() {
      this.cancelAdd.emit(false);
   }

   updateMealVendor() {
      console.log(this.model);
      this.mealVendorService.editMealVendor(this.id, this.model).subscribe(() => {
         this.sweetAlert.successAdd('Edit Successfully');
         this.router.navigate(['/mealVendor']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }


}
