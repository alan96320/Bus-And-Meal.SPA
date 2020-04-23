import { Component, OnInit } from "@angular/core";
import { MealVendor } from "src/app/_models/mealVendor";
import { MealVendorService } from "src/app/_services/mealVendor.service";
import { ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";

declare var Stimulsoft: any;

@Component({
  selector: "app-mealVendorReport",
  templateUrl: "./mealVendorReport.component.html",
  styleUrls: ["./mealVendorReport.component.css"]
})
export class MealVendorReportComponent implements OnInit {
  mealVendors: any = [];

  constructor(
    private mealTypeService: MealVendorService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.mealVendors = data["mealvendor"];
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/MealVendor.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Meal Vendor List";

    report.regData("MealVendor", "MealVendor", this.mealVendors);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("mealvendorReport");
  }
}
