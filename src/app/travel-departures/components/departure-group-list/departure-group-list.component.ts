import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { DepartureGroupService } from '../../services';
import { DriversVehiclesService } from '../../../travel-settings/services';
import { SimpleConfirmationComponent, MTCUser, MTCToastService, MtcDatePipe } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { WindowRefService, ConfigService } from '../../../shared';
import { EditDriversComponent } from '../edit-drivers';
import { DepartureNoteEditorComponent } from '../departure-note-editor';
import { NewDepartureGroupComponent } from '../new-departure-group';
import { DeparturePrintComponent } from '../departure-print';
import { DragulaService } from 'ng2-dragula';

@Component({
	selector: 'travel-departure-groups-list',
	templateUrl: './departure-group-list.component.html',
	styleUrls: ['./departure-group-list.component.less']
})

export class DepartureGroupListComponent implements OnInit, OnDestroy {

	filter = { myRoutes: false, hidePast: false };
	user: any;
	selectedWeek: any[] = [];
	allDepartureGroups: any[] = [];
	day = moment();
	currWeekSunday: any;
	dragging = false;
	departuresLoaded = false;
	backgroundColors = {
		Airport:'#4d6594',
		'Church Office':'#51BC95',
		Pickup:'#EF5458',
		Appointment:'#FFC600',
		AppointmentColor:'#4A4A4A',
		Maintenance:'#7F6DB0',
		Consulate:'#4A4A4A'
	};
	constructor(private dialog: MatDialog,
		private windowRefService: WindowRefService,
		public departureGroupService: DepartureGroupService,
		private userService: MTCUser,
		public dragulaService: DragulaService,
		public configService: ConfigService,
		private mtcDate: MtcDatePipe,
		private toastService: MTCToastService,
		private driversVehiclesService: DriversVehiclesService) {
		// driversVehiclesService is injected to preload data for edit drivers
	}

