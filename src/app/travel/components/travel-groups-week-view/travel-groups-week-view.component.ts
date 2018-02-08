import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TravelTypeFilterService } from './../../../shared';
import { TravelGroupService, SASService } from '../../services';
import { PrintModalComponent } from '../print-modal';
import { SimpleConfirmationComponent } from 'mtc-modules';

@Component({
	selector: 'travel-groups-week-view',
	templateUrl: './travel-groups-week-view.component.html',
	styleUrls: ['./travel-groups-week-view.component.less']
})
export class TravelGroupsWeekViewComponent implements OnInit, OnDestroy{
	filter: any = {};
	viewDate = '';
	week: Array<Array<any>>;
	sub: any;

	constructor(public travelGroupService: TravelGroupService,
				public travelTypeFilterService: TravelTypeFilterService,
				private route: ActivatedRoute,
				private router: Router,
				private sasService: SASService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.sub = this.travelGroupService._loadingTravelGroups.subscribe((travelGroupWeekMap) => {
			this.week = travelGroupWeekMap;
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	openPrintAndSendModal() {
		const config = {
			date: this.travelGroupService.viewDate
		};
		this.dialog.open(PrintModalComponent, {
			data: config,
			width: '350px',
		}).afterClosed().subscribe((printModalInfo) => {
			if (printModalInfo) {
				if (printModalInfo.email) {
					this.confirmEmail();
				}
				if (printModalInfo.printIndividual || printModalInfo.printGroup) {
					const email = 0;
					const startDate = this.travelGroupService.currWeekSunday.clone().format('MM-DD-YYYY');
					const endDate = this.travelGroupService.followingWeekSunday.clone().subtract(1, 'day').format('MM-DD-YYYY');
					this.sasService.printBetweenDates(startDate, endDate, printModalInfo.printIndividual, printModalInfo.printGroup, email);
				}
			}
		});
	}

	confirmEmail() {
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
				const email = 1;
				const individual = true;
				const office = false;
				const startDate = this.travelGroupService.currWeekSunday.clone().format('MM-DD-YYYY');
				const endDate = this.travelGroupService.currWeekSunday.clone().endOf('week').format('MM-DD-YYYY');
				this.sasService.printBetweenDates(startDate, endDate, individual, office, email);
			}
		});
	}

	changeSelected(newDate) {
		this.travelGroupService.setDates(newDate);
		this.travelGroupService.reloadGroups();
	}

	getMissionaryCountColor(item) {
		if (item.numReceived === item.numMissionariesInTravelGroup) {
			return '#51BC95'; //categorize-green
		} else if (item.numNotReceived) {
			return '#EF5458'; //categorize-red
		} else {
			return 'transparent';
		}
	}

	openTravelGroup(travelPacketInfo) {
		this.router.navigate([`../group-view/${travelPacketInfo.travelGroupId}`], { relativeTo: this.route });
	}

	filterCells(item) {
		return this.travelTypeFilterService.checkFilter(this.filter, item);
	}
}
