import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { MealOrderEntry } from 'src/app/_models/mealOrderEntry';
import { MealOrderEntryService } from 'src/app/_services/mealOrderEntry.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mealOrderEntryList',
  templateUrl: './mealOrderEntryList.component.html',
  styleUrls: ['./mealOrderEntryList.component.css']
})
export class MealOrderEntryListComponent implements OnInit {
  sortAscHrCoreNo: boolean;
  sortAscFirstname: boolean;
  sortAscLastname: boolean;
  sortAscFullname: boolean;
  sortAscHIDNo: boolean;
  sortAscDepartmentId: boolean;
  filter = true;

  listDepartments: any;
  mealTypes: any;

  // deklarasi untuk get data
  MealOrderEntrys: MealOrderEntry[];
  pagination: Pagination;
  MealOrderEntrysParams: any = {};
  model: any = {};

  constructor(
    private mealOrderEntryService: MealOrderEntryService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadDepartment();
    this.loadMealType();
    this.route.data.subscribe(data => {
      this.MealOrderEntrys = data.mealOrderEntry.result;
      this.pagination = data.mealOrderEntry.pagination;
      console.log(this.MealOrderEntrys);
    });
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName === 'hrCoreNo') {
      this.sortAscHrCoreNo = !this.sortAscHrCoreNo;
      this.MealOrderEntrysParams.OrderBy = getName;
      this.MealOrderEntrysParams.isDesc = this.sortAscHrCoreNo;
      this.loadMealOrderEntrys();
    }
  }

  // kita buat fungsi untuk ketika tombol page di click
  clickMe(pageMe) {
    this.pagination.currentPage = pageMe;
    this.loadMealOrderEntrys();
  }

  // kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
  nextPage() {
    if (this.pagination.currentPage !== this.pagination.totalPages) {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.loadMealOrderEntrys();
    }
  }

  // kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
  prevPage() {
    if (this.pagination.currentPage !== 1) {
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.loadMealOrderEntrys();
    }
  }

  // kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
  endPage(Page) {
    if (this.pagination.currentPage !== Page) {
      this.pagination.currentPage = Page;
      this.loadMealOrderEntrys();
    }
  }

  // kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
  startPage() {
    this.pagination.currentPage = 1;
    this.loadMealOrderEntrys();
  }

  // kita buat fungsi untuk select cange size per page
  changeSize(size) {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.loadMealOrderEntrys();
  }

  // kita buat fungsi untuk Order By
  OrderBy(hrCoreNo, firstname, lastname, fullname, hIDNo, department) {
    if (hrCoreNo !== null || firstname !== null || lastname !== null || fullname !== null || hIDNo !== null || department !== null) {
      this.MealOrderEntrysParams.hrCoreNo = hrCoreNo;
      this.MealOrderEntrysParams.firstname = firstname;
      this.MealOrderEntrysParams.lastname = lastname;
      this.MealOrderEntrysParams.fullname = fullname;
      this.MealOrderEntrysParams.hIDNo = hIDNo;
      this.MealOrderEntrysParams.departmentName = department;
      this.loadMealOrderEntrys();
    }
  }

  // lkita buat fungsi cancel Filter
  cancelFilter(status) {
    if (status === 'Filter') {
      this.MealOrderEntrysParams.hrCoreNo = null;
      this.MealOrderEntrysParams.firstname = null;
      this.MealOrderEntrysParams.lastname = null;
      this.MealOrderEntrysParams.fullname = null;
      this.MealOrderEntrysParams.hIDNo = null;
      this.MealOrderEntrysParams.departmentName = null;
      this.loadMealOrderEntrys();
    }
  }

  // for delete data
  deleteMealOrderEntrys(id: number) {
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
        this.mealOrderEntryService.deleteMealOrderEntry(id).subscribe(
          () => {
            this.sweetAlert.warningDel();
            this.loadMealOrderEntrys();
          },
          error => {
            this.sweetAlert.warning(error);
          }
        );
      }
    });
  }

  // for laod data
  loadMealOrderEntrys() {
    this.mealOrderEntryService
      .getMealOrderEntrys(
        this.pagination.currentPage,
        this.pagination.pageSize,
        this.MealOrderEntrysParams
      )
      .subscribe(
        (res: PaginatedResult<MealOrderEntry[]>) => {
          this.MealOrderEntrys = res.result;
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

  loadMealType() {
    this.http.get('http://localhost:5000/api/MealType').subscribe(response => {
      this.mealTypes = response;
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
});
