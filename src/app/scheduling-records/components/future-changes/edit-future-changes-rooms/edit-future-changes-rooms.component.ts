import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FutureChangesService } from '../../../services';
import { ToolsInfoService } from '../../../../shared';
import * as moment from 'moment';

@Component({
	selector: 'app-edit-future-changes-rooms',
	templateUrl: './edit-future-changes-rooms.component.html',
	styleUrls: ['../edit-future-changes-main.less']
})
export class EditFutureChangesRoomsComponent implements OnInit {

	public date;
	rooms: any[];
	usage: any[];
	subusage: any[];
	schedules: any[];
	zones: any[];
	traininglanguages: any[];
	branches: any[];
	booleanList = ['Yes', 'No'].map((num) => ({ name: num }));
	editProps = ['branch', 'langauge', 'zone', 'schedule', 'overflowStatus', 'usage', 'subusages', 'availability'];
	edits: any;

	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
				public toolsInfoService: ToolsInfoService,
				private futureChangesService: FutureChangesService) { }

	ngOnInit() {
		this.getRoomFieldData();
		this.rooms = this.dialogData;
	}

	getRoomFieldData() {
		this.edits = {};
		this.editProps.forEach(prop => {
			this.edits[prop] = {};
		});
	}

	save(form) {
		if (form.valid) {
			if (!this.date) {
				this.date = new Date();
			}
			const futureChanges = [];
			this.rooms.forEach(room => {
				this.editProps.forEach(prop => {
					if (this.edits[prop].id) {
						const newChange = Object.assign({}, room);
						newChange.changeType = prop;
						newChange.futureValue = this.edits[prop].id;
						newChange.effectiveDate = moment(this.date).format('MM/DD/YYYY').toString();
						newChange.id = room.roomId;
						futureChanges.push(newChange);
					}
				});
			});
			this.futureChangesService.createRoomsFutureChanges(futureChanges).subscribe(() => {
				this.dialogRef.close();
			});
		}
	}
}
