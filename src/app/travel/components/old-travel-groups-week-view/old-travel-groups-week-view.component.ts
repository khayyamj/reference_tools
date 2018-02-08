import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfigService, TravelTypeFilterService } from './../../../shared';
import { TravelPacketsService, SASService } from '../../services';
import { OldPrintModalComponent } from '../old-print-modal';
import { SimpleConfirmationComponent, MtcDatePipe } from 'mtc-modules';
import * as moment from 'moment';

@Component({
	selector: 'travel-groups-week-view-old',
	templateUrl: './old-travel-groups-week-view.component.html',
	styleUrls: ['./old-travel-groups-week-view.component.less']
})
export class OldTravelGroupsWeekViewComponent implements OnInit {
	filter: any = {};
	showCalendar: boolean;
	showBackArrow: boolean;
	thisWeekSunday: any;
	currWeekSunday: any;
	followingWeekSunday: any;
	day = moment();
	travelPacketMissionInfos: any;
	week: Array<Array<any>>;
	title = '';

	constructor(public travelPacketsService: TravelPacketsService,
		private mtcDate: MtcDatePipe,
		public travelTypeFilterService: TravelTypeFilterService,
		private route: ActivatedRoute,
		private router: Router,
		private sasService: SASService,
		private dialog: MatDialog,
		private configService: ConfigService) {}

	ngOnInit() {
		this.route.params.subscribe((params) => {
			const pageType = params['travelColumnTable'];
			if (pageType === 'itineraries') {
				this.title = 'Itineraries';
			} else {
				this.title = 'Travel Packets';
			}
			this.showCalendar = false;
			this.showBackArrow = true;
			this.currWeekSunday = moment().clone().add(1, 'week').startOf('week').startOf('day');
			this.followingWeekSunday = moment().clone().add(2, 'week').startOf('week').startOf('day');
			this.thisWeekSunday = moment().clone().startOf('week').startOf('day');
			this.configService.loaded.subscribe(() => {
				if (this.configService.getConfig(this.title, 'selectedDateRange')) {
					const savedDate = moment(this.configService.getConfig(this.title, 'selectedDateRange').value, 'DD-MMM-YY');
					if (savedDate.isSameOrAfter(this.day)) {
						this.day = savedDate;
						this.currWeekSunday = moment(this.day).clone().startOf('week').startOf('day');
						this.followingWeekSunday = moment(this.day).clone().add(1, 'week').startOf('week').startOf('day');
					}
					if(savedDate.isSame(moment().clone().endOf('week').startOf('day'))){
						this.showBackArrow = false;
					}
				}
				this.refresh();
			});
		});
	}

	refresh() {
		this.travelPacketsService.loading = true;
		this.travelPacketMissionInfos = null;
		this.week = [[], [], [], [], [], [], []];
		//TODO We should just be returning a array of arrays here instead of formatting it on the frontend
		const startDate = this.mtcDate.transform(this.currWeekSunday);
		const endDate = this.mtcDate.transform(this.followingWeekSunday);
		this.travelPacketsService.getMissionsForDates(startDate, endDate).takeWhile(() => {
			return this.mtcDate.transform(this.currWeekSunday) === startDate;
		}).subscribe((travelPacketMissions:any) => {
			this.travelPacketMissionInfos = travelPacketMissions;
			this.travelPacketsService.loading = false;
			this.travelPacketMissionInfos.forEach((travelPacketMissionInfo) => {
				const day: number = moment(travelPacketMissionInfo.departureDate).clone().day();
				this.week[day].push(travelPacketMissionInfo);
			});
		});
	}

	print() {
		const config = {
			date: `${this.getViewDateSunday()} - ${this.getViewDateSaturday()}`,
		};
		this.dialog.open(OldPrintModalComponent, {
			data: config,
			width: '500px',
		}).afterClosed().subscribe((info) => {
			if (info) {
				const email = 0;
				const startDate = this.currWeekSunday.format('MM-DD-YYYY');
				const endDate = this.currWeekSunday.clone().endOf('week').format('MM-DD-YYYY');
				this.sasService.printBetweenDates(startDate, endDate, info.individual, info.office, email);
			}
		});
	}

	sendEmail() {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'send',
			content: 'Are you sure you want to resend travel itineraries to all missionaries? This action cannot be undone.'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				const email = 1;
				const individual = true;
				const office = false;
				const startDate = this.currWeekSunday.format('MM-DD-YYYY');
				const endDate = this.currWeekSunday.clone().endOf('week').format('MM-DD-YYYY');
				this.sasService.printBetweenDates(startDate, endDate, individual, office, email);
			}
		});
	}

	changeSelected(newDate) {
		this.currWeekSunday = moment(newDate).clone().startOf('week').startOf('day');
		this.followingWeekSunday = moment(newDate).clone().add(1, 'week').startOf('week').startOf('day');
		this.day = moment(newDate).clone().endOf('week').startOf('day');
		this.configService.setConfig(this.title, 'selectedDateRange', moment(this.day).format('DD-MMM-YY')).subscribe();
		if (this.currWeekSunday.valueOf() <= this.thisWeekSunday.valueOf()) {
			this.showBackArrow = false;
		} else {
			this.showBackArrow = true;
		}
		this.showCalendar = false;
		this.refresh();
	}

	getViewDateSunday() {
		return this.mtcDate.transform(this.currWeekSunday);
	}

	getViewDateSaturday() {
		return this.mtcDate.transform(this.currWeekSunday.clone().endOf('week'));
	}

	getMissionaryCountColor(item) {
		if (this.title === 'Itineraries') {
			return 'transparent';
		} else if (item.numReceived === item.numMissionariesInTravelGroup) {
			return '#51BC95'; //categorize-green
		} else if (item.numReceived === 0 && item.numNotReceived === 0) {
			return 'transparent';
		} else {
			return '#EF5458'; //categorize-red
		}
	}

	openTravelGroup(travelPacketInfo) {
		if(this.title === 'Itineraries') {
			this.router.navigate([`./itinerary/${travelPacketInfo.missionAbbreviation}/${travelPacketInfo.travelGroupId}`], {relativeTo: this.route});
		} else {
			this.router.navigate([`./packet/${travelPacketInfo.missionAbbreviation}/${travelPacketInfo.travelGroupId}`], {relativeTo: this.route});
		}
	}

	filterCells(item) {
		return this.travelTypeFilterService.checkFilter(this.filter, item);
	}
}
