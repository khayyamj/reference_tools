import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppointmentsService } from '../../services';
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
	selector: 'travel-new-appointment',
	templateUrl: './new-appointment.component.html',
	styleUrls: ['./new-appointment.component.less']
})
export class NewAppointmentComponent {


	public destinations = [
		{ name: 'Airport', specifyPassengers: false },
		{ name: 'Church Office Building', specifyPassengers: false },
		{ name: 'Hyatt House Hotel', specifyPassengers: false },
		{ name: 'Temple Square', specifyPassengers: false },
		{ name: 'Welfare Square', specifyPassengers: false },
		{ name: 'Other', specifyPassengers: false }
	];

	public travelReasons = [
		'Medical',
		'Other'
	];

	public consulates = [
		'Mexico (SLC)',
		'Italy (SLC)',
		'Spain (UVU)',
		'Spain (MTC)'
	];

	public cellphones = [
		'None Assigned',
		'8017229665',
		'8013617284',
		'8015139495',
		'8015292099'
	];

	public type: string;
	public modalTitle: string;

	public appointmentToEdit: any;

	public travelers = [];
	public showError = false;
	private appointment;
	private departureScheduleId;
	public saving = false;

	constructor(private appointmentsService: AppointmentsService,
		private dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) private data: any) {

		this.type = this.data.type;
		this.modalTitle = this.type === 'manual' ? ' Manual Appointment' : ' Consulate Appointment';

		if (this.data.appointment) {
			this.appointmentToEdit = _.cloneDeep(this.data.appointment);
			if (!_.isNil(this.appointmentToEdit.frontRunnerTime)) {
				this.appointmentToEdit.frontRunnerTime = moment(this.appointmentToEdit.frontRunnerTime);
			}
			this.travelers = this.appointmentToEdit.travelers;
			this.appointmentToEdit.appointmentTime = _.cloneDeep(this.data.appointment.appointmentDate);
			if ('manual' === this.type) {
				if ('Other' === this.appointmentToEdit.travelReason) {
					const nameArray = this.destinations.map((destination) => {
						return destination.name;
					});
					if (!nameArray.includes(this.appointmentToEdit.destination)) {
						this.appointmentToEdit.otherDestination = this.appointmentToEdit.destination;
						this.appointmentToEdit.destination = 'Other';
					}
				}
			}
		}
	}

	showTravelType(form) {
		if ('consulate' === this.type && form.value.consulate) {
			return 'Mexico (SLC)' === form.value.consulate ||
				'Italy (SLC)' === form.value.consulate;
		} else if ('manual' === this.type) {
			return 'Other' === form.value.travelReason;
		} else {
			return false;
		}
	}

	specifyPassengers(destination) {
		let specify;
		this.destinations.filter((dest) => {
			if (destination === dest.name) {
				specify = dest.specifyPassengers;
			}
		});
		return specify;
	}

	updateDepartureSchedule(newDepartureSchedule, form) {
		this.departureScheduleId = newDepartureSchedule.departureScheduleId;
		setTimeout(() => {
			form.value.pickupTime = newDepartureSchedule.trainTime.clone().add(4,'h');
		}, 0);

		setTimeout(() => {
			form.value.departureTime = moment(newDepartureSchedule.departureTime);
		}, 0);
	}

	updateDates() {
		this.appointment.appointmentDate = moment(this.appointment.appointmentDate);
		if(this.appointment.appointmentTime) {
			this.appointment.appointmentDate.minute(this.appointment.appointmentTime.minute());
			this.appointment.appointmentDate.hour(this.appointment.appointmentTime.hour());
		} else {
			this.appointment.appointmentDate.startOf('day');
		}

		if (this.appointment.departureTime) {
			this.appointment.departureDate = this.appointment.appointmentDate.clone();
			this.appointment.departureDate.minute(this.appointment.departureTime.minute());
			this.appointment.departureDate.hour(this.appointment.departureTime.hour());
		}

		if (this.appointment.checkoutTime) {
			this.appointment.checkoutDate = this.appointment.appointmentDate.clone();
			this.appointment.checkoutDate.minute(this.appointment.checkoutTime.minute());
			this.appointment.checkoutDate.hour(this.appointment.checkoutTime.hour());
		}

		if (this.appointment.pickupTime) {
			this.appointment.pickupDate = this.appointment.appointmentDate.clone();
			this.appointment.pickupDate.minute(this.appointment.pickupTime.minute());
			this.appointment.pickupDate.hour(this.appointment.pickupTime.hour());
		}

		if ('Spain (MTC)' === this.appointment.consulate) {
			this.appointment.departureDate = null;
			this.appointment.checkoutDate = null;
			this.appointment.pickupDate = null;
		}
	}

	validNumTravelers(form) {
		if (this.travelers && this.travelers.length > 0) {
			return true;
		} else {
			if ('manual' === this.type) {
				if ('Other' === form.value.travelReason && !this.specifyPassengers(form.value.destination)) {
					return true;
				} else {
					return false;
				}

			} else {
				return false;
			}
		}
	}

	travelersRequired(form) {
		if (form.passengerCount) {
			return false;
		} else {
			if ('manual' === this.type) {
				if ('Other' === form.value.travelReason && !this.specifyPassengers(form.value.destination)) {
					return false;
				} else {
					return true;
				}

			} else {
				return true;
			}
		}
	}

	save(form) {
		//TODO The two lines below should be deleted when angular material is updated since the most recent release should fix this bug https://github.com/angular/material2/issues/4611
		if(form.controls.destination) { form.controls.destination.markAsTouched(); }
		if(form.controls.travelReason) { form.controls.travelReason.markAsTouched(); }
		if(this.validNumTravelers(form)) {
			this.showError = false;
			if (form.valid) {
				this.saving = true;
				this.appointment = form.value;
				this.appointment.travelers = this.travelers;

				this.updateDates();
				if(this.appointment.displayOnSchedule) {
					this.appointment.departureScheduleId = this.departureScheduleId;
				} else if('consulate' === this.type && this.appointment.consulate !== 'Spain (MTC)') {
					this.appointment.departureScheduleId = this.departureScheduleId;
					this.appointment.displayOnSchedule = true;
				}

				if (this.appointmentToEdit && this.appointmentToEdit.id) {
					this.appointment.id = this.appointmentToEdit.id;
				}

				if (this.appointment.travelers && this.appointment.travelers.length > 1) {
					this.appointment.traveGroupLeaderId = this.appointment.travelers[0].missionaryId;
				}

				if ('manual' === this.type) {
					if (this.appointment.otherDestination) {
						this.appointment.destination = this.appointment.otherDestination;
					}
					if (this.specifyPassengers(form.value.destination)) {
						this.appointment.passengerCount = 0;
					}
					if (!this.appointment.travelType) {
						this.appointment.travelType = 'Driver';
					}
					this.appointmentsService.upsertManualAppointment(this.appointment).subscribe((manualAppointment:any) => {
						this.dialogRef.close(manualAppointment);
					});
				}
				if ('consulate' === this.type) {
					this.appointmentsService.upsertConsulateAppointment(this.appointment).subscribe((consulateAppointment:any) => {
						this.dialogRef.close(consulateAppointment);
					});
				}
			}
		} else {
			this.showError = true;
		}
	}
}
