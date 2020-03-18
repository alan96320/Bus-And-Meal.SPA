import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { BusOrderEntry } from 'src/app/_models/busOrderEntry';
import { BusOrderEntryService } from 'src/app/_services/busOrderEntry.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { BusOrderVerificationService } from 'src/app/_services/busOrderVerification.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-busOrderVerificationForm',
  templateUrl: './busOrderVerificationForm.component.html',
  styleUrls: ['./busOrderVerificationForm.component.css']
})
export class BusOrderVerificationFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
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

  currenDate = new Date();
  sumVerification: any = [];
  update = false;
  id = +this.route.snapshot.params.id;

  constructor(
    private busOrderEntryService: BusOrderEntryService,
    private busOrderVerificationService: BusOrderVerificationService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadDepartment();
    this.loadDormitory();
    this.loadBusTime();
    this.BusOrderEntrysParams.isReadyToCollect = true;
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.OrderNo = data.busOrderVerification.orderNo;
        this.model.Orderdate = data.busOrderVerification.orderdate.substr(0, 10);
        this.model.IsClosed = data.busOrderVerification.isClosed;
      });
      this.update = true;
    } else {
      this.converCurrenDate();
    }
    this.loadBusOrderEntrys();
  }

  converCurrenDate() {
    const month = this.currenDate.getMonth() + 1;
    const day = this.currenDate.getDate();
    if (month < 10) {
      if (day < 10) {
        this.model.Orderdate = this.currenDate.getFullYear() + '-0' + month + '-0' + day;
      } else {
        this.model.Orderdate = this.currenDate.getFullYear() + '-0' + month + '-' + day;
      }
    } else if (day < 10) {
      if (month < 10) {
        this.model.Orderdate = this.currenDate.getFullYear() + '-0' + month + '-0' + day;
      } else {
        this.model.Orderdate = this.currenDate.getFullYear() + '-' + month + '-0' + day;
      }
    } else {
      this.model.Orderdate = this.currenDate.getFullYear() + '-' + month + '-' + day;
    }
  }

  deleteBusOrderEntrys(id: number) {
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
        this.busOrderEntryService.deleteBusOrderEntry(id).subscribe(
          () => {
            this.sweetAlert.warningDel();
            this.loadBusOrderEntrys();
          },
          error => {
            this.sweetAlert.warning(error);
          }
        );
      }
    });
  }

  OrderBy() {
    this.loadBusOrderEntrys();
  }

  loadBusOrderEntrys() {
    this.BusOrderEntrysParams.date = this.model.Orderdate;
    const c = [];
    this.busOrderEntryService.getBusOrderEntrys('', '', this.BusOrderEntrysParams).subscribe(
      (res: PaginatedResult<BusOrderEntry[]>) => {
        this.busOrderEntrys = res.result;
        let stat = false;
        if (!this.id) {
          res.result.map(data => {
            if (data.busOrderVerificationId !== null) {
              stat = true;
            }
          });
        }
        if (stat) {
          const date = JSON.parse(JSON.stringify(this.model.Orderdate));
          const da = date.substr(0, 8);
          const dat = Number(date.substr(8, 10)) + 1;
          if (dat < 10) {
            this.model.Orderdate = da + '0' + dat;
          } else {
            this.model.Orderdate = da + dat;
          }
          this.sweetAlert.message('Data on ' + date + ' has been verified, please verify on another date');
          this.loadBusOrderEntrys();
        }
        this.sumVerification.length = 0;
        this.busTime2.map((item, i) => {
          this.sumVerification.push({ BusTimeId: item.id, SumOrderQty: 0 });
        });
        this.busOrderEntrys.map(data => {
          data.busOrderDetails.map(datax => {
            this.sumVerification.map(y => {
              if (datax.busTimeId === y.BusTimeId) {
                y.SumOrderQty += datax.orderQty;
              }
            });
          });
        });
        res.result.map(data => {
          c.push(data.id);
        });
        this.model.OrderList = c;
        this.model.BusOrderVerificationDetails = this.sumVerification;
      }, error => {
        this.sweetAlert.error(error);
      }
    );
  }

  loadDepartment() {
    this.http.get('http://localhost:5000/api/department').subscribe(response => {
      this.listDepartments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  loadDormitory() {
    this.http.get('http://localhost:5000/api/DormitoryBlock').subscribe(response => {
      this.dormitory = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  loadBusTime() {
    const a = [];
    const b = [];
    const c = [];
    const d = [];
    this.http.get('http://localhost:5000/api/BusTime').subscribe(response => {
      a.push(response);
      a.map(data => {
        data.map(item => {
          if (item.directionEnum === 1) {
            b.push({ id: item.id, code: item.code, time: item.time, directionEnum: item.directionEnum });
          } else if (item.directionEnum === 2) {
            c.push({ id: item.id, code: item.code, time: item.time, directionEnum: item.directionEnum });
          } else if (item.directionEnum === 3) {
            d.push({ id: item.id, code: item.code, time: item.time, directionEnum: item.directionEnum });
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
      this.busTime.map(data => {
        data.map(item => {
          this.busTime2.push({ id: item.id, code: item.code, time: item.time, directionEnum: item.directionEnum });
        });
      });
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  submit() {
    this.BusOrderEntrysParams.isReadyToCollect = true;
    const a = 0;
    let c = false;
    const b = [];
    this.BusOrderEntrysParams.date = this.model.Orderdate;
    this.busOrderEntryService.getBusOrderEntrys('', '', this.BusOrderEntrysParams).subscribe((res: PaginatedResult<BusOrderEntry[]>) => {
      this.busTime2.map((data, i) => {
        b.push({ BusTimeId: data.id, SumOrderQty: 0 });
      });
      res.result.map(data => {
        data.busOrderDetails.map(datax => {
          b.map(x => {
            if (x.BusTimeId === datax.busTimeId) {
              x.SumOrderQty += datax.orderQty;
            }
          });
        });
      });
      b.map((data, i) => {
        if (data.SumOrderQty !== this.sumVerification[i].SumOrderQty ) {
          this.sumVerification[i].SumOrderQty = data.SumOrderQty;
          c = true;
        }
      });
      if (c) {
        this.sweetAlert.message('There was a change of data on the meal order...');
      }
      if (!this.update) {
        this.busOrderVerificationService.addBusOrderVerification(this.model).subscribe(() => {
          this.sweetAlert.successAdd('Add Successfully');
          this.router.navigate(['/busOrderVerification']);
        }, error => {
          this.sweetAlert.warning(error);
        });
      } else {
        this.busOrderVerificationService.editBusOrderVerification(this.id, this.model).subscribe(() => {
          this.sweetAlert.successAdd('Edit Successfully');
          this.router.navigate(['/busOrderVerification']);
        }, error => {
          this.sweetAlert.warning(error);
        });
      }
    });
  }

  cancel() {
    this.cancelAdd.emit(false);
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
