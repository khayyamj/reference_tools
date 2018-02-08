import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { SimpleConfirmationComponent } from 'mtc-modules';

@Component({
	selector: 'app-edit-service-assignment',
	templateUrl: './edit-service-assignment.component.html',
	styleUrls: ['./edit-service-assignment.component.less']
})
export class EditServiceAssignmentComponent implements OnInit {

	assignment: any = {
		name: '',
		combination: ''
	};
	isCreate = false;

	constructor(@Inject(MAT_DIALOG_DATA) private dialogData: any,
				private dialog: MatDialog,
				public dialogRef: MatDialogRef<any>) {
		this.isCreate = _.isNil(dialogData);
		if (!this.isCreate) {
			this.assignment = _.cloneDeep(dialogData);
		}
	}

	ngOnInit() {
	}

	save(form) {
		if (form.valid) {
			this.dialogRef.close(this.assignment);
		}
	}

	confirmDelete() {
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				title: 'Delete assignments',
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: 'Are you sure you want to delete this assignment?'
			}
		}).afterClosed().subscribe((response) => {
			if (response) {
				this.dialogRef.close('delete');
			}
		});
	}

}
