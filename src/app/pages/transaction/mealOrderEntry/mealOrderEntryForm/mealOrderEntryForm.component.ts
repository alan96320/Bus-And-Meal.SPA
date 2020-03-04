import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import { MealOrderEntryService } from 'src/app/_services/mealOrderEntry.service';

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
  mealTypes: any;

  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
    private mealOrderEntryService: MealOrderEntryService
  ) { }

  ngOnInit() {
    this.loadDepartment();
    this.loadMealType();


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
      this.mealTypes.map(items => {
        items.MealTypeId = items.id;
        items.MealOrderId = null;
        delete items.id;
        delete items.mealVendor;
        delete items.mealOrderDetails;
        delete items.mealVendors;
        delete items.code;
        delete items.mealOrderVerificationDetails;
      });
      console.log(this.mealTypes);


    }, error => {
      this.sweetAlert.error(error);
    });
  }

  submit() {
    this.model.MealOrderVerificationId = null;
    this.model.UserId = localStorage.getItem('id_user');
    this.model.MealOrderDetails = this.mealTypes;
    console.log(this.model);

    this.mealOrderEntryService.addMealOrderEntry(this.model).subscribe(() => {
      this.sweetAlert.successAdd('Add Successfully');
      this.router.navigate(['/mealOrderEntry']);
    }, error => {
      this.sweetAlert.warning(error);
    });

  }


  cancel() {
    this.cancelAdd.emit(false);
  }

}
