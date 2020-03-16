import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { MealTypeService } from 'src/app/_services/mealType.service';
import { MealType } from 'src/app/_models/mealType';
import { HttpClient } from '@angular/common/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mealTypeForm',
  templateUrl: './mealTypeForm.component.html'
})
export class MealTypeFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update = false;
  mealTypes: MealType;
  id = +this.route.snapshot.params.id;
  MealVendors: any;
  constructor(
    private mealTypeService: MealTypeService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadMealTypes();
    this.loadMealVendors();
  }

  loadMealTypes() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.code = data.MealType.code;
        this.model.name = data.MealType.name;
        this.model.mealVendorId = data.MealType.mealVendor.id;
        this.update = true;
      });
    }
  }

  submit() {
    if (!this.update) {
      this.addMealType();
    } else {
      this.updateMealType();
    }
  }

  addMealType() {
    this.model.isUpdate = false;
    this.mealTypeService.addMealType(this.model).subscribe(
      () => {
        this.sweetAlert.successAdd('Added Successfully');
        this.router.navigate(['/mealType']);
      },
      error => {
        this.sweetAlert.warning(error);
      }
    );
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  updateMealType() {
    this.model.isUpdate = true;
    this.mealTypeService.editMealType(this.id, this.model).subscribe(
      () => {
        this.sweetAlert.successAdd('Edit Successfully');
        this.router.navigate(['/mealType']);
      },
      error => {
        this.sweetAlert.warning(error);
      }
    );
  }

  loadMealVendors() {
    this.http.get('http://localhost:5000/api/MealVendor').subscribe(
      response => {
        this.MealVendors = response;
        this.MealVendors.map(data => {
          if (data.name === 'Default') {
            this.model.mealVendorId = data.id;
          }
        });
      },
      error => {
        this.sweetAlert.error(error);
      }
    );
  }
}
