import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';

@Component({
	selector: 'travel-edit-packet',
	templateUrl: './edit-packet.component.html',
	styleUrls: ['./edit-packet.component.less']
})
export class EditPacketComponent implements OnInit {
	reason:string;
	steps:string;
	travelerList: any;

	constructor(public dialogRef:MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
		this.reason = '';
		this.steps = '';
	}

	ngOnInit() {
		this.travelerList = _.cloneDeep(this.data);
	}

	save(form) {
		if(form.valid) {
			this.dialogRef.close(this.travelerList.map((traveler) => {
				return {
					travelPacketStatus:{
						missionaryId: traveler.missionaryId,
						travelGroupId: traveler.travelGroupId,
						missionaryName: traveler.fullName,
						reason: this.reason,
						steps: this.steps,
						received: false,
						createdDate: new Date()
					}
				};
			}));
		}
	}
}
