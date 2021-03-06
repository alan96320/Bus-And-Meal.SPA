import { Component, OnInit } from "@angular/core";
import { MealOrderVerification } from "src/app/_models/mealOrderVerification";
import { Pagination, PaginatedResult } from "src/app/_models/pagination";
import { MealOrderVerificationService } from "src/app/_services/mealOrderVerification.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";
import { HttpClient } from "@angular/common/http";
import swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { ConvertDateService } from "src/app/_services/convertDate.service";
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-mealOrderVerficationList",
  templateUrl: "./mealOrderVerficationList.component.html",
  styleUrls: ["./mealOrderVerficationList.component.css"],
})
export class MealOrderVerficationListComponent implements OnInit {
  sortAscDate: boolean;
  sortAscOrderNo: boolean;
  filter = true;

  listDepartments: any;
  mealTypes: any;
  // deklarasi untuk get data
  MealOrderVerifications: MealOrderVerification[];
  pagination: Pagination;
  MealOrderVerificationsParams: any = {};
  model: any = {};

  constructor(
    private mealOrderVerificationService: MealOrderVerificationService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
    private convertDate: ConvertDateService
  ) {}

  ngOnInit() {
    const newDate = $("#box");
    newDate.datepicker({
      format: "dd-mm-yyyy",
      autoHide: true,
    });
    this.loadDepartment();
    this.loadMealType();
    this.route.data.subscribe((data) => {
      this.MealOrderVerifications = data.mealOrderVerification.result;
      this.pagination = data.mealOrderVerification.pagination;
      this.MealOrderVerifications.map((mov) => {
        return mov.mealVerificationDetails.sort((firstEl: any, nextEl: any) =>
          firstEl.mealTypeId > nextEl.mealTypeId ? 1 : -1
        );
      });
    });
    newDate.change(() => {
      this.MealOrderVerificationsParams.date = this.convertDate.convertAB(
        newDate.datepicker("getDate", true)
      );
      if ($("#box1").val() !== "") {
        this.MealOrderVerificationsParams.OrderNo = $("#box1").val();
      }
      this.loadMealOrderVerification();
    });
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName === "date") {
      this.sortAscDate = !this.sortAscDate;
      this.MealOrderVerificationsParams.OrderBy = getName;
      this.MealOrderVerificationsParams.isDesc = this.sortAscDate;
      this.loadMealOrderVerification();
    }
    if (getName === "departmentName") {
      this.sortAscOrderNo = !this.sortAscOrderNo;
      this.MealOrderVerificationsParams.OrderBy = getName;
      this.MealOrderVerificationsParams.isDesc = this.sortAscOrderNo;
      this.loadMealOrderVerification();
    }
  }

  // kita buat fungsi untuk ketika tombol page di click
  clickMe(pageMe) {
    this.pagination.currentPage = pageMe;
    this.loadMealOrderVerification();
  }

  // kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
  nextPage() {
    if (this.pagination.currentPage !== this.pagination.totalPages) {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.loadMealOrderVerification();
    }
  }

  // kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
  prevPage() {
    if (this.pagination.currentPage !== 1) {
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.loadMealOrderVerification();
    }
  }

  // kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
  endPage(Page) {
    if (this.pagination.currentPage !== Page) {
      this.pagination.currentPage = Page;
      this.loadMealOrderVerification();
    }
  }

  // kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
  startPage() {
    this.pagination.currentPage = 1;
    this.loadMealOrderVerification();
  }

  // kita buat fungsi untuk select cange size per page
  changeSize(size) {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.loadMealOrderVerification();
  }

  // kita buat fungsi untuk Order By
  OrderBy(date, OrderNo) {
    if (date !== null || OrderNo !== null) {
      this.MealOrderVerificationsParams.date = this.convertDate.convertAB(date);
      this.MealOrderVerificationsParams.OrderNo = OrderNo;
      this.loadMealOrderVerification();
    }
  }

  // lkita buat fungsi cancel Filter
  cancelFilter(status) {
    if (status === "Filter") {
      $(".filter").addClass("d-none");
      this.MealOrderVerificationsParams.date = null;
      this.MealOrderVerificationsParams.OrderNo = null;
      this.loadMealOrderVerification();
      $("#box").val("");
      $("#box1").val("");
    } else {
      $(".filter").removeClass("d-none");
    }
  }

  // for delete data
  deleteMealOrderVerification(id: number) {
    // tslint:disable-next-line: no-use-before-declare
    confirm
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.mealOrderVerificationService
            .deleteMealOrderVerification(id)
            .subscribe(
              () => {
                this.sweetAlert.warningDel();
                this.loadMealOrderVerification();
              },
              (error) => {
                this.sweetAlert.warning(error);
              }
            );
        }
      });
  }

  // for laod data
  loadMealOrderVerification() {
    this.mealOrderVerificationService
      .getMealOrderVerifications(
        this.pagination.currentPage,
        this.pagination.pageSize,
        this.MealOrderVerificationsParams
      )
      .subscribe(
        (res: PaginatedResult<MealOrderVerification[]>) => {
          this.MealOrderVerifications = res.result;
          this.pagination = res.pagination;
          this.MealOrderVerifications.map((mov) => {
            return mov.mealVerificationDetails.sort(
              (firstEl: any, nextEl: any) =>
                firstEl.mealTypeId > nextEl.mealTypeId ? 1 : -1
            );
          });
        },
        (error) => {
          this.sweetAlert.error(error);
        }
      );
  }

  loadDepartment() {
    this.http.get(environment.apiUrl + "department").subscribe(
      (response) => {
        this.listDepartments = response;
      },
      (error) => {
        this.sweetAlert.error(error);
      }
    );
  }

  loadMealType() {
    this.http.get(environment.apiUrl + "MealType").subscribe(
      (response) => {
        this.mealTypes = response;
        this.mealTypes.sort((firstEl: any, nextEl: any) =>
          firstEl.code > nextEl.code ? 1 : -1
        );
      },
      (error) => {
        this.sweetAlert.error(error);
      }
    );
  }
}

// for custom class sweet alert
const confirm = swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});
