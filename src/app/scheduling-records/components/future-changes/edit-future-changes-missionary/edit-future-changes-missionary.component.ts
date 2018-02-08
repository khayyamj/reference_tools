import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MissionaryInfoService,FutureChangesService } from '../../../services';
import { ToolsInfoService } from '../../../../shared';

import * as moment from 'moment';

@Component({
	selector: 'app-edit-future-changes-missionary',
	templateUrl: './edit-future-changes-missionary.component.html',
	styleUrls: ['../edit-future-changes-main.less']
})
export class EditFutureChangesMissionaryComponent implements OnInit {

	public date;
	missionaries:any[];
	mailboxes:any[];
	residences:any[];
	classrooms:any[];
	schedules:any[];
	categories:any[];
	statuses:any[];
	substatuses:any[];
	branches:any[];
	districts = [];
	languages:any[];
	trainingWeeks;
	editProps = ['status','substatus','branch','district','trainingSchedule','trainingWeek','mailbox','residenceRoom','classroom','missionLanguage','trainingLanguage','subTrainingLanguage','specialCategory'];
	edits:any;

	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
				public toolsInfoService: ToolsInfoService,
				private missionaryInfoService: MissionaryInfoService,
				private futureChangesService: FutureChangesService) { }

	ngOnInit() {
		this.edits = {};
		this.editProps.forEach(prop => {
			this.edits[prop] = {};
		});
		this.missionaries = this.dialogData;
	}

	getDistricts() {
		if(this.edits.branch && this.edits.branch.name){
			this.missionaryInfoService.getDistricts(this.edits.branch.name).subscribe((districts:any[]) => this.districts = districts);
		}else{
			this.districts = [];
		}
	}

	save(form) {
		if(form.valid) {
			if (!this.date){
				this.date = new Date();
			}
			const futureChanges = [];
			this.missionaries.forEach(missionary => {
				this.editProps.forEach(prop => {
					if(this.edits[prop].id){
						const newChange = Object.assign({},missionary);
						newChange.changeType = prop;
						newChange.futureValue = this.edits[prop].id;
						newChange.effectiveDate = moment(this.date).format('l');
						futureChanges.push(newChange);
					}
				});
			});
			this.futureChangesService.createMissionariesFutureChanges(futureChanges).subscribe(() => {
				this.dialogRef.close();
			});
		}
	}
}
