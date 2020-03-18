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
  }

  loadMealTypes() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.code = data.MealType.code;
        this.model.name = data.MealType.name;
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
}