	ngOnInit() {
		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});
		this.configService.loaded.subscribe(() => {
			if (this.configService.getConfig('Departure Schedule', 'hidePast')) {
				this.filter.hidePast = this.configService.getConfig('Departure Schedule', 'hidePast').value === '1';
			}
			if (this.configService.getConfig('Departure Schedule', 'myRoutes')) {
				this.filter.myRoutes = this.configService.getConfig('Departure Schedule', 'myRoutes').value === '1';
			}
			if (this.configService.getConfig('Departure Schedule', 'selectedDateRange')) {
				this.day = moment(this.configService.getConfig('Departure Schedule', 'selectedDateRange').value, 'DD-MMM-YYYY');
			}
			this.changeSelected(this.day);
		});

		this.dragulaService.setOptions('groups-bag', {
			accepts: (el, target, source, sibling): boolean => {
				return target.id !== source.id;
			}
		});
		this.dragulaService.dropModel.subscribe(([, dragElement, dragTarget, dragSource]) => {
			const groupId = parseInt(dragElement.id, 10);
			const toDepartureId = parseInt(dragTarget.id, 10);
			const fromDepartureId = parseInt(dragSource.id, 10);

			const toDepartureGroup = this.allDepartureGroups.find((departureGroup) => {
				return departureGroup.departureGroupId === toDepartureId;
			});
			const fromDepartureGroup = this.allDepartureGroups.find((departureGroup) => {
				return departureGroup.departureGroupId === fromDepartureId;
			});
			const group = toDepartureGroup.allGroups.find((other) => {
				return other.departureGroupItemId === groupId;
			});
			if (group && group.dropoffDprtGrpId === fromDepartureId) {
				group.dropoffDprtGrpId = toDepartureId;
				group.dgDropoffMtcDprtDt = toDepartureGroup.mtcDepartureDate;
			}
			if (group && group.pickupDprtGrpId === fromDepartureId) {
				group.pickupDprtGrpId = toDepartureId;
			}
			toDepartureGroup.allGroups = toDepartureGroup.allGroups.sort((groupA, groupB) => {
				return (groupA.tgFlightDepartureDt || groupA.checkoutDt) - (groupB.tgFlightDepartureDt || groupB.checkoutDt);
			});
			toDepartureGroup.totalTravelers += group.mbrCnt;
			fromDepartureGroup.totalTravelers -= group.mbrCnt;
			this.departureGroupService.updateDepartureGroupItem(group).subscribe();
			const leadTime = moment.duration(fromDepartureGroup.mtcDepartureDate - group.checkInDt).asMinutes();
			group.checkInDt = moment(toDepartureGroup.mtcDepartureDate).subtract(leadTime, 'minutes');
			if (fromDepartureGroup.totalTravelers < 1) {
				fromDepartureGroup.mtcCheckoutDate = null;
			}
			if (!toDepartureGroup.mtcCheckoutDate || toDepartureGroup.mtcCheckoutDate > group.checkInDt) {
				toDepartureGroup.mtcCheckoutDate = group.checkInDt;
			}
			fromDepartureGroup.mtcCheckoutDate = fromDepartureGroup.allGroups.reduce((minDate,allGroup)=>{
					return Math.min(allGroup.checkInDt, minDate);
			},fromDepartureGroup.allGroups[0] ? fromDepartureGroup.allGroups[0].checkInDt : 0);
		});
	}

	ngOnDestroy() {
		this.dragulaService.destroy('groups-bag');
	}

	deleteEmptyDepartureGroup(departure,dayGroups) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete this departure group?',
			title: 'Delete Departure Group'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				this.departureGroupService.deleteDepartureGroup(departure.departureGroupId).subscribe(() => {
					this.allDepartureGroups.splice(this.allDepartureGroups.indexOf(departure), 1);
					dayGroups.splice(dayGroups.indexOf(departure), 1);
				});
			}
		});
		event.stopPropagation();
	}

	changeSelected(newDate) {
		this.currWeekSunday = newDate;
		this.configService.setConfig('Departure Schedule', 'selectedDateRange', this.currWeekSunday.clone().format('DD-MMM-YY')).subscribe();
		const currWeekSaturday = this.currWeekSunday.clone().add(6, 'd').startOf('day');
		this.departuresLoaded = false;
		this.departureGroupService.getDepartureGroupsByDate(this.mtcDate.transform(this.currWeekSunday), this.mtcDate.transform(currWeekSaturday)).subscribe((week:any) => {
			this.selectedWeek = week;
			this.departuresLoaded = true;
			this.allDepartureGroups = [];
			this.selectedWeek.forEach((day) => {
				this.allDepartureGroups = this.allDepartureGroups.concat(day.departureGroups);
			});
		});
	}

	getDepartureGroupStyles(departure) {
		return {
			'background-color': this.backgroundColors[departure.departureGroupTypeName] ||'#A6B2C9',
			'color': departure.departureGroupTypeName === 'Appointment' ?  '#4A4A4A' : '#FFFFFF',
			'opacity': departure.mtcDepartureDate < new Date() ? .5 : 1
		};
	}

	checkFilter(departure) {
		if (this.filter.myRoutes && departure.driverVehicles) {
			return departure.driverVehicles.find((dv) => {
				return `${dv.driver.firstName} ${dv.driver.lastName}` === this.user.name;
			});
		} else if (this.filter.hidePast) {
			return new Date(departure.mtcDepartureDate) >= new Date();
		}
		return true;
	}

	checkDayFilter(day) {
		return day.departureGroups.some(this.checkFilter.bind(this));
	}

	setFilter(filter, checked) {
		this.configService.setConfig('Departure Schedule', filter, checked).subscribe();
	}

	toggleAll(departure) {
		if (departure.allGroups) {
			departure.allExpanded = !departure.allExpanded;
			departure.allGroups.forEach((group) => {
				if(group.expanded!==departure.allExpanded) {
					this.toggleOne(group, departure,true);
				}
			});
		}
	}

	toggleOne(group, departure, expandAll?) {
		group.expanded = !group.expanded;
		if(!group.members) {
			this.departuresLoaded = false;
			this.departureGroupService.getDepartureGroupItem(group).subscribe((members:any) => {
				group.members = members;
				this.departuresLoaded = true;
			});
		}
		if(!expandAll){
			departure.allExpanded = departure.allGroups.every(g => g.expanded);
		}
	}

	print() {
		const config = {
			sunday: this.currWeekSunday
		};
		this.dialog.open(DeparturePrintComponent, {
			data: config,
			width: '500px'
		}).afterClosed().subscribe((days) => {
			if (days) {
				if (days.length === 1) {
					this.selectedWeek.forEach(dataDay => {
						if (new Date(dataDay.mtcDepartureDate).getDate() !== days[0].getDate()) {
							dataDay.noPrint = true;
						} else {
							dataDay.noPrint = false;
						}
					});
				} else {
					this.selectedWeek.forEach(dataDay => {
						dataDay.noPrint = false;
					});
				}
				this.windowRefService.getWindow().setTimeout(() => { this.windowRefService.getWindow().print(); }, 10);
			}
		});
	}

	openNewGroupModal() {
		this.dialog.open(NewDepartureGroupComponent, {
			width: '550px'
		}).afterClosed().subscribe((newDepartureGroup) => {
			if (newDepartureGroup) {
				//TODO remove Object.assign when updatedBy is put in the backend
				this.departureGroupService.createDepartureGroup(Object.assign(newDepartureGroup,{updatedBy: this.user.id})).subscribe((response:any) => {
					this.selectedWeek.find((day) => {
						let endFind = false;
						day.departureGroups.forEach((time, index)=>{
							if(!endFind && time.mtcDepartureDate > response.mtcDepartureDate){
								day.departureGroups.splice(index,0,response);
								endFind = true;
							} else if(!endFind && (index === day.departureGroups.length - 1) && moment(time.mtcCheckoutDate).isSame(moment(response.mtcDepartureDate), 'day')) {
								day.departureGroups.splice(index+1,0,response);
								endFind = true;
							}
						});
						return endFind;
					});
				});
			}
		});
	}

	shuttle() {
		//implement later
	}

	editDrivers(departure) {
		this.dialog.open(EditDriversComponent, {
			data: departure.driverVehicles,
			width: '450px'
		}).afterClosed().subscribe((newDriverVehicles) => {
			if (newDriverVehicles) {
				departure.driverVehicles = newDriverVehicles;
				this.departureGroupService.updateDriverVehicle(departure.departureGroupId, newDriverVehicles).subscribe();
			}
		});
	}

	openNote(departure) {
		let note;
		if (!departure.note) {
			note = {};
		} else {
			note = departure.note;
		}
		this.dialog.open(DepartureNoteEditorComponent, {
			data: Object.assign(note, { dgId: departure.departureGroupId }),
			width: '500px'
		}).afterClosed().subscribe((newNote) => {
			if(newNote){
				if (newNote === 'delete note'){
					delete departure.note;
					this.toastService.success(`note <strong>successfully</strong> deleted`);
				} else {
					departure.note = newNote;
					this.toastService.success(`note <strong>successfully</strong> saved`);
				}
			}
		});
	}
}
