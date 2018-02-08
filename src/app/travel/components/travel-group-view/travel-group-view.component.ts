import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TravelGroupService, SASService, AppointmentsService } from '../../services';
import { PrintModalComponent } from '../print-modal';
import { CheckboxTableConfig, CheckboxTableColumn, SimpleConfirmationComponent, MTCToastService } from 'mtc-modules';
import * as moment from 'moment';

@Component({
	selector: 'travel-group-view',
	templateUrl: './travel-group-view.component.html',
	styleUrls: ['./travel-group-view.component.less']
})
export class TravelGroupViewComponent implements OnInit {

	sub;
	travelGroup;
	statuses: any;
	showDetailedDate = false;
	prevRadioValues: Array<boolean>;
	itineraryModel: any;
	type = 'air';
	weekDataSubscription: any;
	travelGroupSubscription: any;

	checkboxTableConfig: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Received', function: this.markReceived.bind(this, true) },
			{ text: 'Not Received', function: this.markReceived.bind(this, false) },
			{ text: 'Send', function: this.emailItineraries.bind(this) },
			{ text: 'Print', function: this.printIndividualItineraries.bind(this) },
		],
		resultsCountName: {
			singular: 'Missionary',
			plural: 'Missionaries'
		}
	};

	checkboxTableColumns: CheckboxTableColumn[] = [
		{ title: '', icon: 'account_circle', iconColor: this.setIconColor.bind(this), iconFunction: this.assignAsLeader.bind(this), width: 5},
		{ title: '', attr: 'tempAssignIcon', width: 5},
		{ title: 'Missionary', attr: 'fullName', width: 30 },
		{ title: 'ID', attr: 'missionaryId', width: 20 },
		{ title: 'Packet Received', attr: 'travelPacketReceivedDisplay', width: 20 }
	];

	constructor(public travelGroupService: TravelGroupService,
				private appointmentsService: AppointmentsService,
				private sasService: SASService,
				private toastService: MTCToastService,
				private dialog: MatDialog,
				private route: ActivatedRoute) {
					this.route.params.subscribe((params) => {
						const travelGroupId = params['travelGroupId'];
						this.travelGroupService.reloadGroups(true, travelGroupId);
					});
				}

	ngOnInit() {
		if (this.travelGroupSubscription) {
			this.travelGroupSubscription.unsubscribe();
		}
		this.travelGroupSubscription = this.travelGroupService._selectedTravelGroup.subscribe((travelGroupData) => {
			this.travelGroup = travelGroupData;
			if (this.travelGroup.travelers) {
				if (this.travelGroup.travelers[0].currentFlightItinerary && this.travelGroup.travelers[0].currentFlightItinerary.length > 0) {
					this.itineraryModel = this.travelGroup.travelers[0].currentFlightItinerary;
					this.type = 'air';
				} else {
					this.itineraryModel = this.travelGroup.manualItinerary;
					this.type = `nonFlight-${this.itineraryModel.travelMethodDesc.toLowerCase()}`;
				}
				this.mapColumnValues();
			}
		});
	}

	setShowDetailedDate() {
		const weekDay = this.travelGroup.flightDepartureDate ? this.travelGroup.flightDepartureDate : this.travelGroup.mtcDepartureDate;
		const departureDay = this.travelGroup.checkOutDate;
		this.showDetailedDate =  moment(weekDay).day() !== moment(departureDay).day();
	}

	mapColumnValues() {
		this.travelGroup.travelers.forEach((traveler) => {
			if (traveler.hasTempAssign) {
				traveler.tempAssignIcon = '<i class="icon-temp_mission temp-assign-icon"></i>';
			}
			if (traveler.travelPacketReceived !== undefined) {
				traveler.travelPacketReceivedDisplay = traveler.travelPacketReceived ? 'Yes' : 'No';
			}
		});
	}

	setIconColor(traveler, hover) {
		if (traveler.missionaryId === this.travelGroup.travelGroupLeaderId) {
			return '#EF5458'; //@red
		} else {
			return hover ? '#FFA4A6' : 'transparent'; //@light-red
		}
	}

	assignAsLeader(traveler) {
		const callback = (response: any) => {
			if (response) {
				this.travelGroup.travelGroupLeaderId = traveler.missionaryId;
				this.toastService.success('Travel Leader was <strong>successfully</strong> changed');
			}
		};
		if (this.type.includes('consulate')) {
			this.appointmentsService.setTravelGroupLeader(this.travelGroup.id, traveler.missionaryId).subscribe(callback);
		} else {
			this.travelGroupService.setTravelGroupLeader(this.travelGroup.travelGroupId, traveler.missionaryId).subscribe(callback);
		}
	}

	openPrintAndSendModal() {
		this.dialog.open(PrintModalComponent, {
			width: '350px'
		}).afterClosed().subscribe((printModalInfo) => {
			if (printModalInfo) {
				if (printModalInfo.email) {
					this.emailItineraries(this.travelGroup.travelers);
				}
				if (printModalInfo.printIndividual) {
					this.printIndividualItineraries(this.travelGroup.travelers);
				}
				if (printModalInfo.printGroup) {
					this.sasService.createGroupItinerary(this.travelGroup.travelGroupId, false, true, 0);
				}
			}
		});
	}

	printIndividualItineraries(selectedMissionaries) {
		selectedMissionaries.forEach((missionary) => {
			this.sasService.createIndividualItinerary(missionary.missionaryId, missionary.travelGroupId, 0);
		});
	}

	emailItineraries(selectedMissionaries) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'send',
			content: 'Are you sure you want to email individual itineraries? This action cannot be undone',
			title: 'Email Individual Itineraries'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				selectedMissionaries.forEach((missionary) => {
					this.sasService.createIndividualItinerary(missionary.missionaryId, missionary.travelGroupId, 1);
				});
				this.toastService.success(`Emailed itineraries to ${selectedMissionaries.length} missionaries <strong>successfully</strong>`);
			}
		});
	}

	markReceived(received: boolean, selectedMissionaries) {
		selectedMissionaries.forEach((missionary) => {
			if (!missionary.travelPacketStatus) {
				missionary.travelPacketStatus = {
					missionaryId: missionary.missionaryId,
					travelGroupId: missionary.travelGroupId,
					createdDate: new Date(),
					received: received
				};
				this.travelGroupService.createTravelPacketStatus([missionary.travelPacketStatus]).subscribe();
			} else {
				missionary.travelPacketStatus.received = received;
				missionary.travelPacketStatus.createdDate = new Date();
				this.travelGroupService.updateTravelPacketStatus(missionary.travelPacketStatus).subscribe();
			}
			missionary.travelPacketReceived = received;
			this.mapColumnValues();
		});
		this.travelGroupService.setNumReceived(this.travelGroup.travelGroupId);
		this.toastService.success(`Marked ${selectedMissionaries.length} missionaries as ${received ? 'packet received' : 'packet NOT received'} <strong>successfully</strong>`);
	}
}
