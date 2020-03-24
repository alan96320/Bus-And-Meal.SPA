import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-auditDetails',
  templateUrl: './auditDetails.component.html',
  styleUrls: ['./auditDetails.component.css']
})
export class AuditDetailsComponent implements OnInit {
  model: any = {};
  id = +this.route.snapshot.params.id;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.id) {
      this.route.data.subscribe(data => {
        this.model.tableName = data.audit.tableName;
        this.model.dateTime = data.audit.dateTime;
        this.model.keyValues = data.audit.keyValues;
        this.model.oldValues = data.audit.oldValues;
        this.model.newValues = data.audit.newValues;
      });
    }
  }

}
