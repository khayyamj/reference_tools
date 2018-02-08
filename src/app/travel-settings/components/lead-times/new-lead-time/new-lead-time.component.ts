import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

@Component({
	selector: 'travel-settings-new-lead-time',
	templateUrl: './new-lead-time.component.html',
	styleUrls: ['./new-lead-time.component.less']
})
export class NewLeadTimeComponent implements OnInit {
	public time:any;
	public isNew = true;

	constructor(public dialogRef:MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private data:any) { }

	ngOnInit() {
		this.time = this.data || {
			scheduleType: 'regular',
			travelType: 'train',
			maxMissionaries: null,
			travelTime: '',
			flightTime: ''
		};
		this.isNew = this.time.maxMissionaries == null;
	}

	save(f){
		if(f.valid) {
			this.time.travelTime = moment(this.time.travelTime);
			this.time.flightTime = moment(this.time.flightTime);
			this.dialogRef.close(this.time);
		}
	}

}
