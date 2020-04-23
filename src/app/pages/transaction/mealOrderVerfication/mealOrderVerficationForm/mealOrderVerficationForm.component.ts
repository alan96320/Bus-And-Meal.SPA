import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MealOrderEntry } from 'src/app/_models/mealOrderEntry';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { MealOrderEntryService } from 'src/app/_services/mealOrderEntry.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { MealOrderVerificationService } from 'src/app/_services/mealOrderVerification.service';
import { environment } from 'src/environments/environment';
import { ConvertDateService } from 'src/app/_services/convertDate.service';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mealOrderVerficationForm',
  templateUrl: './mealOrderVerficationForm.component.html',
  styleUrls: ['./mealOrderVerficationForm.component.css']
})
export class MealOrderVerficationFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  sortAscDate: boolean;
  sortAscDepartmentName: boolean;
  filter = true;
  update = false;
  listDepartments: any;
  mealTypes: any;
  currenDate = new Date();
  listVendor: any;

  // deklarasi untuk get data
  MealOrderEntrys: MealOrderEntry[];
  pagination: Pagination;
  MealOrderEntrysParams: any = {};
  model: any = {};
  id = +this.route.snapshot.params.id;
  sumData: any;
  ajusment: any;
  swipData: any;
  logBoks: any;
  swipParsing: any;
  different: any;
  selectedVendor: any;
  mealVerification: any = [];

  constructor(
    private mealOrderEntryService: MealOrderEntryService,
    private mealOrderVerificationService: MealOrderVerificationService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
    private convertDate: ConvertDateService
  ) { }

  ngOnInit() {
    const newDate = $('[data-toggle="datepicker"]');
    newDate.datepicker({
      format: 'dd-mm-yyyy',
      autoHide: true
    });
    this.loadDepartment();
    this.loadMealType();
    this.converCurrenDate();
    this.loadVendor();
    if (this.id) {
      this.route.data.subscribe(data => {
        this.MealOrderEntrysParams.date = data.mealOrderVerification.orderDate.substr(0, 10);
      });
    } else {
      this.MealOrderEntrysParams.date = this.convertDate.convertAB(this.model.OrderDate);
    }
    this.MealOrderEntrysParams.isReadyToCollect = true;
    this.loadMealOrderEntrys();
    if (!this.id) {
      this.model.OrderNo = '';
      this.model.OrderDate = this.model.OrderDate;
      this.model.IsClosed = false;
    }
    newDate.change(() => {
      if (!this.id) {
        this.model.OrderDate = newDate.datepicker('getDate', true);
      }
      this.MealOrderEntrysParams.date = this.convertDate.convertAB(newDate.datepicker('getDate', true));
      this.MealOrderEntrysParams.isReadyToCollect = true;
      this.loadMealOrderEntrys();
    });
  }

  converCurrenDate() {
    const month = this.currenDate.getMonth() + 1;
    const day = this.currenDate.getDate();
    if (month < 10) {
      if (day < 10) {
        this.model.OrderDate = day + '-0' + month + '-0' + this.currenDate.getFullYear();
      } else {
        this.model.OrderDate = day + '-0' + month + '-' + this.currenDate.getFullYear();
      }
    } else if (day < 10) {
      if (month < 10) {
        this.model.OrderDate = day + '-0' + month + '-0' + this.currenDate.getFullYear();
      } else {
        this.model.OrderDate = day + '-' + month + '-0' + this.currenDate.getFullYear();
      }
    } else {
      this.model.OrderDate = day + '-' + month + '-' + this.currenDate.getFullYear();
    }
  }

  deleteMealOrderEntrys(id: number) {
    // tslint:disable-next-line: no-use-before-declare
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

  loadMealOrderEntrys() {
    this.mealOrderEntryService.getMealOrderEntrys('', '', this.MealOrderEntrysParams
      ).subscribe(
        (res: PaginatedResult<MealOrderEntry[]>) => {
          let a = false;
          const b = JSON.parse(JSON.stringify(this.convertDate.convertAB(this.model.OrderDate)));
          let c = '';
          if ((Number(b.slice(8)) + 1) < 10) {
            c = b.slice(0, 8) + '0' + (Number(b.slice(8)) + 1);
          } else {
            c = b.slice(0, 8) + (Number(b.slice(8)) + 1);
          }
          res.result.map(item => {
            // if (item.mealOrderVerificationId !== null || item.mealOrderVerificationId === 0 && !this.id) {
            if (!(item.mealOrderVerificationId === null || item.mealOrderVerificationId === 0) && !this.id) {
              a = true;
            }
          });
          if (a === false) {
            this.MealOrderEntrys = res.result;
            this.pagination = res.pagination;
          } else {
            this.sweetAlert.message('Data on ' + b + ' has been verified, please verify on another date');
            setTimeout(() => {
              this.model.OrderDate = this.convertDate.convertBA(c);
              this.MealOrderEntrysParams.date = c;
              this.loadMealOrderEntrys();
            }, 1000);
          }
          this.calculation();
        },
        error => {
          this.sweetAlert.error(error);
        }
    );
  }

  calculation() {
    const a = [];
    const c = [];
    const d = [];
    let b = 0;
    this.mealVerification.splice(0, this.mealVerification.length);
    this.mealTypes.map((item, i) => {
      this.MealOrderEntrys.map(item2 => {
        b += item2.mealOrderDetails[i].orderQty;
      });
      a.push(b);
      this.mealVerification.push(
        { MealTypeId: item.id, SumOrderQty: b, AdjusmentQty: 0, SwipeQty: 0, LogBookQty: 0}
      );
      b = 0;
      c.push(b);
    });
    this.MealOrderEntrys.map(item => {
      d.push(item.id);
    });
    this.sumData = JSON.parse(JSON.stringify(a));
    this.ajusment = JSON.parse(JSON.stringify(a));
    this.swipData = JSON.parse(JSON.stringify(c));
    this.logBoks = JSON.parse(JSON.stringify(c));
    this.swipParsing = JSON.parse(JSON.stringify(c));
    this.different = JSON.parse(JSON.stringify(a));
    this.model.OrderList = d;
    this.selectedVendor = this.sumData;
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.OrderDate = this.convertDate.convertBA(data.mealOrderVerification.orderDate.substr(0, 10));
        this.mealVerification.map((item, i) => {
          item.AdjusmentQty = data.mealOrderVerification.mealVerificationDetails[i].adjusmentQty;
          item.SwipeQty = data.mealOrderVerification.mealVerificationDetails[i].swipeQty;
          item.LogBookQty = data.mealOrderVerification.mealVerificationDetails[i].logBookQty;
          this.ajusment[i] = this.ajusment[i] + data.mealOrderVerification.mealVerificationDetails[i].adjusmentQty;
          // tslint:disable-next-line:max-line-length
          this.swipParsing[i] = data.mealOrderVerification.mealVerificationDetails[i].swipeQty + data.mealOrderVerification.mealVerificationDetails[i].logBookQty;
          this.different[i] = this.ajusment[i] - this.swipParsing[i];
        });
        this.selectedVendor = data.mealOrderVerification.mealVerificationDetails;
        this.model.OrderNo = data.mealOrderVerification.orderNo;
        this.model.IsClosed = data.mealOrderVerification.isClosed;
      });
      this.update = true;
    }
  }

  Adjusment(event: any, i) {
    this.ajusment[i] = Number(this.sumData[i]) + Number(event.target.value) ;
    this.different[i] = Number(this.ajusment[i]) - Number(this.swipParsing[i]);
    this.mealVerification[i].AdjusmentQty = event.target.value;
  }

  swipDatas(event: any, i) {
    this.swipData[i] = Number(event.target.value);
    this.swipParsing[i] = Number(this.swipData[i]) + Number(this.logBoks[i]);
    this.different[i] = Number(this.ajusment[i]) - Number(this.swipParsing[i]);
    this.mealVerification[i].SwipeQty = event.target.value;
  }

  logBok(event: any, i) {
    this.logBoks[i] = Number(event.target.value);
    this.swipParsing[i] = Number(this.swipData[i]) + Number(this.logBoks[i]);
    this.different[i] = Number(this.ajusment[i]) - Number(this.swipParsing[i]);
    this.mealVerification[i].LogBookQty = event.target.value;
  }
  vendor(event: any, i) {
    this.mealVerification[i].VendorId = event.target.value;
  }

  loadDepartment() {
    this.http.get(environment.apiUrl + 'department').subscribe(response => {
      this.listDepartments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }
  loadVendor() {
    this.http.get(environment.apiUrl + 'MealVendor').subscribe(response => {
      this.listVendor = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  loadMealType() {
    this.http.get(environment.apiUrl + 'MealType').subscribe(response => {
      this.mealTypes = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  scrolRight() {
    const right = document.getElementById('scrolRight').scrollTop;
    document.getElementById('scrolLeft').scrollTop = right;
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  submit() {
    this.MealOrderEntrysParams.isReadyToCollect = true;
    // tslint:disable-next-line:max-line-length
    this.mealOrderEntryService.getMealOrderEntrys('', '', this.MealOrderEntrysParams).subscribe((res: PaginatedResult<MealOrderEntry[]>) => {
      let b = 0;
      let c = false;
      const d = [];
      this.mealTypes.map((item, i) => {
        res.result.map((item2) => {
          b += item2.mealOrderDetails[i].orderQty;
        });
        if (this.mealVerification[i].SumOrderQty !== b) {
          this.mealVerification[i].SumOrderQty = b;
          c = true;
        }
        b = 0;
      });
      res.result.map(item => {
        d.push(item.id);
      });
      if (c) {
        this.sweetAlert.message('There was a change of data on the meal order...');
        this.model.OrderList = d;
      }
      this.model.MealOrderVerificationDetails = this.mealVerification;
      this.model.OrderDate = this.convertDate.convertAB(this.model.OrderDate);
      if (!this.update) {
        this.model.isUpdate = false;
        this.mealOrderVerificationService.addMealOrderVerification(this.model).subscribe(() => {
          setTimeout(() => {
            this.sweetAlert.successAdd('Add Successfully');
            this.router.navigate(['/mealOrderVerification']);
          }, 1000);
        }, error => {
          this.sweetAlert.warning(error);
        });
      } else {
        this.model.isUpdate = true;
        this.mealOrderVerificationService.editMealOrderVerificationVerification(this.id, this.model).subscribe(() => {
          setTimeout(() => {
            this.sweetAlert.successAdd('Edit Successfully');
            this.router.navigate(['/mealOrderVerification']);
          }, 1000);
        }, error => {
          this.sweetAlert.warning(error);
        });
      }
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
