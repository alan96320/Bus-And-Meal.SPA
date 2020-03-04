import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/_services/department.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Department } from 'src/app/_models/department';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import swal from 'sweetalert2';

@Component({
   // tslint:disable-next-line:component-selector
   selector: 'app-departmentList',
   templateUrl: './departmentList.component.html'
})
export class DepartmentListComponent implements OnInit {
   // deklarasi untuk pagination custom
   sortAscCode: boolean;
   sortAscName: boolean;
   filter = true;

   // deklarasi untuk get data
   departments: Department[];
   pagination: Pagination;
   departmentParams: any = {};
   model: any = {};

   constructor(
      private departmentService: DepartmentService,
      private alertify: AlertifyService,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService
   ) { }

   ngOnInit() {
      this.route.data.subscribe(data => {
         this.departments = data.department.result;
         this.pagination = data.department.pagination;
      });
   }

   // karena paginationnya di rancang sendiri jadi, jadi kita harus buat function untuk paginationnya
   // kita array kan dulu jumlah data yang kita dapatkan
   arrayPage() {
      return Array(this.pagination.totalPages);
   }

   // kita buat fungsi untuk sorting by asc or desc
   sortActive(getName) {
      if (getName === 'code') {
         this.sortAscCode = !this.sortAscCode;
         this.departmentParams.OrderBy = getName;
         this.departmentParams.isDesc = this.sortAscCode;
         this.loadDepartment();
      }
      if (getName === 'name') {
         this.sortAscName = !this.sortAscName;
         this.departmentParams.OrderBy = getName;
         this.departmentParams.isDesc = this.sortAscName;
         this.loadDepartment();
      }
   }

   // kita buat fungsi untuk ketika tombol page di click
   clickMe(pageMe) {
      this.pagination.currentPage = pageMe;
      this.loadDepartment();
   }

   // kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
   nextPage() {
      if (this.pagination.currentPage !== this.pagination.totalPages) {
         this.pagination.currentPage = this.pagination.currentPage + 1;
         this.loadDepartment();
      }
   }

   // kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
   prevPage() {
      if (this.pagination.currentPage !== 1) {
         this.pagination.currentPage = this.pagination.currentPage - 1;
         this.loadDepartment();
      }
   }

   // kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
   endPage(Page) {
      if (this.pagination.currentPage !== Page) {
         this.pagination.currentPage = Page;
         this.loadDepartment();
      }
   }

   // kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
   startPage() {
      this.pagination.currentPage = 1;
      this.loadDepartment();
   }

   // kita buat fungsi untuk select cange size per page
   changeSize(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.loadDepartment();
   }

   // kita buat fungsi untuk Order By
   OrderBy(code, name) {
      if (code !== null || name !== null) {
         this.departmentParams.code = code;
         this.departmentParams.name = name;
         this.loadDepartment();
      }
   }

   // lkita buat fungsi cancel Filter
   cancelFilter(status) {
      if (status === 'Filter') {
         this.departmentParams.code = null;
         this.departmentParams.name = null;
         this.loadDepartment();
      }
   }

   // for delete data
   deleteDepartment(id: number) {
      confirm.fire({
         title: 'Are you sure?',
         text: 'You won\'t be able to revert this!',
         icon: 'question',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, cancel!',
         reverseButtons: true
      }).then((result) => {
         if (result.value) {
            this.departmentService.deleteDepartment(id).subscribe(
               () => {
                  this.sweetAlert.warningDel();
                  this.loadDepartment();
               },
               error => {
                  this.sweetAlert.warning(error);
               }
            );
         }
      });
   }

   // for laod data
   loadDepartment() {
      this.departmentService
         .getDepartments(
            this.pagination.currentPage,
            this.pagination.pageSize,
            this.departmentParams
         )
         .subscribe(
            (res: PaginatedResult<Department[]>) => {
               this.departments = res.result;
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
});
