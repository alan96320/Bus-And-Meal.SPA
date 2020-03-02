import { Component, OnInit } from "@angular/core";
import { UsersService } from "src/app/_services/users.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { Users } from "src/app/_models/users";
import { Pagination, PaginatedResult } from "src/app/_models/pagination";
import { SweetAlertService } from "src/app/_services/sweetAlert.service";
import swal from "sweetalert2";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-userList",
  templateUrl: "./userList.component.html"
})
export class UserListComponent implements OnInit {
  sortAscHrCoreNo: boolean;
  sortAscFirstname: boolean;
  sortAscLastname: boolean;
  sortAscFullname: boolean;
  sortAscHIDNo: boolean;
  sortAscDepartmentId: boolean;
  filter: boolean = true;

  listDepartments: any;

  //deklarasi untuk get data
  users: Users[];
  pagination: Pagination;
  UsersParams: any = {};
  model: any = {};

  constructor(
    private usersService: UsersService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data["user"].result;
      this.pagination = data["user"].pagination;
    });
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName == "hrCoreNo") {
      this.sortAscHrCoreNo = !this.sortAscHrCoreNo;
      this.UsersParams.OrderBy = getName;
      this.UsersParams.isDesc = this.sortAscHrCoreNo;
      this.loadUsers();
    }
  }

  // kita buat fungsi untuk ketika tombol page di click
  clickMe(pageMe) {
    this.pagination.currentPage = pageMe;
    this.loadUsers();
  }

  //kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
  nextPage() {
    if (this.pagination.currentPage != this.pagination.totalPages) {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.loadUsers();
    }
  }

  //kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
  prevPage() {
    if (this.pagination.currentPage != 1) {
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.loadUsers();
    }
  }

  //kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
  endPage(Page) {
    if (this.pagination.currentPage != Page) {
      this.pagination.currentPage = Page;
      this.loadUsers();
    }
  }

  //kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
  startPage() {
    this.pagination.currentPage = 1;
    this.loadUsers();
  }

  // kita buat fungsi untuk select cange size per page
  changeSize(size) {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.loadUsers();
  }

  //kita buat fungsi untuk Order By
  OrderBy(hrCoreNo, firstname, lastname, fullname, hIDNo, department) {
    if (
      hrCoreNo !== null ||
      firstname !== null ||
      lastname !== null ||
      fullname !== null ||
      hIDNo !== null ||
      department !== null
    ) {
      this.UsersParams.hrCoreNo = hrCoreNo;
      this.UsersParams.firstname = firstname;
      this.UsersParams.lastname = lastname;
      this.UsersParams.fullname = fullname;
      this.UsersParams.hIDNo = hIDNo;
      this.UsersParams.departmentName = department;
      this.loadUsers();
    }
  }

  //lkita buat fungsi cancel Filter
  cancelFilter(status) {
    if (status == "Filter") {
      this.UsersParams.hrCoreNo = null;
      this.UsersParams.firstname = null;
      this.UsersParams.lastname = null;
      this.UsersParams.fullname = null;
      this.UsersParams.hIDNo = null;
      this.UsersParams.departmentName = null;
      this.loadUsers();
    }
  }

  //for delete data
  deleteUsers(id: number) {
    confirm
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.usersService.deleteUser(id).subscribe(
            () => {
              this.sweetAlert.warningDel();
              this.loadUsers();
            },
            error => {
              this.sweetAlert.warning(error);
            }
          );
        }
      });
  }

  // for laod data
  loadUsers() {
    this.usersService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.pageSize,
        this.UsersParams
      )
      .subscribe(
        (res: PaginatedResult<Users[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.sweetAlert.error(error);
        }
      );
  }

  loadDepartment() {
    this.http.get("http://localhost:5000/api/department").subscribe(
      response => {
        this.listDepartments = response;
      },
      error => {
        this.sweetAlert.error(error);
      }
    );
  }
}

// for custom class sweet alert
const confirm = swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});
