import { Component, OnInit } from "@angular/core";
import { BusOrderVerification } from "src/app/_models/busOrderVerification";
import { Pagination, PaginatedResult } from "src/app/_models/pagination";
import { BusOrderVerificationService } from "src/app/_services/busOrderVerification.service";
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
  selector: "app-busOrderVerificationList",
  templateUrl: "./busOrderVerificationList.component.html",
  styleUrls: ["./busOrderVerificationList.component.css"],
})
export class BusOrderVerificationListComponent implements OnInit {
  sortAscDate: boolean;
  sortAscOrderNo: boolean;
  filter = true;

  listDepartments: any;
  mealTypes: any;
  // deklarasi untuk get data
  busOrderVerifications: BusOrderVerification[];
  pagination: Pagination;
  BusOrderVerificationsParams: any = {};
  model: any = {};

  busTime: any = [];
  busTime2: any = [];

  constructor(
    private busOrderVerificationService: BusOrderVerificationService,
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
    this.loadBusTime();
    this.route.data.subscribe((data) => {
      this.busOrderVerifications = data.busOrderVerification.result;
      this.pagination = data.busOrderVerification.pagination;
    });
    newDate.change(() => {
      this.BusOrderVerificationsParams.date = this.convertDate.convertAB(
        newDate.datepicker("getDate", true)
      );
      if ($("#box1").val() !== "") {
        this.BusOrderVerificationsParams.OrderNo = $("#box1").val();
      }
      this.loadBusOrderVerification();
    });
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName === "date") {
      this.sortAscDate = !this.sortAscDate;
      this.BusOrderVerificationsParams.OrderBy = getName;
      this.BusOrderVerificationsParams.isDesc = this.sortAscDate;
      this.loadBusOrderVerification();
    }
    if (getName === "departmentName") {
      this.sortAscOrderNo = !this.sortAscOrderNo;
      this.BusOrderVerificationsParams.OrderBy = getName;
      this.BusOrderVerificationsParams.isDesc = this.sortAscOrderNo;
      this.loadBusOrderVerification();
    }
  }

  // kita buat fungsi untuk ketika tombol page di click
  clickMe(pageMe) {
    this.pagination.currentPage = pageMe;
    this.loadBusOrderVerification();
  }

  // kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
  nextPage() {
    if (this.pagination.currentPage !== this.pagination.totalPages) {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.loadBusOrderVerification();
    }
  }

  // kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
  prevPage() {
    if (this.pagination.currentPage !== 1) {
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.loadBusOrderVerification();
    }
  }

  // kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
  endPage(Page) {
    if (this.pagination.currentPage !== Page) {
      this.pagination.currentPage = Page;
      this.loadBusOrderVerification();
    }
  }

  // kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
  startPage() {
    this.pagination.currentPage = 1;
    this.loadBusOrderVerification();
  }

  // kita buat fungsi untuk select cange size per page
  changeSize(size) {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.loadBusOrderVerification();
  }

  // kita buat fungsi untuk Order By
  OrderBy(date, OrderNo) {
    if (date !== null || OrderNo !== null) {
      this.BusOrderVerificationsParams.date = this.convertDate.convertAB(date);
      this.BusOrderVerificationsParams.OrderNo = OrderNo;
      this.loadBusOrderVerification();
    }
  }

  // lkita buat fungsi cancel Filter
  cancelFilter(status) {
    if (status === "Filter") {
      $(".filter").addClass("d-none");
      this.BusOrderVerificationsParams.date = null;
      this.BusOrderVerificationsParams.OrderNo = null;
      $("#box").val("");
      $("#box1").val("");
      this.loadBusOrderVerification();
    } else {
      $(".filter").removeClass("d-none");
    }
  }

  // for delete data
  deleteBusOrderVerification(id: number) {
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
          this.busOrderVerificationService
            .deleteBusOrderVerification(id)
            .subscribe(
              () => {
                this.sweetAlert.warningDel();
                this.loadBusOrderVerification();
              },
              (error) => {
                this.sweetAlert.warning(error);
              }
            );
        }
      });
  }

  // for laod data
  loadBusOrderVerification() {
    this.busOrderVerificationService
      .getBusOrderVerifications(
        this.pagination.currentPage,
        this.pagination.pageSize,
        this.BusOrderVerificationsParams
      )
      .subscribe(
        (res: PaginatedResult<BusOrderVerification[]>) => {
          this.busOrderVerifications = res.result;
          this.pagination = res.pagination;
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

  loadBusTime() {
    const a = [];
    const b = [];
    const c = [];
    const d = [];
    this.http.get(environment.apiUrl + "BusTime").subscribe(
      (response) => {
        a.push(response);
        a.map((data) => {
          data.map((item) => {
            if (item.directionEnum === 1) {
              b.push({
                id: item.id,
                code: item.code,
                time: item.time,
                directionEnum: item.directionEnum,
              });
            } else if (item.directionEnum === 2) {
              c.push({
                id: item.id,
                code: item.code,
                time: item.time,
                directionEnum: item.directionEnum,
              });
            } else if (item.directionEnum === 3) {
              d.push({
                id: item.id,
                code: item.code,
                time: item.time,
                directionEnum: item.directionEnum,
              });
            }
          });
        });
        // tslint:disable-next-line:no-shadowed-variable
        b.sort((a, b) => a.time.localeCompare(b.time));
        // tslint:disable-next-line:no-shadowed-variable
        c.sort((a, b) => a.time.localeCompare(b.time));
        // tslint:disable-next-line:no-shadowed-variable
        d.sort((a, b) => a.time.localeCompare(b.time));
        this.busTime.push(b);
        this.busTime.push(c);
        this.busTime.push(d);
        this.busTime.map((data) => {
          data.map((item) => {
            this.busTime2.push({
              id: item.id,
              code: item.code,
              time: item.time,
              directionEnum: item.directionEnum,
            });
          });
        });
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
