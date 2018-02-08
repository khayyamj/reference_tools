import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FutureChangesService } from '../../../services';
import { ToolsInfoService } from '../../../../shared';
import * as moment from 'moment';

@Component({
	selector: 'app-edit-future-changes-training-group',
	templateUrl: './edit-future-changes-training-group.component.html',
	styleUrls: ['../edit-future-changes-main.less']
})
export class EditFutureChangesTrainingGroupComponent implements OnInit {

	public date = new Date;
	today:Date = new Date();
	groups:any[];
	classrooms:any[];
	schedules:any[];
	editProps = ['schedule','trainingWeek','classroom'];
	edits:any;

	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
				public toolsInfoService: ToolsInfoService,
				private futureChangesService: FutureChangesService) { }

	ngOnInit() {
		this.getTrainingGroupFieldData();
		this.groups = this.dialogData;
	}

	getTrainingGroupFieldData(){
		this.edits = {};
		this.editProps.forEach(prop => {
			this.edits[prop] = {};
		});
	}

	save(form) {
		if(form.valid) {
			if (!this.date) {
				this.date = new Date();
			}
			const futureChanges = [];
			this.groups.forEach(group => {
				this.editProps.forEach(prop => {
					if(this.edits[prop].id){
						const newChange = Object.assign({},group);
						newChange.fullName = group.id;
						newChange.changeType = prop;
						newChange.futureValue = this.edits[prop].id;
						newChange.effectiveDate = moment(this.date).format('MM/DD/YYYY').toString();
						newChange.mtcId = this.toolsInfoService.info.mtcId;
						futureChanges.push(newChange);
					}
				});
			});
			this.futureChangesService.createTrainingGroupsFutureChanges(futureChanges).subscribe(() => {
				this.dialogRef.close();
			});
		}
	}

}
