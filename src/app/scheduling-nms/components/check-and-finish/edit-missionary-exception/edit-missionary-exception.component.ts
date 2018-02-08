import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsInfoService } from '../../../../shared';
import * as _ from 'lodash';


@Component({
	selector: 'app-edit-missionary-exception',
	templateUrl: './edit-missionary-exception.component.html',
	styleUrls: ['./edit-missionary-exception.component.less']
})
export class EditMissionayExceptionComponent implements OnInit {

	exceptionMissionary;
	config;
	showConfirmation;
	missionaryAttributes = ['mailbox', 'branchDistrict', 'classroom', 'residence'];

	constructor(public dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private dialogData: any,
				public toolsInfoService: ToolsInfoService) { }

	ngOnInit() {
		this.exceptionMissionary = _.cloneDeep(this.dialogData);

		//formatting to work with auto-complete
		this.missionaryAttributes.forEach((attr: string) => {
			this.exceptionMissionary[attr] = {
				name: this.exceptionMissionary[attr],
				id: this.exceptionMissionary[attr + 'Id']
			};
		});
	}

	save() {
		this.config = {
			cancelButtonText: 'no',
			confirmationButtonText: 'yes',
			content: 'Are you sure want to save these changes?'
		};
		this.showConfirmation = true;
	}

	confirmation(answer) {
		if (answer) {
			//formatting for save and displaying
			this.missionaryAttributes.forEach((attr: string) => {
				if (this.exceptionMissionary[attr]) {
					this.exceptionMissionary[attr + 'Id'] = this.exceptionMissionary[attr].id;
					this.exceptionMissionary[attr] = this.exceptionMissionary[attr].name;
				}
				this.exceptionMissionary.ecclGroupId = this.exceptionMissionary.branchDistrictId;
			});
			this.dialogRef.close(this.exceptionMissionary);
		}
		this.showConfirmation = false;
	}

}
