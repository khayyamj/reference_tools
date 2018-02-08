import { Component, OnInit } from '@angular/core';
import { CheckboxTableColumn, CheckboxTableConfig, SimpleConfirmationComponent } from 'mtc-modules';
import { GeneralServicesService } from '../../services/';
import { MatDialog } from '@angular/material';
import { EditMailboxComponent } from './edit-mailbox';
import * as _ from 'lodash';

@Component({
	selector: 'app-mailbox-list',
	templateUrl: './mailbox-list.component.html',
	styleUrls: ['./mailbox-list.component.less']
})
export class MailboxListComponent implements OnInit {

	mailboxes = [];
	columns: CheckboxTableColumn[] = [
		{ title: 'Mailbox', attr: 'name' },
		{ title: 'Combination', attr: 'combination' },
	];

	config: CheckboxTableConfig = {
		rowButtons: [{ text: 'edit', function: this.edit.bind(this) }],
		topButtons: [{ text: 'delete', function: this.delete.bind(this)}]
	};
	loading = true;

	constructor(private generalServicesService: GeneralServicesService, private dialog: MatDialog) { }

	ngOnInit() {
		this.generalServicesService.getMailboxes().subscribe((mailboxes) => {
			this.loading = false;
			this.mailboxes = mailboxes;
		});
	}

	edit(mailbox = null){
		this.dialog.open(EditMailboxComponent, {
			height: '300px',
			width: '300px',
			data: mailbox
		}).afterClosed().subscribe((response) => {
			if (response === 'delete') {
				this.generalServicesService.deleteMailbox(mailbox);
				this.mailboxes.splice(this.mailboxes.indexOf(mailbox),1);
			}else if(response){
				this.generalServicesService.upsertMailbox(response);
				if(_.isNil(mailbox)){
					this.mailboxes.unshift(response);
				}else{
					mailbox.name = response.name;
					mailbox.combination = response.combination;
				}
			}
		});
	}

	delete(mailboxes){
		const content = mailboxes.length === 1 ? 'this mailbox?' : 'these mailboxes?';
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				title: 'Delete Mailboxes',
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: `Are you sure you want to delete ${content}`
			}
		}).afterClosed().subscribe((response) => {
			if (response) {
				this.generalServicesService.deleteMailboxes(mailboxes);
				this.mailboxes = this.mailboxes.filter((m1) => {
					return mailboxes.every((m2) => m1.id !== m2.id);
				});
			}
		});
	}

}
