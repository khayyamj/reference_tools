import { Component, OnInit } from '@angular/core';
import { CheckboxTableColumn, CheckboxTableConfig, MtcTimePipe, MtcDatePipe } from 'mtc-modules';
import { RolesService } from '../../../shared';
import { MissionaryApiService, MissionaryService } from '../../services';
import * as _ from 'lodash';

@Component({
	selector: 'app-web-history',
	templateUrl: './web-history.component.html',
	styleUrls: ['./web-history.component.less']
})
export class WebHistoryComponent implements OnInit {

	browsingData: any[] = [];
	filteredRows = [];
	options: any[] = [{ name: 'Black',   value: 'N', selected: 'true' },
					{   name: 'Red',     value: 'R', selected: 'true' },
					{   name: 'Blue',    value: 'B', selected: 'true' },
					{   name: 'Blocked', value: 'X', selected: 'true' }];


	columns: CheckboxTableColumn[] = [
		{ title: 'Date',     attr: 'logDate',    width: 10, mtcDate: 'true' },
		{ title: 'Category', attr: 'openDnsTag', width: 5 },
		{ title: 'Type',     attr: 'type',       width: 10 },
		{ title: 'URL',      attr: 'url',        width: 60 }
	];
	checkboxTableConfig: CheckboxTableConfig = {
		placeholder: 'There is no information to display',
	};
	missionary;

	constructor(private missionaryApiService: MissionaryApiService,
				public missionaryService: MissionaryService,
				public mtcDatePipe: MtcDatePipe,
				public mtcTimePipe: MtcTimePipe,
				public rolesService: RolesService) { }

	ngOnInit() {
		this.missionaryService.selectedMissionary.subscribe((theMissionary) => {
			if (!_.isEmpty(theMissionary)) {
				this.missionary = theMissionary;
				this.missionaryApiService.getMissionaryBrowsingHistory(this.missionary.missionaryId).subscribe((browsingData: any[]) => {
					this.browsingData = browsingData;
					this.filteredRows = browsingData;
				});
			}
		});
	}
	changeFilter() {
		this.filteredRows = this.browsingData.filter((row) => this.options.some((option)=> option.selected && option.value === row.watchTagCode));
	}

}

