import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { SimpleConfirmationComponent } from 'mtc-modules/src/app/dialog/simple-confirmation';
import * as _ from 'lodash';

@Component({
	selector: 'app-edit-mailbox',
	templateUrl: './edit-mailbox.component.html',
	styleUrls: ['./edit-mailbox.component.less']
})
export class EditMailboxComponent implements OnInit {

	mailbox: any = {
		name:'',
		combination:''
	};
	isCreate = false;

	constructor(@Inject(MAT_DIALOG_DATA) private dialogData: any,
				private dialog: MatDialog,
				public dialogRef: MatDialogRef<any>) {
					this.isCreate = _.isNil(dialogData);
					if(!this.isCreate){
						this.mailbox = _.cloneDeep(dialogData);
					}
				}

	ngOnInit() {
	}

	save(form){
		if(form.valid){
			this.dialogRef.close(this.mailbox);
		}
	}

	confirmDelete(){
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				title: 'Delete Mailbox',
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: 'Are you sure you want to delete this mailbox?'
			}
		}).afterClosed().subscribe((response) => {
			if (response) {
				this.dialogRef.close('delete');
			}
		});
	}

}
