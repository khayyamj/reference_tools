import { Component, OnInit } from '@angular/core';
import { EmailService } from '../../../shared/services';
import { MTCToastService, SimpleConfirmationComponent, CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { TempAssignmentsService } from '../../services';
import { NewTempAssignmentComponent } from './new-temp-assignment';
import * as _ from 'lodash';

@Component({
	selector: 'travel-temp-assignments',
	templateUrl: './temp-assignments.component.html',
	styleUrls: ['./temp-assignments.component.less']
})
export class TempAssignmentsComponent implements OnInit {

	pendingAssignments: Array<any> = [];
	assignedAssignments: Array<any> = [];
	allPendingSelected = false;
	allAssignedSelected = false;
	multipleAssignedSelected = false;
	multiplePendingSelected = false;
	numSelected: any;
	loading = true;

	columns: CheckboxTableColumn[] = [
		{ title: 'Name', attr: 'missionaryName', width: 25 },
		{ title: 'ID', attr: 'missionaryId' },
		{ title: 'Mission', attr: 'realMissionAbbr' },
		{ title: 'Dep. Date', attr: 'realDepartDate', mtcDate: true },
		{ title: 'Reason', attr: 'reason' },
		{ title: 'Temp Mission', attr: 'tempMissionAbbr' },
		{ title: 'Temp Start', attr: 'tempDepartDate', mtcDate: true },
	];
	pendingCheckboxTableConfig: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Assign', function: this.confirmAssign.bind(this) },
			{ text: 'Delete', function: this.delete.bind(this) }
		],
		rowButtons: [
			{ icon: 'speaker_notes', function: this.showNote.bind(this), iconColor: this.setIconColor.bind(this)}
		]
	};
	assignedCheckboxTableConfig: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Delete', function: this.delete.bind(this) }
		],
		rowButtons: [
			{ icon: 'speaker_notes', function: this.showNote.bind(this), iconColor: this.setIconColor.bind(this)}
		]
	};

	constructor(private tempAssignmentsService: TempAssignmentsService,
		private toastService: MTCToastService,
		private emailService: EmailService,
		private dialog: MatDialog) {
	}

	ngOnInit() {
		this.tempAssignmentsService.getAllTempAssignments().subscribe((tempAssignments: any) => {
			[...tempAssignments.pendingAssignments,...tempAssignments.assignedAssignments].forEach((assignment) => this.setIconColor(assignment));
			this.pendingAssignments = tempAssignments.pendingAssignments;
			this.assignedAssignments = tempAssignments.assignedAssignments;
			this.loading = false;

		});
	}

	setIconColor(assignment: any) {
		return assignment.notes ? '#000000' : '#e6e6e6';
	}

	openNewTempModal() {
		this.dialog.open(NewTempAssignmentComponent, {
			width: '1000px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				this.toastService.success(`Temp assignments <strong>successfully</strong> created`);
				if (data.assigned) {
					this.assign(data.tempAssignments, true);
				} else {
					data.tempAssignments.forEach((assignment) => this.setIconColor(assignment));
					this.pendingAssignments = this.pendingAssignments.concat(data.tempAssignments);
				}
			}
		});
	}

	showNote(row) {
		let content = 'There are no notes for this missionary';
		if (row.notes) {
			content = row.notes;
		}
		const config = {
			cancelButtonText: false,
			confirmationButtonText: 'ok',
			content: content
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '400px'
		});
	}

	confirmAssign(pendingAssignments) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'assign',
			content: 'Are you sure you want to assign the selected temp assignment(s)?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				this.assign(pendingAssignments, false);
			}
		});
	}

	assign(list, newTemp) {
		list.forEach((assignment, i) => {
			this.sendTempAssignEmail(assignment);
			this.tempAssignmentsService.setTempAssignmentEmail(assignment.missionaryId).subscribe(() => {
				this.setIconColor(assignment);
				if (!newTemp) {
					const j = this.pendingAssignments.findIndex((item) => {
						return item.missionaryId === assignment.missionaryId;
					});
					this.pendingAssignments.splice(j, 1);
				}
				this.assignedAssignments.push(assignment);
				assignment.selected = false;
				if (i === list.length - 1) {
					this.toastService.success('Pending temp assignments <strong>successfully</strong> added to assigned');
				}
			});

		});
	}

	sendTempAssignEmail(assignment) {
		const recipients = assignment.missionaryEmail;
		const title = assignment.missionaryGender === 'M' ? 'Elder' : 'Sister';
		const name = `${title} ${assignment.missionaryLastName}`;
		const body = `<p>Dear ${name},</p>
		<p>At this time, we have not received your visa to travel to your mission. You will be serving a temporary assignment in the ${assignment.tempMissionName} Mission until your visa arrives. An official notification from the Missionary Department will be sent to you by email in the near future.</p>
		<p>Please e-mail your family as soon as possible to give them all travel information.</p>`;
		const subject = `Temporary Mission Assignment`;
		this.emailService.sendEmail(recipients, body, subject);
	}

	filterList(listName, selectedList) {
		this[listName] = this[listName].filter((assignment) => {
			return !_.includes(selectedList, assignment);
		});
	}

	delete(assignmentsToDelete) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete the selected temp assignment(s)?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				this.filterList('pendingAssignments', assignmentsToDelete);
				this.filterList('assignedAssignments', assignmentsToDelete);
				assignmentsToDelete.forEach((assignment, i) => {
					this.tempAssignmentsService.deleteTempAssignment(assignment.missionaryId).subscribe((response) => {
						if (response) {
							const j = assignmentsToDelete.findIndex((item) => {
								return item.missionaryId === assignment.missionaryId;
							});
							assignmentsToDelete.splice(j, 1);
						}
						if (i === assignmentsToDelete.length - 1) {
							this.toastService.success('Temp assignments <strong>successfully</strong> deleted');
						}
					});
				});
			}
		});
	}

}
