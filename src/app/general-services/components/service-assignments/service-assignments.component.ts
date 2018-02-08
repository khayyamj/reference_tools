import { Component, OnInit } from '@angular/core';
import { GeneralServicesService } from '../../services/';
import { CheckboxTableColumn, CheckboxTableConfig, SimpleConfirmationComponent } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { EditServiceAssignmentComponent } from './edit-service-assignment';
import * as _ from 'lodash';

@Component({
	selector: 'app-service-assignments',
	templateUrl: './service-assignments.component.html',
	styleUrls: ['./service-assignments.component.less']
})
export class ServiceAssignmentsComponent implements OnInit {

	assignments: any[] = [];
	columns: CheckboxTableColumn[] = [
		{ title: 'Branch District', attr: 'branchDistrict' },
		{ title: 'Missionary Type', attr: 'missionaryType' },
		{ title: 'Assignment', attr: 'assignment' },
		{ title: 'Start Date', attr: 'startDate', mtcDate: true },
		{ title: 'End Date', attr: 'endDate', mtcDate: true },
	];

	config: CheckboxTableConfig = {
		rowButtons: [{ text: 'edit', function: this.edit.bind(this) }],
		topButtons: [{ text: 'delete', function: this.delete.bind(this) }]
	};
	loading = true;

	constructor(private generalServicesService: GeneralServicesService, private dialog: MatDialog) { }

	ngOnInit() {
		this.generalServicesService.getServiceAssignments().subscribe((assignments:any[]) => {
			this.assignments = assignments;
			this.loading = false;
		});
	}

	edit(assignment = null) {
		this.dialog.open(EditServiceAssignmentComponent, {
			data: assignment
		}).afterClosed().subscribe((response) => {
			if (response === 'delete') {
				this.generalServicesService.deleteAssignment(assignment);
				this.assignments.splice(this.assignments.indexOf(assignment), 1);
			} else if (response) {
				this.generalServicesService.upsertAssignment(response);
				if (_.isNil(assignment)) {
					this.assignments.unshift(response);
				} else {
					this.assignments.splice(this.assignments.indexOf(assignment), 1, response);
				}
			}
		});
	}

	delete(assignments) {
		const content = assignments.length === 1 ? 'this assignment?' : 'these assignments?';
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				title: 'Delete assignments',
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: `Are you sure you want to delete ${content}`
			}
		}).afterClosed().subscribe((response) => {
			if (response) {
				this.generalServicesService.deleteMailboxes(assignments);
				this.assignments = this.assignments.filter((m1) => {
					return assignments.every((m2) => m1.id !== m2.id);
				});
			}
		});
	}

}
