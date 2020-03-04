import { Component, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

declare var Stimulsoft: any;
var data: any = [];

@Component({
  selector: "app-departmentReport",
  templateUrl: "./departmentReport.component.html",
  styleUrls: ["./departmentReport.component.css"]
})
export class DepartmentReportComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/Department.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Department List";
    data = [
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      },
      {
        id: 1,
        code: "D001",
        name: "Name 1"
      },
      {
        id: 1,
        code: "D002",
        name: "Name 2"
      },
      {
        id: 1,
        code: "D003",
        name: "Name 3"
      },
      {
        id: 1,
        code: "D004",
        name: "Name 4"
      }
    ];
    report.regData("DataSet", "DataSet", data);

    options.width = "100%";
    options.height = "800px";
    options.appearance.scrollbarsMode = true;
    options.appearance.openLinksWindow = "_blank";

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("departmentReport");
  }
}
