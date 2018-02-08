import { Component, Input, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { MissionaryService } from '../../../core-missionary';

@Component({
	selector: 'travel-departure-group-item',
	templateUrl: './departure-group-item.component.html',
	styleUrls: ['./departure-group-item.component.less']

})

export class DepartureGroupItemComponent implements OnInit {

	@Input() group;
	@Input() departure;
	public isConsulatePickup: boolean;
	public isAppointment: boolean;
	public isFlight: boolean;

	constructor(private dragulaService: DragulaService,
				private missionaryService: MissionaryService){}

	ngOnInit() {
		this.isConsulatePickup = this.group.departureGroupItemTypeName === 'CONS' && this.group.departureGroupItemTripType === 'PICKUP';
		this.isAppointment = this.group.departureGroupItemType === 'CONSULATE_APPT' || this.group.departureGroupItemType === 'MANUAL_APPT_MED' || this.group.departureGroupItemType === 'MANUAL_APPT_OTHER';
		this.isFlight = this.group.departureGroupItemType === 'AIR_CONSULATE' || this.group.departureGroupItemType === 'AIR_MISSION';
	}

	toggleDetails(event,passenger){
		passenger.moreDetailsOpen = !passenger.moreDetailsOpen;
		event.stopPropagation();
	}

	getPicture(missionary){
		return this.missionaryService.getPicture(missionary);
	}

	isDragging() {
		return this.dragulaService.find('groups-bag').drake.dragging;
	}
}
