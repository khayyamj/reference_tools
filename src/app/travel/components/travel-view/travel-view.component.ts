import { Component, OnInit, Input } from '@angular/core';
import { TravelGroupService } from '../../services';
import { SASService, AppointmentsService } from '../../services';
import { MatDialog } from '@angular/material';
import { OldPrintModalComponent } from '../old-print-modal';
import { SimpleConfirmationComponent, MTCToastService } from 'mtc-modules';
import { MissionaryService } from '../../../core-missionary';

@Component({
	selector: 'travel-view',
	templateUrl: './travel-view.component.html',
	styleUrls: ['./travel-view.component.less']
})
export class TravelViewComponent implements OnInit {
	@Input() travelGroup;
	@Input() sendOne;
	@Input() sendAll;
	@Input() printOne;
	@Input() printAll;

	public model;
	public type;

	constructor(private travelGroupService: TravelGroupService,
				private appointmentsService: AppointmentsService,
				private sasService: SASService,
				private dialog: MatDialog,
				public missionaryService: MissionaryService,
				private mtcToastService: MTCToastService) {}

	ngOnInit() {
		if (!this.travelGroup.travelers && this.travelGroup.missionaries) {
			this.travelGroup.travelers = this.travelGroup.missionaries;
		}
		if (this.travelGroup.consulate && this.travelGroup.consulate.includes('(')) {
			this.model = this.travelGroup;
			this.type = this.travelGroup.consulate.substr(-4, 3).toLowerCase();
			this.type = 'consulate-' + this.type;
		} else {
			if(this.travelGroup.travelers && this.travelGroup.travelers.length > 0){
				this.model = this.travelGroup.travelers[0].currentFlightItinerary;
			}
			if (this.model && this.model.length === 0) {
				setTimeout(() => { this.travelGroup.showLoading = true; });
				this.travelGroup.showLoading = false;
				if (this.travelGroup.manualItinerary) {
					this.travelGroup.manualItinerary = this.travelGroup.manualItinerary;
					this.model = this.travelGroup.manualItinerary;
					this.type = `nonFlight-${this.travelGroup.manualItinerary.travelMethodDesc.toLowerCase()}`;
				}

				//TODO this should all be calculated in the backend
				const mtcDeparture = new Date(this.travelGroup.mtcDepartureDate);

				this.model.trainDepartureDt = new Date(this.model.trainDepartureDt);
				this.model.trainDepartureDt.setDate(mtcDeparture.getDate());
				this.model.trainDepartureDt.setMonth(mtcDeparture.getMonth());
				this.model.trainDepartureDt.setYear(mtcDeparture.getFullYear());
				this.model.trainDepartureDt = this.model.trainDepartureDt.getTime();

				// This mtc departure date/time is from Departure Group.
				this.model.mtcDepartureDt = this.travelGroup.mtcDepartureDate;
			} else {
				this.type = 'air';
			}
		}
	}

	isTravelLeader(travelGroup, traveler) {
		return travelGroup.travelGroupLeaderId === traveler.missionaryId;
	}

	showTravelLeaderIcon(travelGroup, traveler) {
		return this.isTravelLeader(travelGroup, traveler) && !travelGroup.changeLeader;
	}

	printItinerary(traveler, travelGroup) {
		if (this.printOne) {
			this.printOne(traveler, travelGroup);
		} else {
			const sendEmails = 0;
			this.sasService.createIndividualItinerary(traveler.missionaryId, travelGroup.travelGroupId, sendEmails);
		}
	}

	printAllItinerary(travelGroup) {
		if (this.printAll) {
			this.printAll(travelGroup);
		} else {
			this.dialog.open(OldPrintModalComponent, {width:'500px'}).afterClosed().subscribe((info) => {
				if(info) {
					const sendEmails = 0;
					this.sasService.createGroupItinerary(travelGroup.travelGroupId, info.individual, info.office, sendEmails);
				}
			});
		}
	}

	reSendItinerary(traveler, travelGroup) {
		if(this.sendOne){
			this.sendOne(traveler, travelGroup);
		} else {
			const config = {
				cancelButtonText: 'cancel',
				confirmationButtonText: 'send',
				content: 'Are you sure you want to resend travel itinerary this missionary? This action cannot be undone.'
			};
			this.dialog.open(SimpleConfirmationComponent, {
				data: config,
				width: '400px'
			}).afterClosed().subscribe((data) => {
				if (data) {
					const email = 1;
					this.sasService.createIndividualItinerary(traveler.missionaryId, traveler.travelGroupId, email);
				}
			});
		}
	}

	reSendAllItinerary(travelGroup) {
		if(this.sendAll){
			this.sendAll(travelGroup);
		} else {
			const config = {
				cancelButtonText: 'cancel',
				confirmationButtonText: 'send',
				content: 'Are you sure you want to resend travel itineraries to the missionaries? This action cannot be undone.'
			};
			this.dialog.open(SimpleConfirmationComponent,{
					data: config,
					width:'400px'
				}).afterClosed().subscribe((data) => {
					if(data) {
						const email = 1;
						const individual = true;
						const office = false;
						this.sasService.createGroupItinerary(travelGroup.travelGroupId, individual, office, email);
					}
			});
		}
	}

	assignAsLeader(newTravelLeaderId, travelGroup) {
		const callback = (response:any) => {
			if(response){
				travelGroup.travelGroupLeaderId = newTravelLeaderId;
				this.mtcToastService.success('Travel Leader was <strong>successfully</strong> changed');
			}
			travelGroup.changeLeader = false;
		};
		if (this.type.includes('consulate')) {
			this.appointmentsService.setTravelGroupLeader(travelGroup.id, newTravelLeaderId).subscribe(callback);
		} else {
			this.travelGroupService.setTravelGroupLeader(travelGroup.travelGroupId, newTravelLeaderId).subscribe(callback);
		}
	}

	reduceTempAssignLogoPadding(travelGroup, traveler) {
		return this.isTravelLeader(travelGroup, traveler) || travelGroup.changeLeader;
	}

	setSelectedMissionary(missionaryId) {
		setTimeout(() => this.missionaryService.setSelectedMissionary(missionaryId));
	}
}
