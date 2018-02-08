import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import * as moment from 'moment';

interface DnDSelection {
	isGetOn: boolean;
	isGetOff: boolean;
	dropEnabled: boolean;
}

@Component({
	selector: 'travel-settings-edit-manual-itinerary',
	templateUrl: './edit-manual-itinerary.component.html',
	styleUrls: ['./edit-manual-itinerary.component.less']
})
export class EditManualItineraryComponent implements OnInit {
	dialogData: any;
	manualItineraries: Array<any>;
	workingCopy: any;
	searchText: string;
	dragAndDrop: {
		selections: Array<DnDSelection>
		getOn: {
			station: any,
			index: number
		};
		getOff: {
			station: any,
			index: number
		};
	};
	weekdays: Array<any>;

	constructor(private dialogRef:MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private data:any) {
		this.searchText = '';
	}

	ngOnInit() {
		this.initDragAndDrop();
		this.weekdays = [
			{name: 'Sunday'},
			{name: 'Monday'},
			{name: 'Tuesday'},
			{name: 'Wednesday'},
			{name: 'Thursday'},
			{name: 'Friday'},
			{name: 'Saturday'}
		];
		this.dialogData = this.data;
		this.manualItineraries = this.dialogData.missions.map((mi) => {
			mi.displayName = mi.missionName + ' (' + mi.missionAbbreviation + ')';
			return mi;
		});
		this.workingCopy = Object.assign({}, this.dialogData.mission);
		this.initStations();
	}

	initStations() {
		this.dialogData.stations.forEach((station, index) => {
			const selection: DnDSelection = {
				isGetOn: false,
				isGetOff: false,
				dropEnabled: false
			};
			if (this.dialogData.type === 'Edit') {
				this.searchText = this.dialogData.mission.missionName;
				if (this.dialogData.mission.getOnTrainStationName === station.trainStationName) {
					selection.isGetOn = true;
					this.dragAndDrop.getOn.station = station;
					this.dragAndDrop.getOn.index = index;
				} else if (this.dialogData.mission.getOffTrainStationName === station.trainStationName) {
					selection.isGetOff = true;
					this.dragAndDrop.getOff.station = station;
					this.dragAndDrop.getOff.index = index;
				}
			}
			this.dragAndDrop.selections.push(selection);
		}, this);

		if (!this.dragAndDrop.getOff.station || !this.dragAndDrop.getOn.station) {
			this.dragAndDrop.selections[0].isGetOn = true;
			this.dragAndDrop.selections[this.dragAndDrop.selections.length - 1].isGetOff = true;
			this.dragAndDrop.getOn.station = this.dialogData.stations[0];
			this.dragAndDrop.getOff.station = this.dialogData.stations[this.dialogData.stations.length - 1];
			this.dragAndDrop.getOn.index = 0;
			this.dragAndDrop.getOff.index = this.dialogData.stations.length - 1;
		}
	}

	initDragAndDrop() {
		this.dragAndDrop = {
			selections: new Array<{isGetOn: boolean, isGetOff: boolean, dropEnabled: boolean}>(),
			getOn: {
				station: null,
				index: null
			},
			getOff: {
				station: null,
				index: null
			}
		};
	}

	save(form) {
		if(form.valid) {
			if (String(this.workingCopy.travelMethodId) === '1') { //Train
				this.workingCopy.getOnTrainStationName = this.dragAndDrop.getOn.station.trainStationName;
				this.workingCopy.getOnTrainStationId = this.dragAndDrop.getOn.station.trainStationId;
				this.workingCopy.getOnTrainStationAddr = this.dragAndDrop.getOn.station.trainStationAddr;
				this.workingCopy.getOffTrainStationAddr = this.dragAndDrop.getOff.station.trainStationAddr;
				this.workingCopy.getOffTrainStationName = this.dragAndDrop.getOff.station.trainStationName;
				this.workingCopy.getOffTrainStationId = this.dragAndDrop.getOff.station.trainStationId;
				this.workingCopy.trainDepartureDt = moment(this.workingCopy.trainDepartureDt).clone().toDate();
				this.workingCopy.trainArrivalDt = moment(this.workingCopy.trainArrivalDt).clone().toDate();
			} else { //Pickup
				this.workingCopy.getOnTrainStationName = '';
				this.workingCopy.getOnTrainStationId = '';
				this.workingCopy.getOnTrainStationAddr = '';
				this.workingCopy.getOffTrainStationAddr = '';
				this.workingCopy.getOffTrainStationName = '';
				this.workingCopy.getOffTrainStationId = '';
			}
			this.workingCopy.mtcCheckoutDt = moment(this.workingCopy.mtcCheckoutDt).clone().toDate();
			this.workingCopy.mtcDepartureDt = moment(this.workingCopy.mtcDepartureDt).clone().toDate();
			this.dialogRef.close(this.workingCopy);
		}
	}

	getTimeTitleType(){
		if(!this.onRadioCheck(this.dialogData.travelMethods[1].travelMethodId)){
			return 'MTC Departure';
		}else{
			return 'MTC Pickup';
		}
	}

	onMissionNameChosen($event) {
		const mission = $event;
		this.searchText = mission.missionName;
		this.workingCopy = mission;
		this.workingCopy.travelMethodId = this.dialogData.travelMethods[0].travelMethodId;
	}

	onDragEnd(selection, newIndex) {
		if (selection.isGetOff) {
			this.dragAndDrop.getOff.station = this.dialogData.stations[newIndex];
			this.dragAndDrop.getOff.index = newIndex;
		} else if (selection.isGetOn) {
			this.dragAndDrop.getOn.station = this.dialogData.stations[newIndex];
			this.dragAndDrop.getOn.index = newIndex;
		}
		this.dragAndDrop.selections.forEach(s => s.dropEnabled = false);
	}

	onDragStart(index) {
		if (index === this.dragAndDrop.getOn.index) {
			for (let i = 0; i < this.dragAndDrop.selections.length; i++) {
				this.dragAndDrop.selections[i].dropEnabled = i < this.dragAndDrop.getOff.index;
			}
		} else if (index === this.dragAndDrop.getOff.index) {
			for (let i = 0; i < this.dragAndDrop.selections.length; i++) {
				this.dragAndDrop.selections[i].dropEnabled = i > this.dragAndDrop.getOn.index;
			}
		}
	}

	onRadioCheck(id: string) {
		return String(this.workingCopy.travelMethodId) === String(id);
	}
}
