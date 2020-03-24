import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { MealOrderEntryService } from 'src/app/_services/mealOrderEntry.service';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { MealOrder } from 'src/app/_models/mealOrder';
import { ReportService } from 'src/app/_services/report.service';
import { environment } from 'src/environments/environment';
import { ConvertDateService } from 'src/app/_services/convertDate.service';
declare var Stimulsoft: any;
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mealOrderReport',
  templateUrl: './mealOrderReport.component.html',
  styleUrls: ['./mealOrderReport.component.css']
})
export class MealOrderReportComponent implements OnInit {
  // varible dari date picker
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  // end variable date picker

  departments: any;
  mealOrderReortParams: any = {} ;

  mealOrderResource: any = [];
  mealOrderReport: any = {};
  mealtype: any = [];
  orderDetail: any = [];
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
    this.loadReport();
    $('#department').change(function() {
      $(this).blur();
    });
  }

  Print(depart) {
    this.mealOrderReortParams.startDate = this.converDate.convertAB($('#start').val());
    this.mealOrderReortParams.endDate = this.converDate.convertAB($('#end').val());
    this.mealOrderReortParams.department = depart;
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
    this.orderDetail = [];
    this.mealtype = [];
    this.reportService.getMealOrderReports(this.mealOrderReortParams).subscribe((res: PaginatedResult<MealOrder[]>) => {
      this.mealOrderResource = res.result;
      this.mealOrderResource.mealTypeResult.map(mt => {
          this.mealtype.push({ id: mt.id, name: mt.name });
        });
      this.mealOrderResource.mealOrderResult.map(mo => {
          mo.mealOrderDetails.map(mod => {
            this.orderDetail.push({
              date: this.convertDate(mo.orderEntryDate),
              department: this.mealOrderResource.departmentResult.find(
                d => d.id === mo.departmentId
              ).name,
              mealtypeid: mod.mealTypeId,
              total: mod.orderQty,
              collected: mo.mealOrderVerificationId > 0 ? 'Yes' : 'No'
            });
          });
        });

      const report = Stimulsoft.Report.StiReport.createNewReport();
      const options = new Stimulsoft.Viewer.StiViewerOptions();
      report.loadFile('../assets/reports/MealOrder.mrt');
      report.dictionary.variables.getByName('title').valueObject =
        'Meal Order List';

      this.mealOrderReport.orderdetail = this.orderDetail;
      this.mealOrderReport.mealtype = this.mealtype;
      report.dictionary.databases.clear();
      report.regData('MealOrder', 'MealOrder', this.mealOrderReport);

      options.width = '100%';
      options.height = '850px';
      options.appearance.scrollbarsMode = true;

      const viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
      viewer.report = report;
      viewer.renderHtml('mealOrderReport');
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
