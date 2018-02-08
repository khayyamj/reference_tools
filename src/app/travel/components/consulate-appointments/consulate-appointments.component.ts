import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SimpleConfirmationComponent, MtcDatePipe } from 'mtc-modules';
import { TravelGroupService, AppointmentsService } from '../../services';
import { NewAppointmentComponent } from '../new-appointment/';
import { EmailService } from '../../../shared';
import * as moment from 'moment';

@Component({
	selector: 'travel-consulate-appointments',
	templateUrl: './consulate-appointments.component.html',
	styleUrls: ['./consulate-appointments.component.less']
})
export class ConsulateAppointmentsComponent implements OnInit {
	public _isAllOpen = true;
	public utahConsulateExpanded = true;
	public flightConsulateExpanded = true;
	public appointments: {
		utahConsulate: Array<any>,
		flightConsulate: Array<any>
	};
	public utahConsulateLoading = true;
	public flightConsulateLoading = true;

	constructor(private travelGroupService: TravelGroupService,
				private emailService: EmailService,
				private appointmentsService: AppointmentsService,
				private dialog: MatDialog,
				private mtcDate: MtcDatePipe) {
		this.appointments = {
			utahConsulate: [],
			flightConsulate: []
		};
	}

	ngOnInit(){
		this.appointmentsService.getConsulateAppointments().subscribe((utahConsulates:any[]) => {
			this.appointments.utahConsulate = utahConsulates;
			this.utahConsulateLoading = false;
		});

		this.appointmentsService.getConsulateFlightTravelGroups().subscribe((flights:any[]) => {
			this.appointments.flightConsulate = flights;
			this.flightConsulateLoading = false;
		});
	}

	isAllOpen() {
		return this._isAllOpen;
	}

	toggleAll() {
		this._isAllOpen = !this._isAllOpen;
		this.utahConsulateExpanded = this._isAllOpen;
		this.flightConsulateExpanded = this._isAllOpen;
	}

	toggleOne(consulateExpanded) {
		this[consulateExpanded] = !this[consulateExpanded];
		// Check if they're all expanded/collapsed
		if (this.utahConsulateExpanded === this[consulateExpanded] && this.flightConsulateExpanded === this[consulateExpanded]) {
			this._isAllOpen = this[consulateExpanded];
		}
	}

	appointmentsExist(expanded: boolean, type: string) {
		return expanded && this[type + 'Loaded'] && this.appointments && this.appointments[type] && this.appointments[type].length > 0;
	}

	showNoAppointmentsText(expanded: boolean, type: string) {
		return expanded && this[type + 'Loaded'] && !this.appointmentsExist(expanded, type);
	}

	isSenior(appointment:any){
		if(!appointment.missionaries || appointment.missionaries.length === 0){
			return false;
		}
		return appointment.missionaries.some((missionary) => {
			return (missionary.missionaryType.match(/senior|couple/ig) !== null);
		});
	}

	addByDate(toAdd, array){
		let index=0;
		const a = new Date(toAdd.departureDate).getTime();
		for (const item of array){
			const b = new Date(item.departureDate).getTime();
			if (a < b){
				array.splice(index,0,toAdd);
				break;
			}
			index++;
		}
		if(index === array.length){
			array.push(toAdd);
		}
		return array;
	}

	openApptDialog(appointment: any = null) {
		this.dialog.open(NewAppointmentComponent, {
			data: {appointment: appointment, type:'consulate'},
			width: '1000px'
		}).afterClosed().subscribe((appt)=>{
			if (appt) {
				if(appointment){
					this.appointments.utahConsulate.splice(this.appointments.utahConsulate.indexOf(appointment), 1);
				}
				this.addByDate(appt, this.appointments.utahConsulate);
				if (appt.emailSent) {
					this.sendAllConsulateMemos(appt,false);
				}
			}
		});
	}

