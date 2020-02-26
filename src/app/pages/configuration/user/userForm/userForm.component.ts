import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Users } from 'src/app/_models/Users';
import { UsersService } from 'src/app/_services/Users.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userForm',
  templateUrl: './userForm.component.html',
})
export class UserFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update: boolean = false;
  user: Users;
  id = +this.route.snapshot.params['id'];
  listDepartments: any;

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.hrCoreNo = data['user'].gddbId;
        this.model.firstname = data['user'].firstName;
        this.model.lastname = data['user'].lastName;
        this.model.fullname = data['user'].fullName;
        this.model.adminStatus = data['user'].adminStatus;
        this.model.lockTransStatus = data['user'].lockTransStatus;
        this.update = true;
      });
    }
  }
  submit() {
    this.updateUsers();
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  updateUsers() {
    console.log(this.model);
    this.usersService.editUser(this.id, this.model).subscribe(() => {
      this.sweetAlert.successAdd('Edit Successfully');
      this.router.navigate(['/Users']);
    }, error => {
      this.sweetAlert.warning(error);
    });
  }

  loadDepartment() {
    this.http.get('http://localhost:5000/api/department').subscribe(response => {
      this.listDepartments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

}