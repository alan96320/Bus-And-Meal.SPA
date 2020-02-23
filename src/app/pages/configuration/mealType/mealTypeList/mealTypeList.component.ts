import { Component, OnInit } from '@angular/core';
import { MealTypeService } from 'src/app/_services/MealType.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { MealType } from 'src/app/_models/MealType';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import swal from 'sweetalert2';
import { MealVendorService } from 'src/app/_services/MealVendor.service';
import { MealVendor } from 'src/app/_models/MealVendor';
import { HttpClient } from '@angular/common/http';

@Component({
   selector: 'app-mealTypeList',
   templateUrl: './mealTypeList.component.html'
})
export class MealTypeListComponent implements OnInit {
   //deklarasi untuk pagination custom
   sortAscCode: boolean;
   sortAscName: boolean;
   vendorCode: boolean;
   vendorName: boolean;
   filter: boolean = true;

   //deklarasi untuk get data
   MealTypes: MealType[];
   pagination: Pagination;
   MealTypeParams: any = {};
   model: any = {};
   MealVendors: any;

   constructor(
      private MealTypeService: MealTypeService,
      private alertify: AlertifyService,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService,
      private http: HttpClient,
   ) { }

   ngOnInit() {
      this.route.data.subscribe(data => {
         this.MealTypes = data["MealType"].result;
         this.pagination = data["MealType"].pagination;
      });
      this.loadMealVendors();
   }


   arrayPage() {
      return Array(this.pagination.totalPages);
   }

   sortActive(getName) {
      if (getName == "code") {
         this.sortAscCode = !this.sortAscCode;
         this.MealTypeParams.OrderBy = getName;
         this.MealTypeParams.isDesc = this.sortAscCode;
         this.loadMealTypes();
      }
      if (getName == "name") {
         this.sortAscName = !this.sortAscName;
         this.MealTypeParams.OrderBy = getName;
         this.MealTypeParams.isDesc = this.sortAscName;
         this.loadMealTypes();
      }
      if (getName == "vendorCode") {
         this.vendorCode = !this.vendorCode;
         this.MealTypeParams.OrderBy = 'mealVendorId';
         this.MealTypeParams.isDesc = this.vendorCode;
         this.loadMealTypes();
      }
      if (getName == "vendorName") {
         this.vendorName = !this.vendorName;
         this.MealTypeParams.OrderBy = 'mealVendorId';
         this.MealTypeParams.isDesc = this.vendorName;
         this.loadMealTypes();
      }
   }

   clickMe(pageMe) {
      this.pagination.currentPage = pageMe;
      this.loadMealTypes();
   }

   nextPage() {
      if (this.pagination.currentPage != this.pagination.totalPages) {
         this.pagination.currentPage = this.pagination.currentPage + 1;
         this.loadMealTypes();
      }
   }

   prevPage() {
      if (this.pagination.currentPage != 1) {
         this.pagination.currentPage = this.pagination.currentPage - 1;
         this.loadMealTypes();
      }
   }

   endPage(Page) {
      if (this.pagination.currentPage != Page) {
         this.pagination.currentPage = Page;
         this.loadMealTypes();
      }
   }

   startPage() {
      this.pagination.currentPage = 1;
      this.loadMealTypes();
   }

   changeSize(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.loadMealTypes();
   }

   OrderBy(code, name) {
      if (code !== null || name !== null) {
         this.MealTypeParams.code = code;
         this.MealTypeParams.name = name;
         this.loadMealTypes();
      }
   }

   cancelFilter(status) {
      if (status == "Filter") {
         this.MealTypeParams.code = null;
         this.MealTypeParams.name = null;
         this.loadMealTypes();
      }
   }

   deleteMealType(id: number) {
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
            this.MealTypeService.deleteMealType(id).subscribe(
               () => {
                  this.sweetAlert.warningDel();
                  this.loadMealTypes();
               },
               error => {
                  this.sweetAlert.warning(error);
               }
            );
         }
      })
   }

   loadMealTypes() {
      this.MealTypeService
         .getMealTypes(
            this.pagination.currentPage,
            this.pagination.pageSize,
            this.MealTypeParams
         )
         .subscribe(
            (res: PaginatedResult<MealType[]>) => {
               this.MealTypes = res.result;
               this.pagination = res.pagination;
            },
            error => {
               this.sweetAlert.error(error);
            }
         );
   }

   loadMealVendors() {
      this.http.get('http://localhost:5000/api/MealVendor').subscribe(response => {
         this.MealVendors = response;
      }, error => {
            this.sweetAlert.error(error);
      });
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