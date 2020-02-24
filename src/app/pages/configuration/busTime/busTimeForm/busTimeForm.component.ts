import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BusTime } from 'src/app/_models/BusTime';
import { BusTimeService } from 'src/app/_services/BusTime.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
   selector: 'app-busTimeForm',
   templateUrl: './busTimeForm.component.html',
})
export class BusTimeFormComponent implements OnInit {
   @Output() cancelAdd = new EventEmitter();
   model: any = {};
   update: boolean = false;
   BusTime: BusTime;
   id = +this.route.snapshot.params['id'];
   listDirection: any;
   

   constructor(
      private BusTimeService: BusTimeService,
      private alertify: AlertifyService,
      private router: Router,
      private route: ActivatedRoute,
      private sweetAlert: SweetAlertService
   ) { }

   ngOnInit() {
      this.loadBusTime();
      this.listDirection = [
         { id: 1, name: 'Domitory -> Office' },
         { id: 2, name: 'Office -> Domitory' },
         { id: 3, name: 'Office -> Domitory(Night)' }
      ]
   }
   loadBusTime() {
      if (this.id) {
         this.route.data.subscribe(data => {
            this.model.code = data['BusTime'].code;
            this.model.time = data['BusTime'].time;
            this.model.directionEnum = data['BusTime'].directionEnum;
            this.model.times = { hour: 13, minute: 30 };
            this.update = true;
         });
      }
   }

   submit() {
      if (!this.update) {
         this.addBusTime();
      } else {
         this.updateBusTime();
      }
   }

   addBusTime() {
      console.log(this.model);
      this.BusTimeService.addBusTime(this.model).subscribe(() => {
         this.sweetAlert.successAdd('Added Successfully');
         this.router.navigate(['/busTime']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

   cancel() {
      this.cancelAdd.emit(false);
   }

   updateBusTime() {
      console.log(this.model);
      this.BusTimeService.editBusTime(this.id, this.model).subscribe(() => {
         this.sweetAlert.successAdd('Edit Successfully');
         this.router.navigate(['/busTime']);
      }, error => {
         this.sweetAlert.warning(error);
      });
   }

   darkTheme: NgxMaterialTimepickerTheme = {
      container: {
         bodyBackgroundColor: '#424242',
         buttonColor: '#fff'
      },
      dial: {
         dialBackgroundColor: '#555',
      },
      clockFace: {
         clockFaceBackgroundColor: '#555',
         clockHandColor: '#9fbd90',
         clockFaceTimeInactiveColor: '#fff'
      }
   };
}
