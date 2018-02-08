import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-itinerary',
	templateUrl: './itinerary.component.html',
	styleUrls: ['./itinerary.component.less'],
})
export class ItineraryComponent {
	@Input() model;
	@Input() type;

	constructor() { }

	getSlcDriverArrivalLocation() {
		if (this.model.travelType === 'Driver') {
			const locationArray = this.model.consulate.split(' ');
			return `${locationArray[0]} Consulate ${locationArray[1]}`;
		} else if (this.model.travelType === 'Train') {
			return 'Provo Central Station';
		}
	}

	getSlcFrontrunnerArrivalLocation() {
		if (this.model.consulate === 'Italy (SLC)') {
			return 'Salt Lake Central Station';
		} else if (this.model.consulate === 'Mexico (SLC)') {
			return 'Murray Central Station';
		}
	}

	getSlcTraxArrivalLocation() {
		if (this.model.consulate === 'Italy (SLC)') {
			return 'Gallivan Plaza';
		} else if (this.model.consulate === 'Mexico (SLC)') {
			return 'Ballpark Stop';
		}
	}
}
