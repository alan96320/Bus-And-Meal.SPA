import { Component, OnInit } from "@angular/core";
import { Employee } from "src/app/_models/employee";
import { ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";
import { EmployeeService } from "src/app/_services/employee.service";

declare var Stimulsoft: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-employeeReport",
  templateUrl: "./employeeReport.component.html",
  styleUrls: ["./employeeReport.component.css"],
})
export class EmployeeReportComponent implements OnInit {
  employees: any = [];

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.employees = data.employee;
    });

    let employeeData = [];

    employeeData = JSON.parse(JSON.stringify(this.employees));
    employeeData.map((data) => {
      data.departmentname = data.department.name;
      delete data.department;
    });

    Stimulsoft.Base.StiLicense.loadFromFile("../assets/reports/license.key");
    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/Employee.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Employee List";
    report.reportName = "BusMeal-Employee Report";
    report.regData("Employee", "Employee", employeeData);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;
    // options.appearance.fullScreenMode = true;
    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("employeeReport");
  }
}
