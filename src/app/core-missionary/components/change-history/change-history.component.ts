import { Component, OnInit } from '@angular/core';
import { MissionaryService } from '../../services';
import { MatDialog } from '@angular/material';
import { CreateChangeComponent } from './create-change';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';


@Component({
	selector: 'app-missionary-change-history',
	templateUrl: './change-history.component.html',
	styleUrls: ['./change-history.component.less']
})
export class ChangeHistoryComponent implements OnInit {

	missionary:any;
	tabs = ['MTC','Mission','Personal','Ecclesiastical'];
	tabIndex = 0;
	viewType = 'mtc';
	columns: CheckboxTableColumn[] =[
		{ title: 'Field', attr: 'field' },
		{ title: 'Value', attr: 'value' },
		{ title: 'Start Date', attr: 'startDate', mtcDate: true },
		{ title: 'End Date', attr: 'endDate', mtcDate: true },
		{ title: 'User', attr: 'username' }
	];
	checkboxTablePlaceholder = `There are no ${this.viewType} changes for this missionary`;

	constructor(private missionaryService: MissionaryService,
				private dialog: MatDialog) {}

	ngOnInit() {
		this.missionaryService.selectedMissionary.subscribe((miss) => {
			this.missionary = miss;
		});
	}

	createChange() {
		const change = {
			missionaryId:this.missionary.missionaryId
		};
		const ref = this.dialog.open(CreateChangeComponent, {
			data: change,
			width: '750px'
		}).afterClosed().subscribe((newChange) => {
			if(newChange){
				this.missionary.changeHistory.mtc.push({
					field:'Change',
					value:newChange.actionName,
					startDate:newChange.effectiveDt,
					username:newChange.createdByName
				});
			}
		});
	}

	setSelectedTab(newTab){
		this.viewType = newTab;
		this.checkboxTablePlaceholder = `There are no ${this.viewType} changes for this missionary`;
	}
}
