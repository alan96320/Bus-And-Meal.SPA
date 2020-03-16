import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Counter } from 'src/app/_models/counter';
import { CounterService } from 'src/app/_services/counter.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-CounterForm',
  templateUrl: './CounterForm.component.html'
})
export class CounterFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update = false;
  counter: Counter;
  id = +this.route.snapshot.params.id;

  constructor(
    private counterService: CounterService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadCounter();
  }

  loadCounter() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.Code = data.counter.code;
        this.model.Name = data.counter.name;
        this.model.Location = data.counter.location;
        if (data.counter.status === 1) {
          this.model.Status = true;
        }
        this.update = true;
      });
    }
  }

  submit() {
    if (!this.update) {
      this.addCounter();
    } else {
      this.updateCounter();
    }
  }

  addCounter() {
    this.model.isUpdate = false;
    if (this.model.Status) {
      this.model.Status = 1;
    } else {
      this.model.Status = 0;
    }
    this.counterService.addCounter(this.model).subscribe(() => {
      this.sweetAlert.successAdd('Add Successfully');
      this.router.navigate(['/counter']);
    }, error => {
      this.sweetAlert.warning(error);
    });
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  updateCounter() {
    this.model.isUpdate = true;
    if (this.model.Status) {
      this.model.Status = 1;
    } else {
      this.model.Status = 0;
    }
    this.counterService.editCounter(this.id, this.model).subscribe(() => {
      this.sweetAlert.successAdd('Edit Successfully');
      this.router.navigate(['/counter']);
    }, error => {
      this.sweetAlert.warning(error);
    });
  }
}
