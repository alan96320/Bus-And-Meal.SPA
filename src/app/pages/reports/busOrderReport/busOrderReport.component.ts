import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

declare var Stimulsoft: any;

@Component({
  selector: "app-busOrderReport",
  templateUrl: "./busOrderReport.component.html",
  styleUrls: ["./busOrderReport.component.css"]
})
export class BusOrderReportComponent implements OnInit {
  busOrderResource: any = [];
  busOrderReport: any = {};
  monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  constructor(private route: ActivatedRoute) {}

  convertDate(newDate) {
    const dgt = d => {
      return d < 10 ? "0" + d : d;
    };
    var d = new Date(newDate);
    return [
      dgt(d.getDate()),
      this.monthName[d.getMonth()],
      d.getFullYear()
    ].join(" ");
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.busOrderResource = data["busorder"];
    });
    this.busOrderReport.busorder = this.busOrderResource.busOrderResult;
    this.busOrderReport.bustime = this.busOrderResource.bustimeResult;
    this.busOrderReport.department = this.busOrderResource.departmentResult;
    this.busOrderReport.direction = this.busOrderResource.direction;
    this.busOrderReport.dormitoryblock = this.busOrderResource.dormitoryblockResult;
    this.busOrderReport.busorder.map(bo => {
      bo.date = this.convertDate(bo.orderEntryDate);
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/BusOrder.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Bus Order Verification";

    report.dictionary.databases.clear();
    report.regData("BusOrder", "BusOrder", this.busOrderReport);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("busOrderReport");
  }
}
