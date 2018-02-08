import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MtcDatePipe } from 'mtc-modules';
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
	selector: 'travel-print-modal',
	templateUrl: './print-modal.component.html',
	styleUrls: ['./print-modal.component.less']
})
export class PrintModalComponent implements OnInit {
	printIndividual = false;
	printGroup = false;
	email = false;
	showError = false;
	date: any;
	individualPrintDate: number;
	groupPrintDate: number;
	form: FormGroup;

	constructor(private dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) private data: any,
		private mtcDate: MtcDatePipe,
		private builder: FormBuilder) { }

	ngOnInit() {
		const info = this.data;
		if (info) {
			if (typeof info.date !== 'string') {
				this.date = this.mtcDate.transform(moment(info.date));
			} else {
				this.date = info.date;
			}
		}
		this.form = this.builder.group({
			option: [false, [Validators.required, this.isprintOptionChecked.bind(this)]]
		});
	}

	isprintOptionChecked() {
		return this.printIndividual || this.printGroup || this.email? null : { noneChecked: true };
	}

	next(form) {
		if (form.valid) {
			this.showError = false;
			this.dialogRef.close({
				printIndividual: this.printIndividual,
				printGroup: this.printGroup,
				email: this.email
			});
		} else {
			this.showError = true;
		}
	}
}
