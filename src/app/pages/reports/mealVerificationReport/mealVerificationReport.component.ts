import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

declare var Stimulsoft: any;

@Component({
  selector: "app-mealVerificationReport",
  templateUrl: "./mealVerificationReport.component.html",
  styleUrls: ["./mealVerificationReport.component.css"]
})
export class MealVerificationReportComponent implements OnInit {
  mealVerificationResource: any = [];
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
      this.mealVerificationResource = data["mealverification"];
    });

    this.mealVerificationResource.mealOrderResult.map(mo => {
      mo.date = this.convertDate(mo.orderDate);
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/MealVerification.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Meal Verification List";

    report.dictionary.databases.clear();
    report.regData(
      "MealVerification",
      "MealVerification",
      this.mealVerificationResource
    );

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("mealVerificationReport");
  }
}
