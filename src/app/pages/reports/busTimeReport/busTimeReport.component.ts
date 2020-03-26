import { Component, OnInit } from '@angular/core';
import { BusTime } from 'src/app/_models/busTime';
import { BusTimeService } from 'src/app/_services/busTime.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

declare var Stimulsoft: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-busTimeReport',
  templateUrl: './busTimeReport.component.html',
  styleUrls: ['./busTimeReport.component.css']
})
export class BusTimeReportComponent implements OnInit {
  bustimes: any = [];

  constructor(
    private busTimeService: BusTimeService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.bustimes = data.bustime;
    });

    Stimulsoft.Base.StiLicense.loadFromFile('../assets/reports/license.key');
    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile('../assets/reports/BusTime.mrt');
    report.dictionary.variables.getByName('title').valueObject =
      'Bus Time List';
    report.reportName = 'BusMeal-Bus Time Report';
    report.regData('BusTime', 'BusTime', this.bustimes);

    options.width = '100%';
    options.height = '850px';
    options.appearance.scrollbarsMode = true;
    options.appearance.fullScreenMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
    viewer.report = report;
    viewer.renderHtml('bustimeReport');
  }
}
