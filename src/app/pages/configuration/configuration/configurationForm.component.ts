import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Configuration } from "src/app/_models/configuration";
import { ConfigurationService } from "src/app/_services/configuration.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-configurationForm",
  templateUrl: "./configurationForm.component.html"
})
export class ConfigurationFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  configuration: Configuration;
  id = +this.route.snapshot.params.id;

  constructor(
    private configurationService: ConfigurationService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadConfiguration();
  }

  loadConfiguration() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.rowGrid = data.configuration.rowGrid;
        this.model.lockedBusOrder = data.configuration.lockedBusOrder;
        this.model.lockedMealOrder = data.configuration.lockedMealOrder;
      });
    }
  }
  cancel() {
    this.cancelAdd.emit(false);
  }

  saveConfiguration() {
    console.log(this.model);
    this.configurationService.editConfiguration(this.id, this.model).subscribe(
      () => {
        this.sweetAlert.successAdd("Edit Successfully");
        this.router.navigate(["/dashboard"]);
      },
      error => {
        this.sweetAlert.warning(error);
      }
    );
  }
}