	onDeleteApptClick(appointment: any,event) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete this consulate appointment?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data:config,
			width:'400px'
		}).afterClosed().subscribe((data) => {
			if(data){
				this.appointmentsService.deleteConsulateAppointment(appointment.id).subscribe(() => {
					this.appointments.utahConsulate.splice(this.appointments.utahConsulate.indexOf(appointment),1);
				});
			}
		});
		event.stopPropagation();
	}

	showFlightConsulateInfo(appointment){
		if(!appointment.travelGroup){
			this.travelGroupService.getTravelGroupById(appointment.travelGroupId).subscribe((travelGroup:any)=>{
				appointment.travelGroup = travelGroup;
				appointment.missionaries = appointment.travelGroup.travelers;
				appointment.showInfo = !appointment.showInfo;
			});
		}else{
			appointment.showInfo = !appointment.showInfo;
		}
	}

	showUtahConsulateInfo(appointment){
		appointment.showInfo = !appointment.showInfo;
	}

	sendConsulateMemo(appointment, isFlight, traveler){
		if(isFlight){
			const flightDate = moment(appointment.flightDepartureDate).format('h:mm a');
			const checkoutTime = moment(appointment.checkInDate).format('h:mm a');
			const departTime = moment(appointment.dropoffMtcDprtDate).format('h:mm a');
			const appointmentDate = this.mtcDate.transform(appointment.flightDepartureDate);
			const flightNum = traveler.currentFlightItinerary[0].airline.flightNum;
			const emailBody = `
								<p style="opacity: 0.5; padding-left: 540px; text-align: center; line-height: 0px; font-size:11px; font-family: Helvetica;">MAILBOX</p>
								<p style="opacity: 0.5; padding-left: 540px; text-align: center; line-height: 0px; font-size: 18px; font-family: Helvetica;">${traveler.mtcInfo.mailboxId}</p>
								<p style="text-align: center; font-size: 18px; font-family: Helvetica;">Consulate Trip Memo</p>
								<p>TO: ${traveler.fullName}</p>
								<p>APPOINTMENT DATE: ${appointmentDate}</p>
								<p>SUBJECT: ${traveler.missionInfo.missionName}</p>
								<p>&nbsp;</p>
								<p>${traveler.fullName}</p>
								<p>In order to receive your visa to your mission, you will be leaving the MTC to make a personal appearance at the Consulate. You will then return to the MTC and fly to your mission on your scheduled departure date. If you are leaving early morning, go to the front desk and they will open a portion of the cafeteria for you to have breakfast and make a sack lunch for your trip.</p>
								<p>&nbsp;</p>
								<p>Report to the Travel Office (2M-119) at ${checkoutTime}</p>
								<p>Depart MTC at ${departTime}</p>
								<p>Flight Info: ${flightNum} at ${flightDate}</p>
								<p>&nbsp;</p>
								<p>If your companion did not get this memo, he or she will stay at the MTC and will not go with you. As soon as you receive this notice, go immediately to the travel office to confirm your trip.</p>
								<p style="text-decoration: underline; font-size: 14px;"><strong>Make sure you bring your driver&rsquo;s license to check-in at the airport.</strong></p>
								`;
			this.emailService.sendEmail(traveler.email, emailBody, 'Consulate Memo');
			if(appointment.missionaries && appointment.missionaries.length === 1){
				this.appointmentsService.updateConsulateGroupEmail(appointment.id).subscribe(() => {
					appointment.emailDate = new Date();
				});
			}
		}
	}

	sendAllConsulateMemos(appointment, isFlight){
		appointment.missionaries.forEach((traveler) => {
			this.sendConsulateMemo(appointment, isFlight, traveler);
		});
		if(isFlight){
			this.appointmentsService.updateConsulateFlightGroupEmail(appointment.travelGroupId).subscribe(() => {
				appointment.emailDate = new Date();
			});
		}else{
			this.appointmentsService.updateConsulateGroupEmail(appointment.id).subscribe(() => {
				appointment.emailDate = new Date();
			});
		}
	}

	printConsulateGroup(appointment) {
		//TODO implement this
	}

	printConsulateMissionary(appointment) {
		//TODO implement this
	}

	getItineraryType(consulate: string) {
		return consulate.indexOf('(') === -1 ? 'air' : consulate.substr(-4, 3).toLowerCase();
	}

}
