import { Component, OnInit } from "@angular/core";
import { Pagination, PaginatedResult } from "src/app/_models/pagination";
import { MealOrderEntry } from "src/app/_models/mealOrderEntry";
import { MealOrderEntryService } from "src/app/_services/mealOrderEntry.service";
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
  selector: "app-mealOrderEntryList",
  templateUrl: "./mealOrderEntryList.component.html",
  styleUrls: ["./mealOrderEntryList.component.css"],
})
export class MealOrderEntryListComponent implements OnInit {
  sortAscDate: boolean;
  sortAscDepartmentName: boolean;
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
      this.MealOrderEntrys = data.mealOrderEntry.result;
      this.pagination = data.mealOrderEntry.pagination;
      this.MealOrderEntrys.map((moe) => {
        return moe.mealOrderDetails.sort((firstEl: any, nextEl: any) =>
          firstEl.mealTypeId > nextEl.mealTypeId ? 1 : -1
        );
      });
    });
    newDate.change(() => {
      this.MealOrderEntrysParams.date = this.convertDate.convertAB(
        newDate.datepicker("getDate", true)
      );
      if ($("#box1").val() !== "") {
        this.MealOrderEntrysParams.department = $("#box1").val();
      }
      this.loadMealOrderEntrys();
    });
    $("#box1").change(function () {
      $(this).blur();
    });
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName === "date") {
      this.sortAscDate = !this.sortAscDate;
      this.MealOrderEntrysParams.OrderBy = getName;
      this.MealOrderEntrysParams.isDesc = this.sortAscDate;
      this.loadMealOrderEntrys();
    }
    if (getName === "departmentName") {
      this.sortAscDepartmentName = !this.sortAscDepartmentName;
      this.MealOrderEntrysParams.OrderBy = getName;
      this.MealOrderEntrysParams.isDesc = this.sortAscDepartmentName;
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
  OrderBy(date, department) {
    if (date !== null || department !== null) {
      this.MealOrderEntrysParams.date = this.convertDate.convertAB(date);
      this.MealOrderEntrysParams.department = department;
      this.loadMealOrderEntrys();
    }
  }

  // lkita buat fungsi cancel Filter
  cancelFilter(status) {
    if (status === "Filter") {
      $(".filter").addClass("d-none");
      this.MealOrderEntrysParams.date = null;
      this.MealOrderEntrysParams.department = null;
      $("#box").val("");
      $("#box1").val("");
      this.loadMealOrderEntrys();
    } else {
      $(".filter").removeClass("d-none");
    }
  }

  // for delete data
  deleteMealOrderEntrys(id: number) {
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
          this.mealOrderEntryService.deleteMealOrderEntry(id).subscribe(
            () => {
              this.sweetAlert.warningDel();
              this.loadMealOrderEntrys();
            },
            (error) => {
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
          this.MealOrderEntrys.map((moe) => {
            return moe.mealOrderDetails.sort((firstEl: any, nextEl: any) =>
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
