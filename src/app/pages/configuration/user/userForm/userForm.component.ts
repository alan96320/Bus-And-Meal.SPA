import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Users } from 'src/app/_models/users';
import { UsersService } from 'src/app/_services/users.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-userForm',
  templateUrl: './userForm.component.html'
})
export class UserFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update = false;
  user: Users;
  id = +this.route.snapshot.params.id;
  listDepartments: any;
  userModule: any = {};
  departmentSubmit: any = [];
  checkedList: any = [];
  checkedStatus: any = [];
  previouseUserDepartmentState: any = [];

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadDepartment();

  }

  loadUsers() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.gddbId = data.user.gddbId;
        this.model.username = data.user.username;
        this.model.firstname = data.user.firstName;
        this.model.lastname = data.user.lastName;
        this.model.fullname = data.user.fullName;
        this.model.adminStatus = data.user.adminStatus;
        this.model.lockTransStatus = data.user.lockTransStatus;
        this.userModule = data.user.userModuleRights;
        if (data.user.isActive) {
          this.model.isActive = true;
        } else {
          this.model.isActive = false;
        }
        this.userModule.sort((a, b) =>
          a.moduleRights.description > b.moduleRights.description ? 1 : -1
        ); // for sorting asc by description
        this.model.userDepartment = data.user.userDepartments;
        this.update = true;
        this.model.userDepartment.map(item => {
          this.checkedStatus.push(item.departmentId);
        });
        this.checkedList = JSON.parse(JSON.stringify(this.checkedStatus));
      });
    }
  }
  submit() {
    this.updateUsers();
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  fullName(firstName, lastName) {
    this.model.fullname = firstName + ' ' + lastName;
  }

  departmentCheck(event) {
    if (event.target.checked === true) {
      this.checkedList.push(event.target.value);
    } else {
      const index = this.checkedList.indexOf(event.target.value);
      this.checkedList.splice(index, 1);
    }
  }

  updateUsers() {
    // update department
    this.departmentSubmit = [];
    this.checkedList.map(item => {
      this.departmentSubmit.push({
        departmentId: item,
        userId: this.id
      });
    });

    // update module right
    const moduleRightSubmit = JSON.parse(JSON.stringify(this.userModule));
    moduleRightSubmit.map(data => {
      delete data.moduleRights;
    });

    if (this.model.lockTransStatus === true) {
      this.model.lockTransStatus = 1;
    }else{
      this.model.lockTransStatus = 0;
    }
    // update model with new data before send to server
    this.model.userDepartments = this.departmentSubmit;
    this.model.userModuleRights = moduleRightSubmit;

    this.usersService.editUser(this.id, this.model).subscribe(
      () => {
        this.sweetAlert.successAdd('Edit Successfully');
        this.router.navigate(['/user']);
      },
      error => {
        this.sweetAlert.warning(error);
      }
    );
  }

  loadDepartment() {
    this.http.get(environment.apiUrl + 'department').subscribe(
      response => {
        this.listDepartments = response;
      },
      error => {
        this.sweetAlert.error(error);
      }
    );
  }
}
