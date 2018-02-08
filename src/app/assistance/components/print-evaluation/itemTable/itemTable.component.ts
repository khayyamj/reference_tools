import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-item-table',
	templateUrl: './itemTable.component.html',
	styleUrls: ['./itemTable.component.less']
})
export class ItemTableComponent implements OnInit {
	@Input() headerRow: any[];
	@Input() data: any[];
	@Input() title: string;

	constructor() { }
	ngOnInit() { }
}
