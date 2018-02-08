import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelPacketsService, TravelGroupService } from '../../services';

@Component({
	selector: 'travel-packet-view',
	templateUrl: './travel-packet-view.component.html',
	styleUrls: ['./travel-packet-view.component.less']
})
export class TravelPacketViewComponent implements OnInit {
	travelGroup: any;
	statuses: any;
	loading = false;
	masterRadio: boolean;
	prevRadioValues: Array<boolean>;
	itineraryModel: any;
	type = 'air';

	constructor(private travelGroupService: TravelGroupService,
				public travelPacketsService: TravelPacketsService,
				private route: ActivatedRoute,
				private router: Router) {
		this.masterRadio = null;
		this.prevRadioValues = [];
		this.prevRadioValues.push(null);
	}

	ngOnInit() {
		this.loading = true;
		this.route.params.subscribe((params) => {
			const travelGroupId = params['travelGroupId'];
			this.travelGroupService.getTravelGroupById(travelGroupId).subscribe((fullTravelGroupResponse: any) => {
				this.travelGroup = fullTravelGroupResponse;
				this.travelGroup.missionAbbreviation = params['missionAbbreviation'];
				if(this.travelGroup.travelers[0].currentFlightItinerary && this.travelGroup.travelers[0].currentFlightItinerary.length > 0) {
					this.itineraryModel = this.travelGroup.travelers[0].currentFlightItinerary;
					this.type = `air`;
				} else {
					this.itineraryModel = this.travelGroup.manualItinerary;
					this.type = `nonFlight-${this.itineraryModel.travelMethodDesc.toLowerCase()}`;
				}
				this.travelGroup.travelers.forEach((traveler) => {
					traveler.travelPacketStatus = {received: null};
				});
				this.getTravelPacketStatuses(travelGroupId);
				this.loading = false;
			});
		});
	}

	getTravelPacketStatuses(travelGroupId) {
		this.travelPacketsService.getTravelPacketStatusesForTravelGroup(travelGroupId).subscribe((travelPacketResponse: any) => {
			this.statuses = travelPacketResponse;
			this.travelGroup.travelers.forEach((traveler) => {
				this.statuses.forEach((status) => {
					if(status.missionaryId === traveler.missionaryId) {
						traveler.travelPacketStatus = status;
					}
				});
				this.prevRadioValues.push(traveler.travelPacketStatus.received || null);
			},this);
		});
	}

	back() {
		this.router.navigate(['../../../'], {relativeTo: this.route});
	}

	markEverythingReceived(received: boolean){
		this.prevRadioValues[0] = true;
		const newTravelPacketStatuses = this.travelGroup.travelers.map((traveler, index) => {
			this.prevRadioValues[index+1] = true;
			this.travelGroup.travelers[index].travelPacketStatus.received = received;
			if(!traveler.travelPacketStatus.missionaryId) {
				traveler.travelPacketStatus = {
					missionaryId: traveler.missionaryId,
					travelGroupId: traveler.travelGroupId,
					createdDate: new Date(),
					received: received
				};
				return traveler.travelPacketStatus;
			}else {
				traveler.travelPacketStatus.received = received;
				traveler.travelPacketStatus.createdDate = new Date();
				this.travelPacketsService.updateTravelPacketStatus(traveler.travelPacketStatus).subscribe();
				return false;
			}
		}).filter(status => status);
		if(newTravelPacketStatuses.length > 0) {
			this.travelPacketsService.createTravelPacketStatus(newTravelPacketStatuses).subscribe();
		}
	}

	markReceived (traveler, index, received: boolean) {
		this.prevRadioValues[index+1] = true;
		if(!traveler.travelPacketStatus.missionaryId) {
			traveler.travelPacketStatus = {
				missionaryId: traveler.missionaryId,
				travelGroupId: traveler.travelGroupId,
				createdDate: new Date(),
				received: received
			};
			this.travelPacketsService.createTravelPacketStatus([traveler.travelPacketStatus]).subscribe();
		}else {
			traveler.travelPacketStatus.received = received;
			traveler.travelPacketStatus.createdDate = new Date();
			this.travelPacketsService.updateTravelPacketStatus(traveler.travelPacketStatus).subscribe();
		}
	}

}
