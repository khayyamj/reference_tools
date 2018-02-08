import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToolsInfoService } from '../../../../shared/services';
import { TempAssignmentsService } from '../../../services';

@Component({
	selector: 'app-new-temp-assignment',
	templateUrl: './new-temp-assignment.component.html',
	styleUrls: ['./new-temp-assignment.component.less']
})
export class NewTempAssignmentComponent implements OnInit {
	missionariesLoading = false;
	missionaries: any = [];
	newTempAssignment = {
		missionId: '',
		reason: 'VISA',
		notes: '',
		departureDate: null,
	};
	missionChosen: any = [];
	missions: Array<any>;
	assigned = false;
	editTemp = true;
	newTempAssignments: any = [];
	newTemp: NgForm;
	@ViewChild('newTemp') currentForm:NgForm;

	constructor(private tempAssignmentsService: TempAssignmentsService,
				public toolsInfoService: ToolsInfoService,
				public dialogRef:MatDialogRef<any>) {
	}

	ngOnInit() { }

	save(form) {
		if(form.valid) {
			form.value.missionaries.forEach((missionary) => {
				const temp = {
					missionaryId: missionary.missionaryId,
					tempUnitId: form.value.mission.id,
					reason: form.value.reason,
					notes: form.value.notes,
					tempDepartDate: form.value.departDate
				};
				this.newTempAssignments.push(temp);
			});
			this.tempAssignmentsService.setTempAssignments(this.newTempAssignments).subscribe((tempAssignments:any) => {
				this.dialogRef.close({ tempAssignments: tempAssignments, assigned: this.assigned });
			});
		}
	}
}
