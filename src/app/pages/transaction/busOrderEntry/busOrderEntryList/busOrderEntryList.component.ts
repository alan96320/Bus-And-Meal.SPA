import { Component, OnInit } from "@angular/core";
import { BusOrderEntryService } from "src/app/_services/busOrderEntry.service";
import { BusOrderEntry } from "src/app/_models/busOrderEntry";
import { Pagination, PaginatedResult } from "src/app/_models/pagination";
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
  selector: "app-busOrderEntryList",
  templateUrl: "./busOrderEntryList.component.html",
  styleUrls: ["./busOrderEntryList.component.css"],
})
export class BusOrderEntryListComponent implements OnInit {
  sortAscDate: boolean;
  sortAscDepartment: boolean;
  sortAscDormitory: boolean;
  filter = true;

  listDepartments: any;
  mealTypes: any;
  dormitory: any;
  busTime: any = [];
  busTime2: any = [];
  // deklarasi untuk get data
  busOrderEntrys: BusOrderEntry[];
  pagination: Pagination;
  BusOrderEntrysParams: any = {};
  model: any = {};

  constructor(
    private busOrderEntryService: BusOrderEntryService,
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
    this.loadDormitory();
    this.loadBusTime();
    this.route.data.subscribe((data) => {
      this.busOrderEntrys = data.busOrderEntry.result;
      this.pagination = data.busOrderEntry.pagination;
    });
    newDate.change(() => {
      this.BusOrderEntrysParams.date = this.convertDate.convertAB(
        newDate.datepicker("getDate", true)
      );
      this.BusOrderEntrysParams.department = $("#box1").val();
      this.BusOrderEntrysParams.dormitory = $("#box2").val();
      this.loadBusOrderEntrys();
    });
    $("#box1").change(function () {
      $(this).blur();
    });
    $("#box2").change(function () {
      $(this).blur();
    });
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName === "date") {
      this.sortAscDate = !this.sortAscDate;
      this.BusOrderEntrysParams.OrderBy = getName;
      this.BusOrderEntrysParams.isDesc = this.sortAscDate;
      this.loadBusOrderEntrys();
    }
    if (getName === "departmentName") {
      this.sortAscDepartment = !this.sortAscDepartment;
      this.BusOrderEntrysParams.OrderBy = getName;
      this.BusOrderEntrysParams.isDesc = this.sortAscDepartment;
      this.loadBusOrderEntrys();
    }
    if (getName === "dormitory") {
      this.sortAscDormitory = !this.sortAscDormitory;
      this.BusOrderEntrysParams.OrderBy = getName;
      this.BusOrderEntrysParams.isDesc = this.sortAscDormitory;
      this.loadBusOrderEntrys();
    }
  }

  // kita buat fungsi untuk ketika tombol page di click
  clickMe(pageMe) {
    this.pagination.currentPage = pageMe;
    this.loadBusOrderEntrys();
  }

  // kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
  nextPage() {
    if (this.pagination.currentPage !== this.pagination.totalPages) {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.loadBusOrderEntrys();
    }
  }

  // kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
  prevPage() {
    if (this.pagination.currentPage !== 1) {
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.loadBusOrderEntrys();
    }
  }

  // kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
  endPage(Page) {
    if (this.pagination.currentPage !== Page) {
      this.pagination.currentPage = Page;
      this.loadBusOrderEntrys();
    }
  }

  // kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
  startPage() {
    this.pagination.currentPage = 1;
    this.loadBusOrderEntrys();
  }

  // kita buat fungsi untuk select cange size per page
  changeSize(size) {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.loadBusOrderEntrys();
  }

  // kita buat fungsi untuk Order By
  OrderBy(date, department, dormitory) {
    if (date !== null || department !== null || dormitory !== null) {
      if (date !== null) {
        this.BusOrderEntrysParams.date = this.convertDate.convertAB(date);
      }
      if (department !== null) {
        this.BusOrderEntrysParams.department = department;
      }
      if (dormitory !== null) {
        this.BusOrderEntrysParams.dormitory = dormitory;
      }
      this.loadBusOrderEntrys();
    }
  }

  // lkita buat fungsi cancel Filter
  cancelFilter(status) {
    if (status === "Filter") {
      $(".filter").addClass("d-none");
      this.BusOrderEntrysParams.date = null;
      this.BusOrderEntrysParams.department = null;
      this.BusOrderEntrysParams.dormitory = null;
      $("#box").val("");
      $("#box1").val("");
      $("#box2").val("");
      this.loadBusOrderEntrys();
    } else {
      $(".filter").removeClass("d-none");
    }
  }

  // for delete data
  deleteBusOrderEntrys(id: number) {
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
          this.busOrderEntryService.deleteBusOrderEntry(id).subscribe(
            () => {
              this.sweetAlert.warningDel();
              this.loadBusOrderEntrys();
            },
            (error) => {
              this.sweetAlert.warning(error);
            }
          );
        }
      });
  }

  // for laod data
  loadBusOrderEntrys() {
    this.busOrderEntryService
      .getBusOrderEntrys(
        this.pagination.currentPage,
        this.pagination.pageSize,
        this.BusOrderEntrysParams
      )
      .subscribe(
        (res: PaginatedResult<BusOrderEntry[]>) => {
          this.busOrderEntrys = res.result;
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

  loadDormitory() {
    this.http.get(environment.apiUrl + "DormitoryBlock").subscribe(
      (response) => {
        this.dormitory = response;
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
        this.busTime2.sort((fisrtEl, nextEl) =>
          fisrtEl.code > nextEl.code ? 1 : -1
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
