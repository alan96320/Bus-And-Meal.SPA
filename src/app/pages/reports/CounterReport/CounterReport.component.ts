import { Component, OnInit } from "@angular/core";
import { Counter } from "src/app/_models/counter";
import { CounterService } from "src/app/_services/counter.service";
import { ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";

declare var Stimulsoft: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-counterReport",
  templateUrl: "./CounterReport.component.html",
  styleUrls: ["./CounterReport.component.css"],
})
export class CounterReportComponent implements OnInit {
  counters: any = [];

  constructor(
    private counterService: CounterService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.counters = data.counter;
    });

    Stimulsoft.Base.StiLicense.loadFromFile("../assets/reports/license.key");
    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/Counter.mrt");
    report.dictionary.variables.getByName("title").valueObject = "Counter List";
    report.reportName = "BusMeal-Counter Report";
    report.regData("Counter", "Counter", this.counters);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;
    // options.appearance.fullScreenMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("counterReport");
  }
}
