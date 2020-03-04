import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
