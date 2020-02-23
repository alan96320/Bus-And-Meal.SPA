import { Component, OnInit } from '@angular/core';
import { MealVendorService } from 'src/app/_services/MealVendor.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { MealVendor } from 'src/app/_models/MealVendor';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import swal from 'sweetalert2';

@Component({
   selector: 'app-mealVendorList',
   templateUrl: './mealVendorList.component.html'
})
export class MealVendorListComponent implements OnInit {
   //deklarasi untuk pagination custom
   sortAscCode: boolean;
   sortAscName: boolean;
   ContactName: boolean;
   ContactPhone: boolean;
   ContactEmail: boolean;
   filter: boolean = true;

   //deklarasi untuk get data
   mealVendors: MealVendor[];
   pagination: Pagination;
   mealVendorParams: any = {};
   model: any = {};

   constructor(
      private mealVendorService: MealVendorService,
      private alertify: AlertifyService,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService
   ) { }

   ngOnInit() {
      this.route.data.subscribe(data => {
         this.mealVendors = data["mealVendor"].result;
         this.pagination = data["mealVendor"].pagination;
      });
   }
   
   arrayPage() {
      return Array(this.pagination.totalPages);
   }

   sortActive(getName) {
      if (getName == "code") {
         this.sortAscCode = !this.sortAscCode;
         this.mealVendorParams.OrderBy = getName;
         this.mealVendorParams.isDesc = this.sortAscCode;
         this.loadMealVendors();
      }
      if (getName == "name") {
         this.sortAscName = !this.sortAscName;
         this.mealVendorParams.OrderBy = getName;
         this.mealVendorParams.isDesc = this.sortAscName;
         this.loadMealVendors();
      }
      if (getName == "ContactName") {
         this.ContactName = !this.ContactName;
         this.mealVendorParams.OrderBy = getName;
         this.mealVendorParams.isDesc = this.ContactName;
         this.loadMealVendors();
      }
      if (getName == "ContactPhone") {
         this.ContactPhone = !this.ContactPhone;
         this.mealVendorParams.OrderBy = getName;
         this.mealVendorParams.isDesc = this.ContactPhone;
         this.loadMealVendors();
      }
      if (getName == "ContactEmail") {
         this.ContactEmail = !this.ContactEmail;
         this.mealVendorParams.OrderBy = getName;
         this.mealVendorParams.isDesc = this.ContactEmail;
         this.loadMealVendors();
      }
   }

   clickMe(pageMe) {
      this.pagination.currentPage = pageMe;
      this.loadMealVendors();
   }

   nextPage() {
      if (this.pagination.currentPage != this.pagination.totalPages) {
         this.pagination.currentPage = this.pagination.currentPage + 1;
         this.loadMealVendors();
      }
   }

   prevPage() {
      if (this.pagination.currentPage != 1) {
         this.pagination.currentPage = this.pagination.currentPage - 1;
         this.loadMealVendors();
      }
   }

   endPage(Page) {
      if (this.pagination.currentPage != Page) {
         this.pagination.currentPage = Page;
         this.loadMealVendors();
      }
   }

   startPage() {
      this.pagination.currentPage = 1;
      this.loadMealVendors();
   }

   changeSize(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.loadMealVendors();
   }

   OrderBy(code, name, ContactName, ContactPhone, ContactEmail) {
      if (code !== null || name !== null || ContactName !== null || ContactPhone !== null || ContactEmail !== null) {
         this.mealVendorParams.code = code;
         this.mealVendorParams.name = name;
         this.mealVendorParams.ContactName = ContactName;
         this.mealVendorParams.ContactPhone = ContactPhone;
         this.mealVendorParams.ContactEmail = ContactEmail;
         this.loadMealVendors();
      }
   }

   cancelFilter(status) {
      if (status == "Filter") {
         this.mealVendorParams.code = null;
         this.mealVendorParams.name = null;
         this.mealVendorParams.ContactName = null;
         this.mealVendorParams.ContactPhone = null;
         this.mealVendorParams.ContactEmail = null;
         this.loadMealVendors();
      }
   }

   deleteMealVendor(id: number) {
      confirm.fire({
         title: 'Are you sure?',
         text: "You won't be able to revert this!",
         icon: 'question',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, cancel!',
         reverseButtons: true
      }).then((result) => {
         if (result.value) {
            this.mealVendorService.deleteMealVendor(id).subscribe(
               () => {
                  this.sweetAlert.warningDel();
                  this.loadMealVendors();
               },
               error => {
                  this.sweetAlert.warning(error);
               }
            );
         }
      })
   }

   loadMealVendors() {
      this.mealVendorService
         .getMealVendors(
            this.pagination.currentPage,
            this.pagination.pageSize,
            this.mealVendorParams
         )
         .subscribe(
            (res: PaginatedResult<MealVendor[]>) => {
               this.mealVendors = res.result;
               this.pagination = res.pagination;
            },
            error => {
               this.sweetAlert.error(error);
            }
         );
   }

}

// for custom class sweet alert
const confirm = swal.mixin({
   customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
   },
   buttonsStyling: false
})
