import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AlertifyService } from "src/app/_services/alertify.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";
import { HttpClient } from "@angular/common/http";
import { MealOrderEntryService } from "src/app/_services/mealOrderEntry.service";
import { environment } from "src/environments/environment";
import { ConvertDateService } from "src/app/_services/convertDate.service";

declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-mealOrderEntryForm",
  templateUrl: "./mealOrderEntryForm.component.html",
  styleUrls: ["./mealOrderEntryForm.component.css"],
})
export class MealOrderEntryFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update = false;
  id = +this.route.snapshot.params.id;
  listDepartments: any;
  validDepartment: any;
  userDepartment: any;
  deptUser: any;
  mealTypes: any;
  currenDate = new Date();

  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
    private mealOrderEntryService: MealOrderEntryService,
    private convertDate: ConvertDateService
  ) {}

  ngOnInit() {
    const newDate = $('[data-toggle="datepicker"]');
    newDate.datepicker({
      format: "dd-mm-yyyy",
      autoHide: true,
    });

    this.loadDepartment();
    this.loadMealType();
    this.converCurrenDate();
    this.loadMealOrderEntry();
    newDate.change(() => {
      this.model.OrderEntryDate = newDate.datepicker("getDate", true);
    });
    $('[name="DepartmentId"]').change(function () {
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
        this.validDepartment = response;
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
            this.userDepartment = response;
            this.validDepartment = [];
            this.userDepartment.map((data, i) => {
              this.listDepartments.map((datax) => {
                if (data.departmentId === datax.id) {
                  this.validDepartment.push(datax);
                }
              });
            });
          },
          (error) => {
            this.sweetAlert.error(error);
          }
        );
    }
  }

  loadMealType() {
    this.http.get(environment.apiUrl + "MealType").subscribe(
      (response) => {
        this.mealTypes = response;
        this.mealTypes.map((items, i) => {
          items.MealTypeId = items.id;
          items.MealOrderId = null;
          if (this.id) {
            this.route.data.subscribe((data) => {
              items.OrderQty = data.mealOrderEntry.mealOrderDetails[i].orderQty;
              items.MealOrderId = data.mealOrderEntry.id;
            });
          }
          delete items.id;
          delete items.mealVendor;
          delete items.mealOrderDetails;
          delete items.mealVendors;
          delete items.code;
          delete items.mealOrderVerificationDetails;
        });
      },
      (error) => {
        this.sweetAlert.error(error);
      }
    );
  }

  loadMealOrderEntry() {
    if (this.id) {
      this.route.data.subscribe((data) => {
        this.model.OrderEntryDate = this.convertDate.convertBA(
          data.mealOrderEntry.orderEntryDate.substr(0, 10)
        );
        this.model.isReadyToCollect = data.mealOrderEntry.isReadyToCollect;
        this.model.DepartmentId = data.mealOrderEntry.departmentId;
        this.update = true;
      });
    }
  }

  submit() {
    this.model.MealOrderVerificationId = null;
    this.model.UserId = localStorage.getItem("id_user");
    this.model.MealOrderDetails = this.mealTypes;
    this.model.OrderEntryDate = this.convertDate.convertAB(
      this.model.OrderEntryDate
    );
    if (!this.update) {
      this.model.isUpdate = false;
      this.mealOrderEntryService.addMealOrderEntry(this.model).subscribe(
        () => {
          this.sweetAlert.successAdd("Add Successfully");
          this.router.navigate(["/mealOrderEntry"]);
        },
        (error) => {
          this.model.OrderEntryDate = this.convertDate.convertBA(
            this.model.OrderEntryDate
          );
          this.sweetAlert.warning(error);
          this.router.navigate(["/mealOrderEntry"]);
        }
      );
    } else {
      this.model.isUpdate = true;
      this.mealOrderEntryService
        .editMealOrderEntry(this.id, this.model)
        .subscribe(
          () => {
            this.sweetAlert.successAdd("Edit Successfully");
            this.router.navigate(["/mealOrderEntry"]);
          },
          (error) => {
            this.model.OrderEntryDate = this.convertDate.convertBA(
              this.model.OrderEntryDate
            );
            this.sweetAlert.warning(error);
            this.router.navigate(["/mealOrderEntry"]);
          }
        );
    }
  }

  cancel() {
    this.cancelAdd.emit(false);
  }
}
