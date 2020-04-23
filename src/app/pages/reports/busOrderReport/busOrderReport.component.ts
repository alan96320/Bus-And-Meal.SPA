import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { ReportService } from 'src/app/_services/report.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { BusOrder } from 'src/app/_models/busOrder';
import { environment } from 'src/environments/environment';
import { ConvertDateService } from 'src/app/_services/convertDate.service';

declare var Stimulsoft: any;
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-busOrderReport',
  templateUrl: './busOrderReport.component.html',
  styleUrls: ['./busOrderReport.component.css']
})
export class BusOrderReportComponent implements OnInit {
  // varible dari date picker
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  // end variable date picker

  departments: any;
  busOrderReportParams: any = {};

  busOrderResource: any = [];
  busOrderReport: any = {};
  monthName = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  constructor(
    public formatter: NgbDateParserFormatter,
    private http: HttpClient,
    private sweetAlert: SweetAlertService,
    private reportService: ReportService,
    private converDate: ConvertDateService
  ) { }

  ngOnInit() {
    const start = $('#start');
    const end = $('#end');
    start.datepicker({
      format: 'dd-mm-yyyy',
      autoHide: true
    });
    end.datepicker({
      format: 'dd-mm-yyyy',
      autoHide: true
    });
    this.loadDepartment();
    // this.loadReport();
    $('#department').change(function() {
      $(this).blur();
    });
  }

  Print(depart) {
    this.busOrderReportParams.startDate = this.converDate.convertAB($('#start').val());
    this.busOrderReportParams.endDate = this.converDate.convertAB($('#end').val());
    this.busOrderReportParams.department = depart;
    this.loadReport();
  }

  loadDepartment() {
    this.http.get(environment.apiUrl + 'department').subscribe(response => {
      this.departments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  loadReport() {
    this.reportService.getBusOrderReports(this.busOrderReportParams).subscribe((res: PaginatedResult<BusOrder[]>) => {
      this.busOrderResource = res.result;

      this.busOrderReport.busorder = this.busOrderResource.busOrderResult;
      this.busOrderReport.bustime = this.busOrderResource.bustimeResult;
      this.busOrderReport.department = this.busOrderResource.departmentResult;
      this.busOrderReport.direction = this.busOrderResource.direction;
      this.busOrderReport.dormitoryblock = this.busOrderResource.dormitoryblockResult;
      this.busOrderReport.busorder.map(bo => {
        bo.date = this.convertDate(bo.orderEntryDate);
        bo.collected = bo.busOrderVerificationId > 0 ? 'Yes' : 'No'
      });

      Stimulsoft.Base.StiLicense.loadFromFile('../assets/reports/license.key');
      const report = Stimulsoft.Report.StiReport.createNewReport();
      const options = new Stimulsoft.Viewer.StiViewerOptions();
      report.loadFile('../assets/reports/BusOrder.mrt');
      report.dictionary.variables.getByName('title').valueObject =
        'Bus Order List';
      report.reportName = 'BusMeal-Bus Order Report';
      report.dictionary.databases.clear();
      report.regData('BusOrder', 'BusOrder', this.busOrderReport);
             

      options.width = '100%';
      options.height = '850px';
      options.appearance.scrollbarsMode = true;
      options.appearance.fullScreenMode = true;

      const viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
      viewer.report = report;
      viewer.renderHtml('busOrderReport');
    },
      error => {
        this.sweetAlert.error(error);
      }
    );
  }

  convertDate(newDate) {
    // tslint:disable-next-line: no-shadowed-variable
    const dgt = d => {
      return d < 10 ? '0' + d : d;
    };
    const d = new Date(newDate);
    return [
      dgt(d.getDate()),
      this.monthName[d.getMonth()],
      d.getFullYear()
    ].join(' ');
  }
}
