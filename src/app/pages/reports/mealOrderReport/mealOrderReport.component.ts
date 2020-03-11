import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";
import { MealOrderService } from "src/app/_services/mealOrder.service";
import { DepartmentService } from "src/app/_services/department.service";
import { MealTypeService } from "src/app/_services/mealType.service";

declare var Stimulsoft: any;

@Component({
  selector: "app-mealOrderReport",
  templateUrl: "./mealOrderReport.component.html",
  styleUrls: ["./mealOrderReport.component.css"]
})
export class MealOrderReportComponent implements OnInit {
  mealOrderResource: any = [];
  mealOrderResult: any = [];
  mealOrderReport: any = [];
  department: any = [];
  mealtype: any = [];
  orderDetail: any[];
  mealOrder: any = [];

  constructor(
    private mealOrderService: MealOrderService,
    private departmentService: DepartmentService,
    private mealTypeService: MealTypeService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    let Data = {
      orderdetail: [
        {
          date: "10 maret 2020",
          mealtypeid: 1,
          department: "HR",
          total: 10
        },
        {
          date: "10 maret 2020",
          mealtypeid: 2,
          department: "HR",
          total: 20
        },
        {
          date: "10 maret 2020",
          mealtypeid: 3,
          department: "HR",
          total: 30
        },
        {
          date: "10 maret 2020",
          mealtypeid: 4,
          department: "HR",
          total: 40
        },
        {
          date: "10 maret 2020",
          mealtypeid: 5,
          department: "HR",
          total: 40
        },
        {
          date: "10 maret 2020",
          mealtypeid: 1,
          department: "IT",
          total: 10
        },
        {
          date: "10 maret 2020",
          mealtypeid: 2,
          department: "IT",
          total: 20
        },
        {
          date: "10 maret 2020",
          mealtypeid: 3,
          department: "IT",
          total: 30
        },
        {
          date: "10 maret 2020",
          mealtypeid: 4,
          department: "IT",
          total: 40
        },
        {
          date: "10 maret 2020",
          mealtypeid: 1,
          department: "Finance",
          total: 10
        },
        {
          date: "10 maret 2020",
          mealtypeid: 2,
          department: "Finance",
          total: 20
        },
        {
          date: "10 maret 2020",
          mealtypeid: 3,
          department: "Finance",
          total: 30
        },
        {
          date: "10 maret 2020",
          mealtypeid: 4,
          department: "Finance",
          total: 40
        }
      ],
      mealtype: [
        {
          id: 1,
          name: "Breakfast"
        },
        {
          id: 2,
          name: "Lunch"
        },
        {
          id: 3,
          name: "Dinner"
        },
        {
          id: 4,
          name: "Supper"
        },
        {
          id: 5,
          name: "Give Away"
        }
      ]
    };

    this.route.data.subscribe(data => {
      this.mealOrderResource = data["mealorder"];
    });

    this.mealOrderResource.mealTypeResult.map(mt => {
      this.mealtype.push([{ id: mt.id, name: mt.name }]);
    });

    this.mealOrderResource.mealOrderResult.map(a => {
      a.mealOrderDetails.map(b => {
        this.mealOrder.push([
          {
            date: a.orderEntryDate,
            department: this.mealOrderResource.departmentResult.find(
              x => x.id == a.departmentId
            ).name,
            mealtypeid: b.mealTypeId,
            total: b.orderQty
          }
        ]);
      });
    });

    this.mealOrderReport.push([this.mealOrder, this.mealtype]);

    // this.mealOrderResource.mealOrderResult.map(mo => {
    //   mo.mealOrderDetails.map(mod => {
    //     (mod.date = this.mealOrderResource.mealOrderResult.orderEntryDate),
    //       (mod.department = this.mealOrderResource.departmentResult.find(
    //         x => x.id == this.mealOrderResource.mealOrderResult.departmentId
    //       ).name),
    //       (mod.mealtypeid = mod.mealTypeId),
    //       (mod.total = mod.orderQty);
    //   });
    // });
    // console.log(this.orderDetail);

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/MealOrder.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Meal Order Summary";
    report.dictionary.databases.clear();
    report.regData("Meal Order", "Meal Order", this.mealOrderReport);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("mealOrderReport");
  }
}
