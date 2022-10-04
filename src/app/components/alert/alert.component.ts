import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() typeAlert: string = 'alert-danger';
  @Input() text: string = '';

  constructor() { }

  ngOnInit(): void { }

}
