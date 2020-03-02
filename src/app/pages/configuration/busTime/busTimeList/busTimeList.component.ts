import { Component, OnInit } from "@angular/core";
import { BusTimeService } from "src/app/_services/busTime.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { BusTime } from "src/app/_models/busTime";
import { Pagination, PaginatedResult } from "src/app/_models/pagination";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";
import swal from "sweetalert2";

@Component({
  selector: "app-busTimeList",
  templateUrl: "./busTimeList.component.html"
})
export class BusTimeListComponent implements OnInit {
  //deklarasi untuk pagination custom
  sortAscCode: boolean;
  sortAscTime: boolean;
  sortAscDirection: boolean;
  filter: boolean = true;

  //deklarasi untuk get data
  BusTimes: BusTime[];
  pagination: Pagination;
  BusTimeParams: any = {};
  model: any = {};
  listDirection: any;

  constructor(
    private BusTimeService: BusTimeService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.BusTimes = data["BusTime"].result;
      this.pagination = data["BusTime"].pagination;
    });

    this.listDirection = [
      { id: 1, name: "Domitory -> Office" },
      { id: 2, name: "Office -> Domitory" },
      { id: 3, name: "Office -> Domitory(Night)" }
    ];
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName == "code") {
      this.sortAscCode = !this.sortAscCode;
      this.BusTimeParams.OrderBy = getName;
      this.BusTimeParams.isDesc = this.sortAscCode;
      this.loadBusTime();
    }
    if (getName == "time") {
      this.sortAscTime = !this.sortAscTime;
      this.BusTimeParams.OrderBy = getName;
      this.BusTimeParams.isDesc = this.sortAscTime;
      this.loadBusTime();
    }
    if (getName == "directionEnum") {
      this.sortAscDirection = !this.sortAscDirection;
      this.BusTimeParams.OrderBy = getName;
      this.BusTimeParams.isDesc = this.sortAscDirection;
      this.loadBusTime();
    }
  }

  clickMe(pageMe) {
    this.pagination.currentPage = pageMe;
    this.loadBusTime();
  }

  nextPage() {
    if (this.pagination.currentPage != this.pagination.totalPages) {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.loadBusTime();
    }
  }

  prevPage() {
    if (this.pagination.currentPage != 1) {
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.loadBusTime();
    }
  }

  endPage(Page) {
    if (this.pagination.currentPage != Page) {
      this.pagination.currentPage = Page;
      this.loadBusTime();
    }
  }

  startPage() {
    this.pagination.currentPage = 1;
    this.loadBusTime();
  }

  changeSize(size) {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.loadBusTime();
  }

  OrderBy(code, time, direction) {
    if (code !== null || time !== null || direction != null) {
      this.BusTimeParams.code = code;
      this.BusTimeParams.time = time;
      this.BusTimeParams.direction = direction;
      this.loadBusTime();
    }
  }

  cancelFilter(status) {
    if (status == "Filter") {
      this.BusTimeParams.code = null;
      this.BusTimeParams.time = null;
      this.BusTimeParams.direction = null;
      this.loadBusTime();
    }
  }

  deleteBusTime(id: number) {
    confirm
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.BusTimeService.deleteBusTime(id).subscribe(
            () => {
              this.sweetAlert.warningDel();
              this.loadBusTime();
            },
            error => {
              this.sweetAlert.warning(error);
            }
          );
        }
      });
  }

  loadBusTime() {
    this.BusTimeService.getBusTimes(
      this.pagination.currentPage,
      this.pagination.pageSize,
      this.BusTimeParams
    ).subscribe(
      (res: PaginatedResult<BusTime[]>) => {
        this.BusTimes = res.result;
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
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});
