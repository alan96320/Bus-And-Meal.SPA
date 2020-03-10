import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/_models/employee';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { EmployeeService } from 'src/app/_services/employee.service';

declare var Stimulsoft: any;

@Component({
  selector: 'app-employeeReport',
  templateUrl: './employeeReport.component.html',
  styleUrls: ['./employeeReport.component.css']
})
export class EmployeeReportComponent implements OnInit {
  employees: Employee[];

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.employees = data ["employee"];
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/Employee.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Employee List";

    report.regData("DataSet", "DataSet", this.employees);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("employeeReport");


  }

}
