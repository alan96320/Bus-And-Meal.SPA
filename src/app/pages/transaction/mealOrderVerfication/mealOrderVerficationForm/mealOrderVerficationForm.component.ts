import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MealOrderEntry } from 'src/app/_models/mealOrderEntry';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { MealOrderEntryService } from 'src/app/_services/mealOrderEntry.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { MealOrderVerificationServiceService } from 'src/app/_services/mealOrderVerificationService.service';

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

  listDepartments: any;
  mealTypes: any;
  dateVal = new Date();

  // deklarasi untuk get data
  MealOrderEntrys: MealOrderEntry[];
  pagination: Pagination;
  MealOrderEntrysParams: any = {};
  model: any = {};

  sumData: any;
  ajusment: any;
  swipData: any;
  logBoks: any;
  swipParsing: any;
  different: any;
  mealVerification: any = [];

  constructor(
    private mealOrderEntryService: MealOrderEntryService,
    private mealOrderVerificationService: MealOrderVerificationServiceService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadDepartment();
    this.loadMealType();
    const currentDate = '2020-03-05';
    this.MealOrderEntrysParams.date = currentDate;
    this.loadMealOrderEntrys();
    this.model.OrderNo = '';
    this.model.OrderDate = currentDate;
    this.model.IsClosed = false;
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

  // for laod data
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
    this.sumData = JSON.parse(JSON.stringify(a));
    this.ajusment = JSON.parse(JSON.stringify(a));
    this.swipData = JSON.parse(JSON.stringify(c));
    this.logBoks = JSON.parse(JSON.stringify(c));
    this.swipParsing = JSON.parse(JSON.stringify(c));
    this.different = JSON.parse(JSON.stringify(a));

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

  submit() {
    this.model.MealOrders = this.MealOrderEntrys;
    this.model.MealOrderVerificationDetails = this.mealVerification;
    console.log(this.model);

    this.mealOrderVerificationService.addMealOrderVerification(this.model).subscribe(() => {
      this.sweetAlert.successAdd('Add Successfully');
      this.router.navigate(['/mealOrderVerification']);
    }, error => {
      this.sweetAlert.warning(error);
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
