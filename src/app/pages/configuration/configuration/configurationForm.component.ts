import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Configuration } from "src/app/_models/configuration";
import { ConfigurationService } from "src/app/_services/configuration.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-configurationForm",
  templateUrl: "./configurationForm.component.html",
})
export class ConfigurationFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  configuration: Configuration;
  id: any;

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
    this.route.data.subscribe((data) => {
      this.id = data.configuration[0].id;
      this.model.lockedBusOrderStart1 =
        data.configuration[0].lockedBusOrderStart1;
      this.model.lockedBusOrderEnd1 = data.configuration[0].lockedBusOrderEnd1;
      this.model.lockedBusOrderStart2 =
        data.configuration[0].lockedBusOrderStart2;
      this.model.lockedBusOrderEnd2 = data.configuration[0].lockedBusOrderEnd2;
      this.model.lockedMealOrder = data.configuration[0].lockedMealOrder;
    });
  }
  cancel() {
    this.cancelAdd.emit(false);
  }

  saveConfiguration() {
    this.configurationService.editConfiguration(this.id, this.model).subscribe(
      () => {
        this.sweetAlert.successAdd("Edit Successfully");
        this.router.navigate(["/dashboard"]);
      },
      (error) => {
        this.sweetAlert.warning(error);
      }
    );
  }
}
