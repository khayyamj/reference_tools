import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MtcDatePipe } from 'mtc-modules';
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as _ from 'lodash';

@Component({
	selector: 'app-edit-classroom-size',
	templateUrl: './edit-classroom-size.component.html',
	styleUrls: ['./edit-classroom-size.component.less']
})
export class EditClassroomSizeComponent implements OnInit {

	classrooms = [];
	dialogType;
	config;
	showConfirmation;
	min;
	max;
	groupDates = [];
	selectedDates = [];
	form: FormGroup;
	showError = false;

	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
		private mtcDatePipe: MtcDatePipe, private builder: FormBuilder) { }

	ngOnInit() {
		this.classrooms = this.dialogData;
		this.classrooms[0].sizes.forEach((item) => {
			this.groupDates.push({ name: this.mtcDatePipe.transform(item.groupDate) });
		});
		this.selectedDates = this.groupDates;
		this.form = this.builder.group({
			minSize: [false, [Validators.required, this.isNumbersValid.bind(this)]],
			maxSize: [false, [Validators.required, this.isNumbersValid.bind(this)]]
		});
	}

	cancel() {
		this.dialogType = 'cancel';
		this.config = {
			cancelButtonText: 'No',
			confirmationButtonText: 'Yes',
			content: 'Are you sure you want to cancel changes?'
		};
		this.showConfirmation = true;
	}

	save(form) {
		if (form.valid) {
			this.dialogType = 'save';
			this.config = {
				cancelButtonText: 'no',
				confirmationButtonText: 'yes',
				content: 'Are you sure want to save changes?'
			};
			this.showConfirmation = true;
		}
	}

	confirmation(answer) {
		if (answer) {
			if (this.dialogType === 'cancel') {
				this.dialogRef.close();
			} else if (this.dialogType === 'save') {
				this.classrooms.forEach((classroom) => {
					classroom.sizes.map((size) => {
						if (this.selectedDates.some((date) => moment(size.groupDate).isSame(moment(date.name), 'day'))) {
							size.min = this.min.toString();
							size.max = this.max.toString();
						}
					});
				});
				this.dialogRef.close(this.classrooms);
			}
		}
		this.showConfirmation = false;
	}

	isNumbersValid() {
		if(_.isNumber(this.min) && _.isNumber(this.max)){
			if(this.form){
				const error = (this.min <= this.max) ? null : { notValid: true };
				this.form.controls.minSize.setErrors(error);
				this.form.controls.maxSize.setErrors(error);
			}
			return (this.min <= this.max) ? null : { notValid: true };
		} else {
			return null;
		}
	}

}
