import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/_services/sweetAlert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mealOrderEntryForm',
  templateUrl: './mealOrderEntryForm.component.html',
  styleUrls: ['./mealOrderEntryForm.component.css']
})
export class MealOrderEntryFormComponent implements OnInit {
  @Output() cancelAdd = new EventEmitter();
  model: any = {};
  update: boolean = false;
  id = +this.route.snapshot.params['id'];
  listDepartments: any;
  mealType: any;

  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadDepartment();

    this.mealType = [
      { id: 1, name: "Breakfast" },
      { id: 2, name: "Lunch" },
      { id: 3, name: "Dinner" },
      { id: 4, name: "Sapper" },
      { id: 5, name: "Breakfast" },
      { id: 6, name: "Lunch" },
      { id: 7, name: "Dinner" },
      { id: 8, name: "Sapper" },
    ]

    console.log(this.mealType.length);
    
  }

  
  


  loadDepartment() {
    this.http.get('http://localhost:5000/api/department').subscribe(response => {
      this.listDepartments = response;
    }, error => {
      this.sweetAlert.error(error);
    });
  }

}
