import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-column-table',
	templateUrl: './column-table.component.html',
	styleUrls: ['./column-table.component.less']
})

export class ColumnTableComponent {

	@Input() tableData: any[];
	@Input() hintDisplayName = 'numMissionariesInTravelGroup';
	@Input() displayName = 'missionAbbreviation';
	@Input() columns = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	@Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
	@Input() cellFunction(){}
	@Input() filterFunction(){}
	@Input() hintColorFunction(){}

	constructor() { }

}
