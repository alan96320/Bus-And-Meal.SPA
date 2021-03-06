import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DormitoryBlock } from 'src/app/_models/dormitoryBlock';
import { DormitoryBlockService } from 'src/app/_services/dormitoryBlock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dormitoryBlokAreaForm',
  templateUrl: './dormitoryBlokAreaForm.component.html'
})
export class DormitoryBlokAreaFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update = false;
  DormitoryBlock: DormitoryBlock;
  id = +this.route.snapshot.params.id;

  constructor(
    private dormitoryBlockService: DormitoryBlockService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadDormitoryBlock();
  }

  loadDormitoryBlock() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.code = data.DormitoryBlock.code;
        this.model.name = data.DormitoryBlock.name;
        this.update = true;
      });
    }
  }

  submit() {
    if (!this.update) {
      this.addDormitoryBlock();
    } else {
      this.updateDormitoryBlock();
    }
  }

  addDormitoryBlock() {
    this.model.isUpdate = false;
    this.dormitoryBlockService.addDormitoryBlock(this.model).subscribe(
      () => {
        this.sweetAlert.successAdd('Added Successfully');
        this.router.navigate(['/dormitory']);
      },
      error => {
        this.sweetAlert.warning(error);
      }
    );
  }

  cancel() {
    this.cancelAdd.emit(false);
  }

  updateDormitoryBlock() {
    this.model.isUpdate = true;
    this.dormitoryBlockService.editDormitoryBlock(
      this.id,
      this.model
    ).subscribe(
      () => {
        this.sweetAlert.successAdd('Edit Successfully');
        this.router.navigate(['/dormitory']);
      },
      error => {
        this.sweetAlert.warning(error);
      }
    );
  }
}
