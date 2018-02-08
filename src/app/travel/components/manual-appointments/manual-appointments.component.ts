import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../services';
import { SimpleConfirmationComponent } from 'mtc-modules';
import { NewAppointmentComponent } from '../new-appointment/';
import { MatDialog } from '@angular/material';
import { MissionaryService } from '../../../core-missionary';

@Component({
	selector: 'travel-manual-appointments',
	templateUrl: './manual-appointments.component.html',
	styleUrls: ['./manual-appointments.component.less']
})
export class ManualAppointmentsComponent implements OnInit {

	_isAllOpen = true;
	filter = 'all';
	medicalExpanded = true;
	otherExpanded = true;

	appointments: any = null;
	appointmentsLoaded = false;

	constructor(private newAppointmentService: AppointmentsService,
				private dialog: MatDialog,
				public missionaryService: MissionaryService) { }

	ngOnInit() {
		this.reload();
	}

	reload() {
		this.appointmentsLoaded = false;
		this.newAppointmentService.getManualAppointments().subscribe((appointments:any[]) => {
			this.appointments = appointments;
			this.appointmentsLoaded = true;
		});
	}

	isSenior(appointment: any) {
		return appointment.travelers.some((traveler) => {
			return (traveler.missionaryType.match(/senior|couple/ig) !== null);
		});
	}

	isAllOpen() {
		return this._isAllOpen;
	}

	toggleAll() {
		this._isAllOpen = !this._isAllOpen;
		this.medicalExpanded = this._isAllOpen;
		this.otherExpanded = this._isAllOpen;
	}

	toggleOne(consulateExpanded) {
		this[consulateExpanded] = !this[consulateExpanded];
		// Check if they're all expanded/collapsed
		if (this.medicalExpanded === this[consulateExpanded] && this.otherExpanded === this[consulateExpanded]) {
			this._isAllOpen = this[consulateExpanded];
		}
	}

	showNoAppointmentsText(expanded: boolean, type: string) {
		return expanded && this.appointmentsLoaded && (!this.appointments || this.appointments[type].length === 0);
	}

	appointmentsExist(expanded: boolean, type: string) {
		return expanded && this.appointmentsLoaded && this.appointments && this.appointments[type] && this.appointments[type].length > 0;
	}

	addByDate(toAdd, array) {
		let index = 0;
		const a = new Date(toAdd.departureDate).getTime();
		for (const item of array) {
			const b = new Date(item.departureDate).getTime();
			if (a < b) {
				array.splice(index, 0, toAdd);
				break;
			}
			index++;
		}
		if (index === array.length) {
			array.push(toAdd);
		}
		return array;
	}

	openApptDialog(appointment: any = null) {
		this.dialog.open(NewAppointmentComponent, {
			data: { appointment: appointment, type: 'manual' },
			width: '1025px'
		}).afterClosed().subscribe((appt) => {
			if (appt && appt.travelReason) {
				if (appointment) {
					this.appointments[appointment.travelReason].splice(this.appointments[appointment.travelReason].indexOf(appointment), 1);
				}
				this.addByDate(appt, this.appointments[appt.travelReason]);
			}
		});
	}

	onDeleteApptClick(appointment: any, event, type) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete this manual appointment?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '400px'
		}).afterClosed().subscribe((deleted) => {
			if (deleted === true) {
				this.newAppointmentService.deleteManualAppointment(appointment.id).subscribe(() => {
					this.appointments[type].splice(this.appointments[type].indexOf(appointment), 1);
				});
			}
		});
		event.stopPropagation();
	}

	setSelectedMissionary(missionaryId) {
		setTimeout(this.missionaryService.setSelectedMissionary(missionaryId));
	}

	// This here is related to the group view

	isTravelLeader(appointment, traveler) {
		return appointment.travelGroupLeaderId === traveler.missionaryId;
	}

}
