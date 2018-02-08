import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RolesService } from '../../../../shared';

@Component({
	selector: 'travel-print-modal',
	templateUrl: './print-summary-modal.component.html',
	styleUrls: ['./print-summary-modal.component.less']
})
export class PrintSummaryModalComponent implements OnInit {
	printSummaryInfo = {
		reportType: 'one-page',
		includePublicNotes: false,
		includeConfindentialNotes: false,
		includeSchedule: false,
	};

	constructor(private dialogRef: MatDialogRef<any>,
				public rolesService: RolesService
	) { }

	ngOnInit() {
		if (this.rolesService.isMedicalUser) {
			this.printSummaryInfo.reportType = 'clinical';
		}
	}

	next() {
		this.dialogRef.close(this.printSummaryInfo);
	}
}
