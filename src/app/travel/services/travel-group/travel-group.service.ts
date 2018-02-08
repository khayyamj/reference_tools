import { Injectable } from '@angular/core';
import { HostnameService, ConfigService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MtcDatePipe } from 'mtc-modules';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class TravelGroupService {

	public loadingWeekData: boolean;
	public loadingTravelGroup: boolean;
	public showBackArrow = true;
	public _selectedTravelGroup: BehaviorSubject<any> = new BehaviorSubject({});
	public _loadingTravelGroups: BehaviorSubject<any> = new BehaviorSubject([[], [], [], [], [], [], []]);
	public flatTravelGroups;
	public selectedTGIndex = 0;
	public followingWeekSunday = moment().startOf('day').startOf('week').add(1, 'week');
	public currWeekSunday = moment().startOf('day').startOf('week');
	public viewDate = this.mtcDate.transform(this.currWeekSunday.clone().startOf('week'), this.followingWeekSunday.clone().endOf('week'));
	private travelGroups: any;
	private day = moment();

	constructor(private hostName: HostnameService,
				private http: HttpClient,
				private mtcDate: MtcDatePipe,
				private configService: ConfigService,
				private router: Router) {
				this.configService.loaded.subscribe(() => {
					if (this.configService.getConfig('Itineraries', 'selectedDateRange')) {
						const savedDate = moment(this.configService.getConfig('Itineraries', 'selectedDateRange').value, 'DD-MMM-YY');
						if (savedDate.isSameOrAfter(this.day)) {
							this.setDates(savedDate);
						}
					}
					this.reloadGroups();
				});
	}

	setDates(date) {
		this.day = moment(date);
		this.currWeekSunday = moment(this.day).startOf('week').startOf('day');
		this.followingWeekSunday = moment(this.day).add(1, 'week').startOf('week').startOf('day');
		this.viewDate = this.mtcDate.transform(this.day.clone().startOf('week'), this.day.clone().endOf('week'));
		const configDate = moment(this.day).clone().endOf('week').startOf('day').format('DD-MMM-YYY');
		this.configService.setConfig('Itineraries', 'selectedDateRange', configDate).subscribe();
	}

	reloadGroups(reloadGroup?: boolean, travelGroupId?) {
		if (this.flatTravelGroups && this.flatTravelGroups.findIndex(tg => tg.travelGroupId === travelGroupId) !== -1) {
			this.setSelectedTravelGroup(travelGroupId);
		} else {
			this.loadWeekData(reloadGroup, travelGroupId);
		}
	}

	loadWeekData(reloadGroup?: boolean, travelGroupId?) {
		this.loadingWeekData = true;
		this._selectedTravelGroup.next({});
		const startDate = this.mtcDate.transform(this.currWeekSunday);
		const endDate = this.mtcDate.transform(this.followingWeekSunday);
		this.getTravelGroupsForDates(startDate, endDate).subscribe((travelGroups: any) => {
			this.flatTravelGroups = _.flatten(travelGroups);
			this.travelGroups = travelGroups;
			if (reloadGroup) {
				if (travelGroupId) {
					this.selectedTGIndex = this.flatTravelGroups.findIndex(tg => tg.travelGroupId === travelGroupId);
					if (this.selectedTGIndex < 0) {
						this.getTravelGroupById(travelGroupId).subscribe((travelGroup: any) => {
							const departureDate = travelGroup.flightDepartureDate ? travelGroup.flightDepartureDate : travelGroup.mtcDepartureDate;
							this.setDates(departureDate);
							this.reloadGroups(true, travelGroupId);
						});
					} else {
						this.setSelectedTravelGroup(travelGroupId);
					}
				} else {
					this.selectedTGIndex = this.selectedTGIndex === 0 ? this.flatTravelGroups.length - 1 : 0;
					this.routeToSelectedTravelGroup();
				}
			}
			this._loadingTravelGroups.next(travelGroups);
			this.loadingWeekData = false;
		});
	}

	setSelectedTravelGroup(travelGroupId) {
		this.loadingTravelGroup = true;
		if (this.flatTravelGroups) {
			this.selectedTGIndex = this.flatTravelGroups.findIndex(tg => tg.travelGroupId === travelGroupId);
			if (this.flatTravelGroups[this.selectedTGIndex]) {
				this.showBackArrow = this.selectedTGIndex !== 0 || !(this.currWeekSunday.isSame(moment().startOf('week').startOf('day')));
				this._selectedTravelGroup.next(this.flatTravelGroups[this.selectedTGIndex]);
				if (!this.flatTravelGroups[this.selectedTGIndex].travelers) {
					this.getTravelGroupById(travelGroupId).subscribe((travelGroupData) => {
						Object.assign(this.flatTravelGroups[this.selectedTGIndex], travelGroupData);
						this._selectedTravelGroup.next(this.flatTravelGroups[this.selectedTGIndex]);
						this.loadingTravelGroup = false;
					});
				} else {
					this.loadingTravelGroup = false;
				}
			}
		}
	}

	setNumReceived(travelGroupId) {
		this.travelGroups.forEach((day: any) => {
			day.forEach((group) => {
				if (group.travelGroupId === travelGroupId) {
					group.numReceived = group.travelers.reduce((count, traveler) => traveler.travelPacketReceived ? count + 1 : count, 0);
					group.numNotReceived = group.travelers.length - group.numReceived;
				}
			});
		});
		this._loadingTravelGroups.next(this.travelGroups);
	}

	changeTravelGroup(direction) {
		this.loadingTravelGroup = true;
		if ((this.selectedTGIndex === 0 && direction === -1) || (this.selectedTGIndex === (this.flatTravelGroups.length - 1) && direction === 1)) {
			if (this.selectedTGIndex === 0) {
				this.setDates(this.day.subtract(7, 'day'));
				this.reloadGroups(true);
			} else if (this.selectedTGIndex === (this.flatTravelGroups.length - 1) && direction === 1) {
				this.setDates(this.day.add(7, 'day'));
				this.reloadGroups(true);
			}
		} else {
			this.selectedTGIndex = this.selectedTGIndex + (direction === 1 ? 1 : -1);
			this.routeToSelectedTravelGroup();
		}
	}

	//Make sure that the dates are in MM-DD-YYYY format
	routeToSelectedTravelGroup() {
		this.router.navigate([`/travel/travel-groups/group-view/${this.flatTravelGroups[this.selectedTGIndex].travelGroupId}`]);
	}

	getMissions() {
		return this.http.get(`${this.hostName.travelUrl}travel-groups/missions`);
	}

	getTravelGroupByMissionId(id: string) {
		return this.http.get(`${this.hostName.travelUrl}travel-groups/mission/${id}`);
	}

	getTravelGroupById(travelGroupId: number) {
		return this.http.get(`${this.hostName.travelUrl}travel-groups/${travelGroupId.toString()}`);
	}

	getTravelGroupsForDates(startDate: String, endDate: String) {
		return this.http.get(`${this.hostName.travelUrl}travel-groups/missions/week-view?startDate=${startDate}&endDate=${endDate}`);
	}

	updateTravelPacketStatus(travelPacketStatus: any) {
		return this.http.put(`${this.hostName.travelUrl}travel-groups/status/update`, travelPacketStatus, { responseType: 'text' });
	}

	createTravelPacketStatus(travelPacketStatuses: Array<any>) {
		return this.http.post(`${this.hostName.travelUrl}travel-groups/status/create`, travelPacketStatuses, { responseType: 'text' });
	}

	setTravelGroupLeader(id: string, missionaryId: string) {
		return this.http.put(`${this.hostName.travelUrl}travel-groups/${id}?missionaryId=${missionaryId}`, null);
	}

}
