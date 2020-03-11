import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Counter } from "src/app/_models/counter";
import { CounterService } from "src/app/_services/counter.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-CounterForm",
  templateUrl: "./CounterForm.component.html"
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
        this.model.code = data.counter.code;
        this.model.name = data.counter.name;
        this.model.location = data.counter.location;
        if (data.counter.status === 1) {
          this.model.status = true;
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
    if (this.model.status) {
      this.model.status = 1;
    } else {
      this.model.status = 0;
    }
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  updateCounter() {
    if (this.model.status) {
      this.model.status = 1;
    } else {
      this.model.status = 0;
    }
  }
}
