import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import { MealOrderEntryService } from 'src/app/_services/mealOrderEntry.service';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mealOrderEntryForm',
  templateUrl: './mealOrderEntryForm.component.html',
  styleUrls: ['./mealOrderEntryForm.component.css']
})
export class MealOrderEntryFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update = false;
  id = +this.route.snapshot.params.id;
  listDepartments: any;
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
  ) { }

  ngOnInit() {
    const newDate = $('[data-toggle="datepicker"]');
    newDate.datepicker({
      format: 'yyyy-mm-dd',
      autoHide: true
    });
    this.loadDepartment();
    this.loadMealType();
    this.converCurrenDate();
    this.loadMealOrderEntry();
    newDate.change(() => {
      this.model.OrderEntryDate = newDate.datepicker('getDate', true);
    });
  }
  converCurrenDate() {
    const month = this.currenDate.getMonth() + 1;
    const day = this.currenDate.getDate();
    if (month < 9) {
      if (day < 9) {
        this.model.OrderEntryDate = this.currenDate.getFullYear() + '-0' + month + '-0' + day;
      } else {
        this.model.OrderEntryDate = this.currenDate.getFullYear() + '-0' + month + '-' + day;
      }
    } else if (day < 9) {
      if (month < 9) {
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

  loadMealType() {
    this.http.get(environment.apiUrl + 'MealType').subscribe(response => {
      this.mealTypes = response;
      this.mealTypes.map((items, i) => {
        items.MealTypeId = items.id;
        items.MealOrderId = null;
        if (this.id) {
          this.route.data.subscribe(data => {
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
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  loadMealOrderEntry() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.OrderEntryDate = data.mealOrderEntry.orderEntryDate.substr(0, 10);
        this.model.isReadyToCollect = data.mealOrderEntry.isReadyToCollect;
        this.model.DepartmentId = data.mealOrderEntry.departmentId;
        this.update = true;
      });
    }
  }

  submit() {
    this.model.MealOrderVerificationId = null;
    this.model.UserId = localStorage.getItem('id_user');
    this.model.MealOrderDetails = this.mealTypes;
    if (!this.update) {
      this.model.isUpdate = false;
      this.mealOrderEntryService.addMealOrderEntry(this.model).subscribe(() => {
        this.sweetAlert.successAdd('Add Successfully');
        this.router.navigate(['/mealOrderEntry']);
      }, error => {
        this.sweetAlert.warning(error);
      });
    } else {
      this.model.isUpdate = true;
      this.mealOrderEntryService.editMealOrderEntry(this.id, this.model).subscribe(() => {
        this.sweetAlert.successAdd('Edit Successfully');
        this.router.navigate(['/mealOrderEntry']);
      }, error => {
        this.sweetAlert.warning(error);
      });
    }


    // console.log(this.model);

  }

  cancel() {
    this.cancelAdd.emit(false);
  }

}
