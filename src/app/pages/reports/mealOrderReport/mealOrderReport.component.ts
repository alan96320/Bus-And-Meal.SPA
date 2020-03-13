import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

declare var Stimulsoft: any;

@Component({
  selector: "app-mealOrderReport",
  templateUrl: "./mealOrderReport.component.html",
  styleUrls: ["./mealOrderReport.component.css"]
})
export class MealOrderReportComponent implements OnInit {
  mealOrderResource: any = [];
  mealOrderReport: any = {};
  mealtype: any = [];
  orderDetail: any = [];
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
      this.mealOrderResource = data["mealorder"];
    });

    this.mealOrderResource.mealTypeResult.map(mt => {
      this.mealtype.push({ id: mt.id, name: mt.name });
    });

    this.mealOrderResource.mealOrderResult.map(mo => {
      mo.mealOrderDetails.map(mod => {
        this.orderDetail.push({
          date: this.convertDate(mo.orderEntryDate),
          department: this.mealOrderResource.departmentResult.find(
            d => d.id == mo.departmentId
          ).name,
          mealtypeid: mod.mealTypeId,
          total: mod.orderQty
        });
      });
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/MealOrder.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Meal Order Summary";

    this.mealOrderReport.orderdetail = this.orderDetail;
    this.mealOrderReport.mealtype = this.mealtype;
    report.dictionary.databases.clear();
    report.regData("MealOrder", "MealOrder", this.mealOrderReport);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("mealOrderReport");
  }
}
