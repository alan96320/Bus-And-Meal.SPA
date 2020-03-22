import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import { BusOrderEntryService } from 'src/app/_services/busOrderEntry.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-busOrderEntryForm',
  templateUrl: './busOrderEntryForm.component.html',
  styleUrls: ['./busOrderEntryForm.component.css']
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
    private busOrderEntryService: BusOrderEntryService
  ) { }

  ngOnInit() {
    const newDate = $('[data-toggle="datepicker"]');
    newDate.datepicker({
      format: 'yyyy-mm-dd',
      autoHide: true
    });

    this.loadDepartment();
    this.converCurrenDate();
    this.loadDormiTory();
    this.loadBusTime();
    newDate.change(() => {
      this.model.OrderEntryDate = newDate.datepicker('getDate', true);
    });
  }
  converCurrenDate() {
    const month = this.currenDate.getMonth() + 1;
    const day = this.currenDate.getDate();
    if (month < 10) {
      if (day < 10) {
        this.model.OrderEntryDate = this.currenDate.getFullYear() + '-0' + month + '-0' + day;
      } else {
        this.model.OrderEntryDate = this.currenDate.getFullYear() + '-0' + month + '-' + day;
      }
    } else if (day < 10) {
      if (month < 10) {
        this.model.OrderEntryDate = this.currenDate.getFullYear() + '-0' + month + '-0' + day;
      } else {
        this.model.OrderEntryDate = this.currenDate.getFullYear() + '-' + month + '-0' + day;
      }
    } else {
      this.model.OrderEntryDate = this.currenDate.getFullYear() + '-' + month + '-' + day;
    }
  }

  loadDepartment() {
    const id = localStorage.getItem('id_user');
    const isAdmin = localStorage.getItem('isAdmin');
    this.http.get(environment.apiUrl + 'department').subscribe(response => {
      this.listDepartments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
    if (isAdmin === 'false') {
      this.http.get(environment.apiUrl + 'user/' + id).subscribe(response => {
        this.deptUser = response;
        this.deptUser.userDepartments.map((data, i) => {
          this.listDepartments.map(datax => {
            if (data.departmentId === datax.id) {
              data.name = datax.name;
              data.id = datax.id;
            }
          });
        });
        this.listDepartments = this.deptUser.userDepartments;
        this.listDepartments.unshift({ id: '', name: '' });
      }, error => {
        this.sweetAlert.error(error);
      });
    }
  }

  loadDormiTory() {
    this.http.get(environment.apiUrl + 'DormitoryBlock').subscribe(response => {
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
    this.http.get(environment.apiUrl + 'BusTime').subscribe(response => {
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
      if (this.id) {
        this.route.data.subscribe(datax => {
          this.model.OrderEntryDate = datax.busOrderEntry.orderEntryDate.substr(0, 10);
          this.model.isReadyToCollect = datax.busOrderEntry.isReadyToCollect;
          this.model.DepartmentId = datax.busOrderEntry.departmentId;
          this.model.DormitoryBlockId = datax.busOrderEntry.dormitoryBlockId;
          this.update = true;

          this.busTime.map(data => {
            data.map((item, i) => {
              // tslint:disable-next-line:max-line-length
              this.busTime2.push({ id: item.id, code: item.code, time: item.time, directionEnum: item.directionEnum, BusOrderId: null, BusTimeId: item.id, OrderQty: 0 });
            });
          });
          datax.busOrderEntry.busOrderDetails.map(item => {
            this.busTime2.map(data => {
              if (data.BusTimeId === item.busTimeId) {
                data.OrderQty = item.orderQty;
              }
            });
          });
        });
      } else {
        this.busTime.map(data => {
          data.map(item => {
            // tslint:disable-next-line:max-line-length
            this.busTime2.push({ id: item.id, code: item.code, time: item.time, directionEnum: item.directionEnum, BusOrderId: null, BusTimeId: item.id, });
          });
        });
      }
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  submit() {
    this.busTime2.map(item => {
      delete item.id;
      delete item.code;
      delete item.time;
      delete item.directionEnum;
    });
    this.model.BusOrderVerificationId = null;
    this.model.UserId = localStorage.getItem('id_user');
    this.model.BusOrderDetails = this.busTime2;
    if (!this.update) {
      this.model.isUpdate = false;
      this.busOrderEntryService.addBusOrderEntry(this.model).subscribe(() => {
        this.sweetAlert.successAdd('Add Successfully');
        this.router.navigate(['/busOrderEntry']);
      }, error => {
        this.sweetAlert.warning(error);
      });
    } else {
      this.model.isUpdate = true;
      this.busOrderEntryService.editBusOrderEntry(this.id, this.model).subscribe(() => {
        this.sweetAlert.successAdd('Edit Successfully');
        this.router.navigate(['/busOrderEntry']);
      }, error => {
        this.sweetAlert.warning(error);
      });
    }
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

}
