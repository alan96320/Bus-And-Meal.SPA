import { Component, OnInit } from '@angular/core';
import { MealType } from 'src/app/_models/mealType';
import { MealTypeService } from 'src/app/_services/mealType.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

declare var Stimulsoft: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-mealTypeReport',
  templateUrl: './mealTypeReport.component.html',
  styleUrls: ['./mealTypeReport.component.css']
})
export class MealTypeReportComponent implements OnInit {
  mealTypes: any = [];

  constructor(
    private mealTypeService: MealTypeService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.mealTypes = data.mealtype;
    });

    let mealTypeData = [];
    mealTypeData = JSON.parse(JSON.stringify(this.mealTypes));
    // mealTypeData.map(data => {
    //   data.vendorname = data.mealVendor.name;
    //   delete data.mealVendor;
    // });

    Stimulsoft.Base.StiLicense.loadFromFile('../assets/reports/license.key');
    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile('../assets/reports/MealType.mrt');
    report.dictionary.variables.getByName('title').valueObject =
      'Meal Type List';

    report.regData('MealType', 'MealType', mealTypeData);

    options.width = '100%';
    options.height = '850px';
    options.appearance.scrollbarsMode = true;
    options.appearance.fullScreenMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
    viewer.report = report;
    viewer.renderHtml('mealtypeReport');
  }
}
