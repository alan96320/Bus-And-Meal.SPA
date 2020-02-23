import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DormitoryBlock } from 'src/app/_models/DormitoryBlock';
import { DormitoryBlockService } from 'src/app/_services/DormitoryBlock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';

@Component({
   selector: 'app-dormitoryBlokAreaForm',
   templateUrl: './dormitoryBlokAreaForm.component.html',
})
export class DormitoryBlokAreaFormComponent implements OnInit {
   @Output() cancelAdd = new EventEmitter();
   model: any = {};
   update: boolean = false;
   DormitoryBlock: DormitoryBlock;
   id = +this.route.snapshot.params['id'];

   constructor(
      private DormitoryBlockService: DormitoryBlockService,
      private alertify: AlertifyService,
      private router: Router,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService
   ) { }

   ngOnInit() {
      this.loadDormitoryBlock();
   }

   loadDormitoryBlock() {
      if (this.id) {
         this.route.data.subscribe(data => {
            this.model.code = data['DormitoryBlock'].code;
            this.model.name = data['DormitoryBlock'].name;
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
      console.log(this.model);
      this.DormitoryBlockService.addDormitoryBlock(this.model).subscribe(() => {
         this.sweetAlert.successAdd('Added Successfully');
         this.router.navigate(['/dormitory']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

   cancel() {
      this.cancelAdd.emit(false);
   }

   updateDormitoryBlock() {
      console.log(this.model);
      this.DormitoryBlockService.editDormitoryBlock(this.id, this.model).subscribe(() => {
         this.sweetAlert.successAdd('Edit Successfully');
         this.router.navigate(['/dormitory']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

}
