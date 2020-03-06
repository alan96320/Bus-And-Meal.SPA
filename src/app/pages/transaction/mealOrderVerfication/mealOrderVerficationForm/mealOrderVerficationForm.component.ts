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
  mealVerification: any = [];

  constructor(
    private mealOrderEntryService: MealOrderEntryService,
    private mealOrderVerificationService: MealOrderVerificationService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadDepartment();
    this.loadMealType();
    this.converCurrenDate();
    this.MealOrderEntrysParams.date = this.model.OrderDate;
    this.loadMealOrderEntrys();
    if (!this.id) {
      this.model.OrderNo = '';
      this.model.OrderDate = this.model.OrderDate;
      this.model.IsClosed = false;
    }
  }

  converCurrenDate() {
    const month = this.currenDate.getMonth() + 1;
    const day = this.currenDate.getDate();
    if (month < 9) {
      if (day < 9) {
        this.model.OrderDate = this.currenDate.getFullYear() + '-0' + month + '-0' + day;
      } else {
        this.model.OrderDate = this.currenDate.getFullYear() + '-0' + month + '-' + day;
      }
    } else if (day < 9) {
      if (month < 9) {
        this.model.OrderDate = this.currenDate.getFullYear() + '-0' + month + '-0' + day;
      } else {
        this.model.OrderDate = this.currenDate.getFullYear() + '-' + month + '-0' + day;
      }
    } else {
      this.model.OrderDate = this.currenDate.getFullYear() + '-' + month + '-' + day;
    }
  }

  OrderBy(date) {
    if (date !== null) {
      this.MealOrderEntrysParams.date = date;
      this.loadMealOrderEntrys();
    }
  }

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

  loadMealOrderEntrys() {
    this.mealOrderEntryService.getMealOrderEntrys('', '', this.MealOrderEntrysParams
      ).subscribe(
        (res: PaginatedResult<MealOrderEntry[]>) => {
          this.MealOrderEntrys = res.result;
          this.pagination = res.pagination;
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
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.OrderDate = data.mealOrderVerification.orderDate.substr(0, 10);
        this.mealVerification.map((item, i) => {
          item.AdjusmentQty = data.mealOrderVerification.mealVerificationDetails[i].adjusmentQty;
          item.SwipeQty = data.mealOrderVerification.mealVerificationDetails[i].swipeQty;
          item.LogBookQty = data.mealOrderVerification.mealVerificationDetails[i].logBookQty;
          this.ajusment[i] = this.ajusment[i] - data.mealOrderVerification.mealVerificationDetails[i].adjusmentQty;
          // tslint:disable-next-line:max-line-length
          this.swipParsing[i] = data.mealOrderVerification.mealVerificationDetails[i].swipeQty + data.mealOrderVerification.mealVerificationDetails[i].logBookQty;
          this.different[i] = this.ajusment[i] - this.swipParsing[i];
        });
        this.model.OrderNo = data.mealOrderVerification.orderNo;
        this.model.IsClosed = data.mealOrderVerification.isClosed;
      });
      this.update = true;
    }
  }

  Adjusment(event: any, i) {
    this.ajusment[i] = this.sumData[i] - event.target.value;
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

  scrolRight() {
    const right = document.getElementById('scrolRight').scrollTop;
    document.getElementById('scrolLeft').scrollTop = right;
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  cekSumAgain() {
    this.MealOrderEntrysParams.date = this.model.OrderDate;
    // tslint:disable-next-line:max-line-length
    this.mealOrderEntryService.getMealOrderEntrys('', '', this.MealOrderEntrysParams).subscribe((res: PaginatedResult<MealOrderEntry[]>) => {
        let b = 0;
        const a = JSON.parse(JSON.stringify(this.mealVerification));
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
      },
      error => {
        this.sweetAlert.error(error);
      }
    );
  }

  submit() {
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
      console.log(this.model);
      if (!this.update) {
        this.mealOrderVerificationService.addMealOrderVerification(this.model).subscribe(() => {
          this.sweetAlert.successAdd('Add Successfully');
          this.router.navigate(['/mealOrderVerification']);
          this.mealVerification.splice(0, this.mealVerification.length);
        }, error => {
          this.sweetAlert.warning(error);
        });
      } else {
        this.mealOrderVerificationService.editMealOrderVerificationVerification(this.id, this.model).subscribe(() => {
          this.sweetAlert.successAdd('Edit Successfully');
          this.router.navigate(['/mealOrderVerification']);
          this.mealVerification.splice(0, this.mealVerification.length);
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
