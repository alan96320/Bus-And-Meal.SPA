import { Component, OnInit } from '@angular/core';
import { CounterService } from 'src/app/_services/Counter.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Counter } from 'src/app/_models/Counter';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import swal from 'sweetalert2';

@Component({
   // tslint:disable-next-line:component-selector
   selector: 'app-counterList',
   templateUrl: './counterList.component.html',
})
export class CounterListComponent implements OnInit {
   // deklarasi untuk pagination custom
   sortAscCode: boolean;
   sortAscName: boolean;
   sortAscLocation: boolean;
   sortAscStatus: boolean;
   filter = true;

   // deklarasi untuk get data
   Counters: Counter[];
   pagination: Pagination;
   CounterParams: any = {};
   model: any = {};

   constructor(
      // tslint:disable-next-line:no-shadowed-variable
      private CounterService: CounterService,
      private alertify: AlertifyService,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService
   ) { }

   ngOnInit() {
      this.route.data.subscribe(data => {
         this.Counters = data.counter.result;
         this.pagination = data.counter.pagination;
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
         this.CounterParams.OrderBy = getName;
         this.CounterParams.isDesc = this.sortAscCode;
         this.loadCounter();
      }
      if (getName === 'name') {
         this.sortAscName = !this.sortAscName;
         this.CounterParams.OrderBy = getName;
         this.CounterParams.isDesc = this.sortAscName;
         this.loadCounter();
      }
      if (getName === 'location') {
         this.sortAscLocation = !this.sortAscLocation;
         this.CounterParams.OrderBy = getName;
         this.CounterParams.isDesc = this.sortAscLocation;
         this.loadCounter();
      }
      if (getName === 'status') {
         this.sortAscStatus = !this.sortAscStatus;
         this.CounterParams.OrderBy = getName;
         this.CounterParams.isDesc = this.sortAscStatus;
         this.loadCounter();
      }
   }

   // kita buat fungsi untuk ketika tombol page di click
   clickMe(pageMe) {
      this.pagination.currentPage = pageMe;
      this.loadCounter();
   }

   // kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
   nextPage() {
      if (this.pagination.currentPage !== this.pagination.totalPages) {
         this.pagination.currentPage = this.pagination.currentPage + 1;
         this.loadCounter();
      }
   }

   // kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
   prevPage() {
      if (this.pagination.currentPage !== 1) {
         this.pagination.currentPage = this.pagination.currentPage - 1;
         this.loadCounter();
      }
   }

   // kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
   endPage(Page) {
      if (this.pagination.currentPage !== Page) {
         this.pagination.currentPage = Page;
         this.loadCounter();
      }
   }

   // kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
   startPage() {
      this.pagination.currentPage = 1;
      this.loadCounter();
   }

   // kita buat fungsi untuk select cange size per page
   changeSize(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.loadCounter();
   }

   // kita buat fungsi untuk Order By
   OrderBy(code, name, location, status) {
      if (code !== null || name !== null || location !== null) {
         this.CounterParams.code = code;
         this.CounterParams.name = name;
         this.CounterParams.location = location;
         this.CounterParams.status = status;
         this.loadCounter();
      }
   }

   // lkita buat fungsi cancel Filter
   cancelFilter(status) {
      if (status === 'Filter') {
         this.CounterParams.code = null;
         this.CounterParams.name = null;
         this.CounterParams.location = null;
         this.CounterParams.status = null;
         this.loadCounter();
      }
   }

   // for delete data
   deleteCounter(id: number) {
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
            this.CounterService.deleteCounter(id).subscribe(
               () => {
                  this.sweetAlert.warningDel();
                  this.loadCounter();
               },
               error => {
                  this.sweetAlert.warning(error);
               }
            );
         }
      });
   }

   // for laod data
   loadCounter() {
      this.CounterService
         .getCounters(
            this.pagination.currentPage,
            this.pagination.pageSize,
            this.CounterParams
         )
         .subscribe(
            (res: PaginatedResult<Counter[]>) => {
               this.Counters = res.result;
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
