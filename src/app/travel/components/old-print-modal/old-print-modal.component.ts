import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MtcDatePipe } from 'mtc-modules';
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
	selector: 'travel-print-modal-old',
	templateUrl: './old-print-modal.component.html',
	styleUrls: ['./old-print-modal.component.less']
})
export class OldPrintModalComponent implements OnInit {
	individual = false;
	office = false;
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
			printOption: [false, [Validators.required, this.isprintOptionChecked.bind(this)]]
		});
	}

	isprintOptionChecked() {
		return this.individual || this.office ? null : { noneChecked: true };
	}

	print(form) {
		if (form.valid) {
			this.showError = false;
			this.dialogRef.close({ individual: this.individual, office: this.office });
		} else {
			this.showError = true;
		}
	}
}
