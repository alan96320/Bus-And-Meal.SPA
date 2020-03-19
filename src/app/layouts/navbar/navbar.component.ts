import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  activeTrasaction = false;
  activeReport = false;
  activeConfiguration = false;

  status: boolean;
  status1: string;
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
          'Welcome to Aplication Bus And Meal, ' + this.model.username
        );
      },
      error => {
        this.sweetAlert.error(error);
        // this.alertify.warning('Login Failed');
      },
      () => {
        this.router.navigate(['/home']);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
    // const token = localStorage.getItem('token');
    // return !!token;
  }

  logout() {
    this.model.username = '';
    this.model.password = '';
    localStorage.removeItem('token');
    localStorage.removeItem('id_user');
    localStorage.removeItem('isAdmin');
    this.sweetAlert.warning('Logout Succcess');
    this.router.navigate(['/home']);
  }
}
