import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-notification-badge',
	templateUrl: './notification-badge.component.html',
	styleUrls: ['./notification-badge.component.less']
})
export class NotificationBadgeComponent implements OnInit {
	@Input() total:number = null;
	@Input() new:number = null;

	constructor() { }

	ngOnInit() {}

	isGreaterThanZero(num){
		return num > 0;
	}

	isNull(item){
		return item === null;
	}

}
