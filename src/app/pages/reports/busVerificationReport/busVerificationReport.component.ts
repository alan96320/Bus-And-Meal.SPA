import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

declare var Stimulsoft: any;

@Component({
  selector: "app-busVerificationReport",
  templateUrl: "./busVerificationReport.component.html",
  styleUrls: ["./busVerificationReport.component.css"]
})
export class BusVerificationReportComponent implements OnInit {
  busVerificationResource: any = [];
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
      this.busVerificationResource = data["busverification"];
    });

    this.busVerificationResource.busVerificationResult.map(bv => {
      bv.date = this.convertDate(bv.orderdate);
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/BusVerification.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Bus Verification List";

    report.dictionary.databases.clear();
    report.regData(
      "BusVerification",
      "BusVerification",
      this.busVerificationResource
    );

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("busVerificationReport");
  }
}
