import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-sub-header',
	templateUrl: './sub-header.component.html',
	styleUrls: ['./sub-header.component.less']
})
export class SubHeaderComponent {
	@Input() loading = false;
	@Input() title = 'NO TITLE GIVEN';
	@Output() back: EventEmitter<any> = new EventEmitter<any>();

	constructor(private _location: Location) { }

	backClick(){
		this._location.back();
	}
}
