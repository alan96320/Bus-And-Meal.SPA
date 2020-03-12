import { Component, OnInit } from '@angular/core';
import { DormitoryBlockService } from 'src/app/_services/dormitoryBlock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { DormitoryBlock } from 'src/app/_models/dormitoryBlock';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import swal from 'sweetalert2';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dormitoryBlokAreaList',
  templateUrl: './dormitoryBlokAreaList.component.html'
})
export class DormitoryBlokAreaListComponent implements OnInit {
  // deklarasi untuk pagination custom
  sortAscCode: boolean;
  sortAscName: boolean;
  filter = true;

  // deklarasi untuk get data
  DormitoryBlocks: DormitoryBlock[];
  pagination: Pagination;
  DormitoryBlockParams: any = {};
  model: any = {};

  constructor(
    private dormitoryBlockService: DormitoryBlockService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.DormitoryBlocks = data.DormitoryBlock.result;
      this.pagination = data.DormitoryBlock.pagination;
    });
  }

  arrayPage() {
    return Array(this.pagination.totalPages);
  }

  sortActive(getName) {
    if (getName === 'code') {
      this.sortAscCode = !this.sortAscCode;
      this.DormitoryBlockParams.OrderBy = getName;
      this.DormitoryBlockParams.isDesc = this.sortAscCode;
      this.loadDormitoryBlock();
    }
    if (getName === 'name') {
      this.sortAscName = !this.sortAscName;
      this.DormitoryBlockParams.OrderBy = getName;
      this.DormitoryBlockParams.isDesc = this.sortAscName;
      this.loadDormitoryBlock();
    }
  }

  clickMe(pageMe) {
    this.pagination.currentPage = pageMe;
    this.loadDormitoryBlock();
  }

  nextPage() {
    if (this.pagination.currentPage !== this.pagination.totalPages) {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.loadDormitoryBlock();
    }
  }

  prevPage() {
    if (this.pagination.currentPage !== 1) {
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.loadDormitoryBlock();
    }
  }

  endPage(Page) {
    if (this.pagination.currentPage !== Page) {
      this.pagination.currentPage = Page;
      this.loadDormitoryBlock();
    }
  }

  startPage() {
    this.pagination.currentPage = 1;
    this.loadDormitoryBlock();
  }

  changeSize(size) {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.loadDormitoryBlock();
  }

  OrderBy(code, name) {
    if (code !== null || name !== null) {
      this.DormitoryBlockParams.code = code;
      this.DormitoryBlockParams.name = name;
      this.loadDormitoryBlock();
    }
  }

  cancelFilter(status) {
    if (status === 'Filter') {
      this.DormitoryBlockParams.code = null;
      this.DormitoryBlockParams.name = null;
      this.loadDormitoryBlock();
    }
  }

  deleteDormitoryBlock(id: number) {
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
          this.dormitoryBlockService.deleteDormitoryBlock(id).subscribe(
            () => {
              this.sweetAlert.warningDel();
              this.loadDormitoryBlock();
            },
            error => {
              this.sweetAlert.warning(error);
            }
          );
        }
      });
  }

  loadDormitoryBlock() {
    this.dormitoryBlockService.getDormitoryBlocks(
      this.pagination.currentPage,
      this.pagination.pageSize,
      this.DormitoryBlockParams
    ).subscribe(
      (res: PaginatedResult<DormitoryBlock[]>) => {
        this.DormitoryBlocks = res.result;
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
