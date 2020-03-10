import { Component, OnInit } from '@angular/core';
import { DormitoryBlock } from 'src/app/_models/dormitoryBlock';
import { DormitoryBlockService } from 'src/app/_services/dormitoryBlock.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

declare var Stimulsoft: any;

@Component({
  selector: 'app-dormitoryBlockReport',
  templateUrl: './dormitoryBlockReport.component.html',
  styleUrls: ['./dormitoryBlockReport.component.css']
})
export class DormitoryBlockReportComponent implements OnInit {
  dormitoryblocks: DormitoryBlock[];

  constructor(
    private dormitoryBlockService: DormitoryBlockService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.dormitoryblocks = data ["dormitoryblock"];
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/DormitoryBlock.mrt");
    report.dictionary.variables.getByName("title").valueObject =
      "Dormitory Block List";

    report.regData("DataSet", "DataSet", this.dormitoryblocks);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("dormitoryblockReport");


  }

}
