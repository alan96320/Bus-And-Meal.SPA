import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/_services/auth.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { Router } from "@angular/router";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  activeTrasaction = false;
  activeReport = false;
  activeConfiguration = false;
  public isCollapsed = true;

  model: any = {};
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {}

  activeLinkTrasaction() {
    this.activeTrasaction = true;
    this.activeReport = false;
    this.activeConfiguration = false;
  }
  activeLinkReport() {
    this.activeTrasaction = false;
    this.activeReport = true;
    this.activeConfiguration = false;
  }
  activeLinkConfiguration() {
    this.activeTrasaction = false;
    this.activeReport = false;
    this.activeConfiguration = true;
  }
  destroyActiveLink() {
    this.activeTrasaction = false;
    this.activeReport = false;
    this.activeConfiguration = false;
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.sweetAlert.success(
          "Welcome to Aplication Bus And Meal, " + this.model.username
        );
      },
      error => {
        this.sweetAlert.error("Incorrect username or password");
        // this.alertify.warning('Login Failed');
      },
      () => {
        this.router.navigate(["/home"]);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
    // const token = localStorage.getItem('token');
    // return !!token;
  }

  logout() {
    localStorage.removeItem("token");
    this.sweetAlert.warning("Logout Sukses");
    this.router.navigate(["/home"]);
  }
}
