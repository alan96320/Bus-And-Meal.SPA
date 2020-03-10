import { Component, OnInit } from '@angular/core';
import { MealType } from 'src/app/_models/mealType';
import { MealTypeService } from 'src/app/_services/mealType.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

declare var Stimulsoft: any;

@Component({
  selector: 'app-mealTypeReport',
  templateUrl: './mealTypeReport.component.html',
  styleUrls: ['./mealTypeReport.component.css']
})
export class MealTypeReportComponent implements OnInit {
  mealTypes: MealType[];

  constructor(
    private mealTypeService: MealTypeService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.mealTypes = data ["mealtype"];
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/MealType.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Meal Type List";
    console.log(this.mealTypes);
    
    report.regData("DataSet", "DataSet", this.mealTypes);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("mealtypeReport");


  }

}
