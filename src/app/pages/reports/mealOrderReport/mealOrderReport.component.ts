import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { MealOrderEntryService } from 'src/app/_services/mealOrderEntry.service';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { MealOrder } from 'src/app/_models/mealOrder';
declare var Stimulsoft: any;

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
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private http: HttpClient,
    private sweetAlert: SweetAlertService,
    private mealOrderEntryService: MealOrderEntryService,
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

  Print(depart) {
    // console.log();
    const startDate = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day;
    const endDate = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day;
    const department = depart;
    console.log('start Date = ' + startDate);
    console.log('end Date = ' + endDate);
    console.log('department id = ' + department);
    this.mealOrderReortParams.startDate = startDate;
    this.mealOrderReortParams.endDate = endDate;
    this.loadReport();


  }

  loadDepartment() {
    this.http.get('http://localhost:5000/api/department').subscribe(response => {
      this.departments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

  loadReport() {
    this.mealOrderEntryService.getMealOrderReports(this.mealOrderReortParams).subscribe((res: PaginatedResult<MealOrder[]>) => {
          this.mealOrderResource = res.result;
          // this.pagination = res.pagination;
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
    // this.route.data.subscribe(data => {
    //   this.mealOrderResource = data.mealorder;
    // });
    this.loadReport();


    

    
  }
}
