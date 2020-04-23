import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DepartmentService } from 'src/app/_services/department.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { Department } from 'src/app/_models/department';

declare var Stimulsoft: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-departmentReport',
  templateUrl: './departmentReport.component.html',
  styleUrls: ['./departmentReport.component.css']
})
export class DepartmentReportComponent implements OnInit {
  departments: Department[];

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.departments = data.department;
    });

    Stimulsoft.Base.StiLicense.loadFromFile('../assets/reports/license.key');
    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile('../assets/reports/Department.mrt');
    report.dictionary.variables.getByName('title').valueObject =
      'Department List';
    report.reportName = 'BusMeal-Department Report';
    report.regData('Department', 'Department', this.departments);

    options.width = '100%';
    options.height = '850px';
    options.appearance.scrollbarsMode = true;
    options.appearance.fullScreenMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
    viewer.report = report;
    viewer.renderHtml('departmentReport');
  }
}
