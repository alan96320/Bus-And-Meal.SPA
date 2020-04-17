import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AlertifyService } from "src/app/_services/alertify.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";
import { HttpClient } from "@angular/common/http";
import { BusOrderEntryService } from "src/app/_services/busOrderEntry.service";
import { environment } from "src/environments/environment";
import { ConvertDateService } from "src/app/_services/convertDate.service";
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-busOrderEntryForm",
  templateUrl: "./busOrderEntryForm.component.html",
  styleUrls: ["./busOrderEntryForm.component.css"],
})
export class BusOrderEntryFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update = false;
  id = +this.route.snapshot.params.id;
  listDepartments: any;
  deptUser: any;
  mealTypes: any;
  dormitory: any;
  busTime: any = [];
  busTime2: any = [];
  currenDate = new Date();

  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
    private busOrderEntryService: BusOrderEntryService,
    private convertDate: ConvertDateService
  ) {}

  ngOnInit() {
    const newDate = $('[data-toggle="datepicker"]');
    newDate.datepicker({
      format: "dd-mm-yyyy",
      autoHide: true,
    });

    this.loadDepartment();
    this.converCurrenDate();
    this.loadDormiTory();
    this.loadBusTime();
    newDate.change(() => {
      this.model.OrderEntryDate = newDate.datepicker("getDate", true);
    });
    $('[name="DepartmentId"]').change(function () {
      $(this).blur();
    });
    $('[name="DormitoryBlockId"]').change(function () {
      $(this).blur();
    });
  }
  converCurrenDate() {
    const month = this.currenDate.getMonth() + 1;
    const day = this.currenDate.getDate();
    if (month < 10) {
      if (day < 10) {
        this.model.OrderEntryDate =
          "0" + day + "-0" + month + "-" + this.currenDate.getFullYear();
      } else {
        this.model.OrderEntryDate =
          day + "-0" + month + "-" + this.currenDate.getFullYear();
      }
    } else if (day < 10) {
      if (month < 10) {
        this.model.OrderEntryDate =
          "0" + day + "-0" + month + "-" + this.currenDate.getFullYear();
      } else {
        this.model.OrderEntryDate =
          "0" + day + "-" + month + "-" + this.currenDate.getFullYear();
      }
    } else {
      this.model.OrderEntryDate =
        day + "-" + month + "-" + this.currenDate.getFullYear();
    }
  }

  loadDepartment() {
    const id = localStorage.getItem("id_user");
    const isAdmin = localStorage.getItem("isAdmin");
    this.http.get(environment.apiUrl + "department").subscribe(
      (response) => {
        this.listDepartments = response;
      },
      (error) => {
        this.sweetAlert.error(error);
      }
    );
    if (isAdmin === "false") {
      this.http
        .get(environment.apiUrl + "userDepartment/paged?userid=" + id)
        .subscribe(
          (response) => {
            this.deptUser = response;
            this.deptUser.map((data, i) => {
              this.listDepartments.map((datax) => {
                if (data.departmentId === datax.id) {
                  data.name = datax.name;
                  data.id = datax.id;
                }
              });
            });
            this.listDepartments = this.deptUser;
          },
          (error) => {
            this.sweetAlert.error(error);
          }
        );
    }
  }

  loadDormiTory() {
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
          data.map((item, index) => {
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
        if (b.length > 0) {
          this.busTime.push(b);
        }
        if (c.length > 0) {
          this.busTime.push(c);
        }
        if (d.length > 0) {
          this.busTime.push(d);
        }

        if (this.id) {
          this.route.data.subscribe((datax) => {
            this.model.OrderEntryDate = this.convertDate.convertBA(
              datax.busOrderEntry.orderEntryDate.substr(0, 10)
            );
            this.model.isReadyToCollect = datax.busOrderEntry.isReadyToCollect;
            this.model.DepartmentId = datax.busOrderEntry.departmentId;
            this.model.DormitoryBlockId = datax.busOrderEntry.dormitoryBlockId;
            this.update = true;

            this.busTime.map((data) => {
              data.map((item, i) => {
                // tslint:disable-next-line:max-line-length
                this.busTime2.push({
                  id: item.id,
                  code: item.code,
                  time: item.time,
                  directionEnum: item.directionEnum,
                  BusOrderId: null,
                  BusTimeId: item.id,
                  OrderQty: 0,
                });
              });
            });
            this.busTime2.sort((firstEl, nextEl) =>
              firstEl.code > nextEl.code ? 1 : -1
            );
            datax.busOrderEntry.busOrderDetails.map((item) => {
              this.busTime2.map((data) => {
                if (data.BusTimeId === item.busTimeId) {
                  data.OrderQty = item.orderQty;
                }
              });
            });
          });
        } else {
          this.busTime.map((data) => {
            data.map((item) => {
              // tslint:disable-next-line:max-line-length
              this.busTime2.push({
                id: item.id,
                code: item.code,
                time: item.time,
                directionEnum: item.directionEnum,
                BusOrderId: null,
                BusTimeId: item.id,
              });
            });
          });
          this.busTime2.sort((firstEl, nextEl) =>
            firstEl.code > nextEl.code ? 1 : -1
          );
        }
      },
      (error) => {
        this.sweetAlert.error(error);
      }
    );
  }

  submit() {
    this.busTime2.map((item) => {
      delete item.id;
      delete item.code;
      delete item.time;
      delete item.directionEnum;
    });
    this.model.BusOrderVerificationId = null;
    this.model.UserId = localStorage.getItem("id_user");
    this.model.BusOrderDetails = this.busTime2;
    this.model.OrderEntryDate = this.convertDate.convertAB(
      this.model.OrderEntryDate
    );
    if (!this.update) {
      this.model.isUpdate = false;
      this.busOrderEntryService.addBusOrderEntry(this.model).subscribe(
        () => {
          this.sweetAlert.successAdd("Add Successfully");
          this.router.navigate(["/busOrderEntry"]);
        },
        (error) => {
          this.model.OrderEntryDate = this.convertDate.convertBA(
            this.model.OrderEntryDate
          );
          this.sweetAlert.warning(error);
          this.router.navigate(["/busOrderEntry"]);
        }
      );
    } else {
      this.model.isUpdate = true;
      this.busOrderEntryService
        .editBusOrderEntry(this.id, this.model)
        .subscribe(
          () => {
            this.sweetAlert.successAdd("Edit Successfully");
            this.router.navigate(["/busOrderEntry"]);
          },
          (error) => {
            this.model.OrderEntryDate = this.convertDate.convertBA(
              this.model.OrderEntryDate
            );
            this.sweetAlert.warning(error);
            this.router.navigate(["/busOrderEntry"]);
          }
        );
    }
  }

  cancel() {
    this.cancelAdd.emit(false);
  }
}
