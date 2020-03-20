import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { ReportService } from 'src/app/_services/report.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MealOrderVerification } from 'src/app/_models/mealOrderVerification';

declare var Stimulsoft: any;

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
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private http: HttpClient,
    private sweetAlert: SweetAlertService,
    private reportService: ReportService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  loadDepartment() {
    this.http.get('http://localhost:5000/api/department').subscribe(response => {
      this.departments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  Print(depart) {
    // console.log();
    const startDate = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day;
    const endDate = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day;
    const department = depart;
    this.mealVerificationReportParams.startDate = startDate;
    this.mealVerificationReportParams.endDate = endDate;
    this.mealVerificationReportParams.department = department;
    this.loadReport();
  }

  loadReport() {
    // tslint:disable-next-line:max-line-length
    this.reportService.getMealVerificationReports(this.mealVerificationReportParams).subscribe((res: PaginatedResult<MealOrderVerification[]>) => {
      this.mealVerificationResource = res.result;

      this.mealVerificationResource.mealOrderResult.map(mo => {
        mo.date = this.convertDate(mo.orderDate);
      });

      const report = Stimulsoft.Report.StiReport.createNewReport();
      const options = new Stimulsoft.Viewer.StiViewerOptions();
      report.loadFile('../assets/reports/MealVerification.mrt');
      report.dictionary.variables.getByName('title').valueObject =
        'Meal Verification List';

      report.dictionary.databases.clear();
      report.regData(
        'MealVerification',
        'MealVerification',
        this.mealVerificationResource
      );

      options.width = '100%';
      options.height = '850px';
      options.appearance.scrollbarsMode = true;

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

  ngOnInit() {
    this.loadDepartment();
    this.loadReport();
  }
}
