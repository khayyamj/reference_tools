import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManualItineraryService } from '../../services/';
import { SimpleConfirmationComponent } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { EditManualItineraryComponent } from './edit-manual-itinerary';
import { MTCToastService } from 'mtc-modules';

@Component({
	selector: 'travel-settings-manual-itinerary-list',
	templateUrl: './manual-itinerary-list.component.html',
	styleUrls: ['./manual-itinerary-list.component.less']
})
export class ManualItineraryListComponent implements OnInit {
	missions: Array<any>;
	manualItinerariesInfo: any;
	stations: Array<any>;
	travelMethods: Array<any>;
	numberOfVisibleMissions: number;

	constructor(private manualItineraryService: ManualItineraryService,
				private router: Router,
				private dialog: MatDialog,
				private toastService: MTCToastService) { }

	ngOnInit() {
		this.reset();
	}

	back() {
		this.router.navigate(['/travel/settings']);
	}

	showDeleteDialog(mission) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete this non-flight itinerary?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data:config,
			width:'400px',
		}).afterClosed().subscribe((data) => {
			if (data) {
				this.manualItineraryService.deleteManualItinerary(mission).subscribe((response: any) => {
					this.reset();
				});
				this.toastService.success(`itinerary <strong>successfully</strong> deleted`);
			}
		});
	}

	showItineraryDialog(mission, type) {
		const config: any = {
			mission: mission,
			type: type,
			missions: this.missions,
			stations: this.stations,
			travelMethods: this.travelMethods
		};
		this.dialog.open(EditManualItineraryComponent, {
			data:config,
			width:'900px',
		}).afterClosed().subscribe((data) => {
			if(data) {
				mission = data;
				this.manualItineraryService.addManualItinerary(mission).subscribe((response: any) => {
					this.reset();
				});
				this.toastService.success(`itinerary <strong>successfully</strong> saved`);
			}
		});
	}

	reset() {
		this.numberOfVisibleMissions = 0;
		this.manualItineraryService.getManualItinerariesInfo().subscribe((manualItinerariesInfo:any) => {
			this.manualItinerariesInfo = manualItinerariesInfo;
			this.missions = this.manualItinerariesInfo.manualItineraries;
			this.stations = this.manualItinerariesInfo.trainStations;
			this.travelMethods = this.manualItinerariesInfo.travelMethods;
			this.missions.forEach(function (m) {
				if (m.travelMethodDesc) {
					this.numberOfVisibleMissions++;
				}
			}, this);
		});
	}

	disableNewItineraryButton() {
		return this.missions && (this.numberOfVisibleMissions >= this.missions.length);
	}
}
