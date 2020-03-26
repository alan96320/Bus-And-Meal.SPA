import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { ReportService } from 'src/app/_services/report.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MealOrderVerification } from 'src/app/_models/mealOrderVerification';
import { environment } from 'src/environments/environment';
import { ConvertDateService } from 'src/app/_services/convertDate.service';

declare var Stimulsoft: any;
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mealVerificationReport',
  templateUrl: './mealVerificationReport.component.html',
  styleUrls: ['./mealVerificationReport.component.css']
})
export class MealVerificationReportComponent implements OnInit {
  // varible dari date picker
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  // end variable date picker

  departments: any;
  mealVerificationReportParams: any = {};

  mealVerificationResource: any = [];
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

  loadDepartment() {
    this.http.get(environment.apiUrl + 'department').subscribe(response => {
      this.departments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  Print() {
    this.mealVerificationReportParams.startDate = this.converDate.convertAB($('#start').val());
    this.mealVerificationReportParams.endDate = this.converDate.convertAB($('#end').val());
    this.loadReport();
  }

  loadReport() {
    // tslint:disable-next-line:max-line-length
    this.reportService.getMealVerificationReports(this.mealVerificationReportParams).subscribe((res: PaginatedResult<MealOrderVerification[]>) => {
      this.mealVerificationResource = res.result;

      this.mealVerificationResource.mealOrderResult.map(mo => {
        mo.date = this.convertDate(mo.orderDate);
      });

      Stimulsoft.Base.StiLicense.loadFromFile('../assets/reports/license.key');
      const report = Stimulsoft.Report.StiReport.createNewReport();
      const options = new Stimulsoft.Viewer.StiViewerOptions();
      report.loadFile('../assets/reports/MealVerification.mrt');
      report.dictionary.variables.getByName('title').valueObject =
        'Meal Verification List';
      report.reportName = 'BusMeal-Meal Verification Report';
      report.dictionary.databases.clear();
      report.regData(
        'MealVerification',
        'MealVerification',
        this.mealVerificationResource
      );

      options.width = '100%';
      options.height = '850px';
      options.appearance.scrollbarsMode = true;
      options.appearance.fullScreenMode = true;

      const viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
      viewer.report = report;
      viewer.renderHtml('mealVerificationReport');
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
