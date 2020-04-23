import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { Audit } from 'src/app/_models/audit';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { DepartmentService } from 'src/app/_services/department.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuditService } from 'src/app/_services/audit.service';
import swal from 'sweetalert2';
import { ConvertDateService } from 'src/app/_services/convertDate.service';
declare var $: any;

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  // deklarasi untuk pagination custom
  sortAscTableName: boolean;
  sortAscDateTime: boolean;
  filter = true;

  // deklarasi untuk get data
  audits: Audit[];
  pagination: Pagination;
  departmentParams: any = {};
  model: any = {};

constructor(
  private departmentService: DepartmentService,
  private alertify: AlertifyService,
  private route: ActivatedRoute,
  private sweetAlert: SweetAlertService,
  private auditService: AuditService,
  private convertDate: ConvertDateService
) { }

ngOnInit() {
  const newDate = $('#box1');
  newDate.datepicker({
      format: 'dd-mm-yyyy',
      autoHide: true
    });
  this.route.data.subscribe(data => {
    this.audits = data.audit.result;
    this.pagination = data.audit.pagination;
  });

  newDate.change(() => {
    this.departmentParams.time = this.convertDate.convertAB(newDate.datepicker('getDate', true));
    if ($('#box').val() !== '') {
      this.departmentParams.table = $('#box').val();
    }
    this.loadAudit();
  });
}

// karena paginationnya di rancang sendiri jadi, jadi kita harus buat function untuk paginationnya
// kita array kan dulu jumlah data yang kita dapatkan
arrayPage() {
  return Array(this.pagination.totalPages);
}

// kita buat fungsi untuk sorting by asc or desc
sortActive(getName) {
  if (getName === 'TableName') {
    this.sortAscTableName = !this.sortAscTableName;
    this.departmentParams.OrderBy = getName;
    this.departmentParams.isDesc = this.sortAscTableName;
    this.loadAudit();
  }
  if (getName === 'DateTime') {
    this.sortAscDateTime = !this.sortAscDateTime;
    this.departmentParams.OrderBy = getName;
    this.departmentParams.isDesc = this.sortAscDateTime;
    this.loadAudit();
  }
}

// kita buat fungsi untuk ketika tombol page di click
clickMe(pageMe) {
  this.pagination.currentPage = pageMe;
  this.loadAudit();
}

// kita buat fungsi untuk page selanjutnya, jika tombol next di tekan maka akan pindah ke page selanjutnya
nextPage() {
  if (this.pagination.currentPage !== this.pagination.totalPages) {
    this.pagination.currentPage = this.pagination.currentPage + 1;
    this.loadAudit();
  }
}

// kita buat fungsi untuk page sebelumnya, jika tombol prev di tekan maka akan pindah ke page sebelumnya
prevPage() {
  if (this.pagination.currentPage !== 1) {
    this.pagination.currentPage = this.pagination.currentPage - 1;
    this.loadAudit();
  }
}

// kita buat fungsi untuk end page / page terakhir, jika tombol endPage di tekan maka akan pindah ke page paling terakhir
endPage(Page) {
  if (this.pagination.currentPage !== Page) {
    this.pagination.currentPage = Page;
    this.loadAudit();
  }
}

// kita buat fungsi untuk start page / page pertama, jika tombol startPage di tekan maka akan pindah ke page paling pertama
startPage() {
  this.pagination.currentPage = 1;
  this.loadAudit();
}

// kita buat fungsi untuk select cange size per page
changeSize(size) {
  this.pagination.pageSize = size;
  this.pagination.currentPage = 1;
  this.loadAudit();
}

// kita buat fungsi untuk Order By
OrderBy(table, time) {
  if (table !== null || time !== null) {
    this.departmentParams.table = table;
    this.departmentParams.time = this.convertDate.convertAB(time);
    this.loadAudit();
  }
}

// lkita buat fungsi cancel Filter
cancelFilter(status) {
  if (status === 'Filter') {
    $('.filter').addClass('d-none');
    this.departmentParams.table = null;
    this.departmentParams.time = null;
    $('#box').val('');
    $('#box1').val('');
    this.loadAudit();
  } else {
    $('.filter').removeClass('d-none');
  }
}

// for delete data
deleteDepartment(id: number) {
  // tslint:disable-next-line: no-use-before-declare
  confirm
    .fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    })
    .then(result => {
      if (result.value) {
        this.departmentService.deleteDepartment(id).subscribe(
          () => {
            this.sweetAlert.warningDel();
            this.loadAudit();
          },
          error => {
            this.sweetAlert.warning(error);
          }
        );
      }
    });
}

// for laod data
  loadAudit() {
  // tslint:disable-next-line:max-line-length
    this.auditService.getAudits(this.pagination.currentPage, this.pagination.pageSize, this.departmentParams).subscribe((res: PaginatedResult<Audit[]>) => {
        this.audits = res.result;
        this.pagination = res.pagination;
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
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});
