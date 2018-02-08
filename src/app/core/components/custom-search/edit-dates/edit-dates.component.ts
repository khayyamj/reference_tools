import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
	selector: 'app-missionary-custom-search-edit-dates',
	templateUrl: './edit-dates.component.html',
	styleUrls: ['./edit-dates.component.less']
})
export class CustomSearchEditDatesComponent implements OnInit {

	public criteria = {};
	private fullCriteria = {};
	private dateFields;
	public datesToModify;
	public message1 = 'The search you\'re about to run contains dates.';
	public message2 = 'Would you like to update them before running this search?';
	public title = 'edit dates for search';

	constructor(public dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private dialogData: any) { }

	ngOnInit() {
		this.fullCriteria = this.dialogData;

		const reg = new RegExp('[Start|End]$');
		const dateReg = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}');
		Object.keys(this.fullCriteria).forEach((item)=>{
			if(reg.test(item) && dateReg.test(this.fullCriteria[item])) {
				this.criteria[item] = this.fullCriteria[item];
			}
		});

		this.dateFields = [
			{label:'Date of Birth',modelStart:'birthdayStart',modelEnd:'birthdayEnd'},
			{label:'Scheduled Arrival',modelStart:'scheduledArrivalStart',modelEnd:'scheduledArrivalEnd'},
			{label:'Actual Arrival',modelStart:'actualArrivalStart',modelEnd:'actualArrivalEnd'},
			{label:'Scheduled Departure',modelStart:'scheduledDepartureStart',modelEnd:'scheduledDepartureEnd'},
			{label:'Actual Departure',modelStart:'actualDepartureStart',modelEnd:'actualDepartureEnd'},
			{label:'Mission Arrival Date',modelStart:'missionArrivalStart',modelEnd:'missionArrivalEnd'},
			{label:'Mission Release Date',modelStart:'missionReleaseStart',modelEnd:'missionReleaseEnd'}
		];
		this.datesToModify = this.dateFields.map((dateField) => {
			return Object.keys(this.criteria).some((prop) => {
				return prop === dateField.modelStart;
			}) ? dateField : null;
		}).filter((field) => {
			return field !== null;
		});
	}

	cancel() {
		this.dialogRef.close({});
	}

	run(form) {
		const changedFields = {};
		Object.keys(this.criteria).forEach((field) => {
			if(this.criteria[field] !== this.fullCriteria[field]) {
				changedFields[field] = this.criteria[field];
			}
		});
		this.dialogRef.close(changedFields);
	}
}
