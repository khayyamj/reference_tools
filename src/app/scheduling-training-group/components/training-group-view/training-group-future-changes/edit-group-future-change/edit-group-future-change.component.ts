import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FutureChangesService } from '../../../../../scheduling-records/services';
import { ToolsInfoService } from '../../../../../shared';
import * as moment from 'moment';

@Component({
	selector: 'app-edit-group-future-change',
	templateUrl: './edit-group-future-change.component.html',
	styleUrls: ['./edit-group-future-change.component.less']
})
export class EditGroupFutureChangeComponent implements OnInit {

	autoCompleteList;
	changeType;
	futureValue;
	changeValues;
	newDate;

	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private dialogData: any,
				private futureChangesService: FutureChangesService,
				public toolsInfoService: ToolsInfoService) { }

	ngOnInit() {
		this.changeValues = this.dialogData;
		this.changeType = this.changeValues.selectedChange.changeType;
		//TODO move this logic to backend
		switch (this.changeType){
			case 'Training Week':
				this.autoCompleteList = 'trainingWeeks';
				break;
			case 'Language':
				this.autoCompleteList = 'traininglanguages';
				break;
			case 'Schedule':
				this.autoCompleteList = 'schedules';
				break;
			case 'Classroom':
				this.autoCompleteList = 'classrooms';
		}


	}

	save(form) {
		if(form.valid) {
			const changes = [{	fullName: this.changeValues.trainingGroupName,
								effectiveDate: moment(this.newDate).format('MM/DD/YYYY'),
								changeType: this.changeType.toLowerCase(), mtcId: this.toolsInfoService.info.mtcId,
								futureValue: this.futureValue.name
							}];
			this.futureChangesService.createTrainingGroupsFutureChanges(changes);
			this.dialogRef.close(changes[0]);
		}
	}
}
