import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public clicked = true;
  public clicked1 = false;
  public clicked2 = false;
  constructor() { }

  ngOnInit() {
  }

}
