import { Component, OnInit } from "@angular/core";
import { Users } from "src/app/_models/users";
import { UsersService } from "src/app/_services/users.service";
import { ActivatedRoute } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";

declare var Stimulsoft: any;

@Component({
  selector: "app-usersReport",
  templateUrl: "./usersReport.component.html",
  styleUrls: ["./usersReport.component.css"]
})
export class UsersReportComponent implements OnInit {
  users: any = [];

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data["users"];
    });

    let userData = JSON.parse(JSON.stringify(this.users));
    userData.map(data => {
      delete data.userModuleRights;
      delete data.userDepartments;
    });

    const report = Stimulsoft.Report.StiReport.createNewReport();
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    report.loadFile("../assets/reports/Users.mrt");
    report.dictionary.variables.getByName("title").valueObject = "Users List";

    report.regData("User", "User", userData);

    options.width = "100%";
    options.height = "850px";
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("usersReport");
  }
}
