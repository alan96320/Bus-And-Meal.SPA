import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/_services/employee.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/_models/Employee';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
   selector: 'app-employeeList',
   templateUrl: './employeeList.component.html'
})
export class EmployeeListComponent implements OnInit {
   sortAscHrCoreNo: boolean;
   sortAscFirstname: boolean;
   sortAscLastname: boolean;
   sortAscFullname: boolean;
   sortAscHIDNo: boolean;
   sortAscDepartmentId: boolean;
   filter: boolean = true;

   listDepartments: any;

   //deklarasi untuk get data
   employees: Employee[];
   pagination: Pagination;
   employeeParams: any = {};
   model: any = {};

   constructor(
      private employeeService: EmployeeService,
      private alertify: AlertifyService,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService,
      private http: HttpClient,
   ) { }

   ngOnInit() {
      this.route.data.subscribe(data => {
         this.employees = data["employee"].result;
         this.pagination = data["employee"].pagination;
      });
      this.loadDepartment();
   }

   //karena paginationnya di rancang sendiri jadi, jadi kita harus buat function untuk paginationnya
   // kita array kan dulu jumlah data yang kita dapatkan
   arrayPage() {
      return Array(this.pagination.totalPages);
   }

   // kita buat fungsi untuk sorting by asc or desc
   sortActive(getName) {
      if (getName == "hrCoreNo") {
         this.sortAscHrCoreNo = !this.sortAscHrCoreNo;
         this.employeeParams.OrderBy = getName;
         this.employeeParams.isDesc = this.sortAscHrCoreNo;
         this.loadEmployee();
      }
      if (getName == "firstname") {
         this.sortAscFirstname = !this.sortAscFirstname;
         this.employeeParams.OrderBy = getName;
         this.employeeParams.isDesc = this.sortAscFirstname;
         this.loadEmployee();
      }
      if (getName == "lastname") {
         this.sortAscLastname = !this.sortAscLastname;
         this.employeeParams.OrderBy = getName;
         this.employeeParams.isDesc = this.sortAscLastname;
         this.loadEmployee();
      }
      if (getName == "fullname") {
         this.sortAscFullname = !this.sortAscFullname;
         this.employeeParams.OrderBy = getName;
         this.employeeParams.isDesc = this.sortAscFullname;
         this.loadEmployee();
      }
      if (getName == "hidNo") {
         this.sortAscHIDNo = !this.sortAscHIDNo;
         this.employeeParams.OrderBy = getName;
         this.employeeParams.isDesc = this.sortAscHIDNo;
         this.loadEmployee();
      }
      if (getName == "departmentId") {
         this.sortAscDepartmentId = !this.sortAscDepartmentId;
         this.employeeParams.OrderBy = getName;
         this.employeeParams.isDesc = this.sortAscDepartmentId;
         this.loadEmployee();
      }
   }
   
   // kita buat fungsi untuk ketika tombol page di click
   clickMe(pageMe) {
      this.pagination.currentPage = pageMe;
      this.loadEmployee();
   }

   //kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
   nextPage() {
      if (this.pagination.currentPage != this.pagination.totalPages) {
         this.pagination.currentPage = this.pagination.currentPage + 1;
         this.loadEmployee();
      }
   }

   //kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
   prevPage() {
      if (this.pagination.currentPage != 1) {
         this.pagination.currentPage = this.pagination.currentPage - 1;
         this.loadEmployee();
      }
   }

   //kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
   endPage(Page) {
      if (this.pagination.currentPage != Page) {
         this.pagination.currentPage = Page;
         this.loadEmployee();
      }
   }

   //kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
   startPage() {
      this.pagination.currentPage = 1;
      this.loadEmployee();
   }

   // kita buat fungsi untuk select cange size per page
   changeSize(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.loadEmployee();
   }

   //kita buat fungsi untuk Order By
   OrderBy(hrCoreNo, firstname, lastname, fullname, hIDNo) {
      if (hrCoreNo !== null || firstname !== null || lastname !== null || fullname !== null || hIDNo !== null) {
         this.employeeParams.hrCoreNo = hrCoreNo;
         this.employeeParams.firstname = firstname;
         this.employeeParams.lastname = lastname;
         this.employeeParams.fullname = fullname;
         this.employeeParams.hIDNo = hIDNo;
         this.loadEmployee();
      }
   }

   //lkita buat fungsi cancel Filter
   cancelFilter(status) {
      if (status == "Filter") {
         this.employeeParams.hrCoreNo = null;
         this.employeeParams.firstname = null;
         this.employeeParams.lastname = null;
         this.employeeParams.fullname = null;
         this.employeeParams.hIDNo = null;
         this.loadEmployee();
      }
   }
   
   //for delete data
   deleteEmployee(id: number) {
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
            this.employeeService.deleteEmployee(id).subscribe(
               () => {
                  this.sweetAlert.warningDel();
                  this.loadEmployee();
               },
               error => {
                  this.sweetAlert.warning(error);
               }
            );
         }
      })
   }

   // for laod data
   loadEmployee() {
      this.employeeService
         .getEmployees(
            this.pagination.currentPage,
            this.pagination.pageSize,
            this.employeeParams
         )
         .subscribe(
            (res: PaginatedResult<Employee[]>) => {
               this.employees = res.result;
               this.pagination = res.pagination;
            },
            error => {
               this.sweetAlert.error(error);
            }
         );
   }

   loadDepartment() {
      this.http.get('http://localhost:5000/api/department').subscribe(response => {
         this.listDepartments = response;
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
