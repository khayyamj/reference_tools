import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MtcDatePipe } from 'mtc-modules';
import { FacilitiesManagementService } from '../../services/facilities-management';
import { CheckboxTableColumn } from 'mtc-modules/src/app/checkbox-table';

@Component({
	selector: 'app-room-history',
	templateUrl: './room-history.component.html',
	styleUrls: ['./room-history.component.less']
})
export class RoomHistoryComponent {

	public room;
	loaded = false;
	tablePlaceholder;

	columns: CheckboxTableColumn[] = [
		{ title: 'Field', 		attr:'changeType' },
		{ title: 'Start Date',	attr:'effectiveDateString'},
		{ title: 'End Date',	attr:'endDateString'},
		{ title: 'Value', 		attr:'previousValue'},
		{ title: 'User' ,		attr:'updatedBy'}
	];

	history;
	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
				private facilitiesManagementService: FacilitiesManagementService,
				private mtcDate:MtcDatePipe) {
		this.room = this.dialogData;
		this.tablePlaceholder = `No history for room ${this.room.room}`;
		this.facilitiesManagementService.getRoomHistory(this.room.roomId).subscribe((history: any) => {
			this.loaded = true;
			this.history = history;
			this.history.forEach(hist => {
				hist.effectiveDateString = this.mtcDate.transform(hist.effectiveDate);
				hist.endDateString = hist.endDate ? this.mtcDate.transform(hist.endDate):'';
			});
		});
	}

}
