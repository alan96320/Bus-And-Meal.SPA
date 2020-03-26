import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { ReportService } from 'src/app/_services/report.service';
import { BusOrderVerification } from 'src/app/_models/busOrderVerification';
import { PaginatedResult } from 'src/app/_models/pagination';
import { environment } from 'src/environments/environment';
import { ConvertDateService } from 'src/app/_services/convertDate.service';

declare var Stimulsoft: any;
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-busVerificationReport',
  templateUrl: './busVerificationReport.component.html',
  styleUrls: ['./busVerificationReport.component.css']
})
export class BusVerificationReportComponent implements OnInit {
  // varible dari date picker
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  // end variable date picker

  departments: any;
  busVerificationReportParams: any = {};

  busVerificationResource: any = [];
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
  ) {}

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

  loadDepartment() {
    this.http.get(environment.apiUrl + 'department').subscribe(response => {
      this.departments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  Print(depart) {
    this.busVerificationReportParams.startDate = this.converDate.convertAB($('#start').val());
    this.busVerificationReportParams.endDate = this.converDate.convertAB($('#end').val());
    this.busVerificationReportParams.department = depart;
    this.loadReport();
  }

  loadReport() {
    // tslint:disable-next-line:max-line-length
    this.reportService.getBusVerificationReports(this.busVerificationReportParams).subscribe((res: PaginatedResult<BusOrderVerification[]>) => {
      this.busVerificationResource = res.result;
      this.busVerificationResource.busVerificationResult.map(bv => {
        bv.date = this.convertDate(bv.orderdate);
      });

      const report = Stimulsoft.Report.StiReport.createNewReport();
      const options = new Stimulsoft.Viewer.StiViewerOptions();
      report.loadFile('../assets/reports/BusVerification.mrt');
      report.dictionary.variables.getByName('title').valueObject =
        'Bus Verification List';

      report.dictionary.databases.clear();
      report.regData(
        'BusVerification',
        'BusVerification',
        this.busVerificationResource
      );

      options.width = '100%';
      options.height = '850px';
      options.appearance.scrollbarsMode = true;

      const viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
      viewer.report = report;
      viewer.renderHtml('busVerificationReport');
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
