import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService, EmailService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable()
export class AppointmentsService {

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient,
				private emailService: EmailService,
				private datePipe: DatePipe) { }


	////// MANUAL APPOINTMENTS ///////

	public getManualAppointments() {
		return this.http.get(`${this.hostname.travelUrl}manual-appointments?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

	public upsertManualAppointment(appointment) {
		return this.http.put(`${this.hostname.travelUrl}manual-appointments`, appointment);
	}

	public deleteManualAppointment(id) {
		return this.http.delete(`${this.hostname.travelUrl}manual-appointments/${id}`, {responseType: 'text'});
	}


	////// CONSULATE APPOINTMENTS ///////

	public getConsulateAppointments() {
		return this.http.get(`${this.hostname.travelUrl}consulate-appointments?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

	public upsertConsulateAppointment(appointment) {
		return this.http.put(`${this.hostname.travelUrl}consulate-appointments`, appointment);
	}

	public deleteConsulateAppointment(id) {
		return this.http.delete(`${this.hostname.travelUrl}consulate-appointments/${id}`, {responseType: 'text'});
	}


	////// CONSULATE PAGE ///////

	public setTravelGroupLeader(id: string, missionaryId: string) {
		return this.http.put(`${this.hostname.travelUrl}consulate-appointments/${id}?missionaryId=${missionaryId}`, {responseType: 'text'});
	}

	public getConsulateFlightTravelGroups() {
		return this.http.get(`${this.hostname.travelUrl}consulate-appointments/flights?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

	public updateConsulateGroupEmail(appointmentId) {
		return this.http.put(`${this.hostname.travelUrl}consulate-appointments/email/${appointmentId}`, {responseType: 'text'});
	}

	public updateConsulateFlightGroupEmail(travelGroupId) {
		return this.http.put(`${this.hostname.travelUrl}travel-groups/email/${travelGroupId}`, {responseType: 'text'});
	}

	public emailMissionaryChange(appointment: any) {
		const emails = appointment.missionaries.map(m => m.personalInfo.email).join(',');
		let subject = '';
		let body = '';
		switch (appointment.consulate) {
			case 'Spain (MTC)':
				subject = 'Missionaries Assigned to Spain';
				body = `<p>You are required to make a personal appearance with Consul Lago, the Consul of Spain, in order to pick up your visa. You will then fly directly to your mission on your scheduled departure date.</p>
<p>You are scheduled to meet with the consulate on <b>${this.datePipe.transform(new Date(appointment.appointmentDate), 'EEEE, MMMM d')}</b> at <b>${this.datePipe.transform(new Date(appointment.appointmentDate - 600000), 'h:mma')}</b> in room <b>${appointment.room}</b>. Please do not be late. Consul Lago is taking time out of his day to meet with you at the MTC, and he will be the one giving you your visas. Please make it your number one priority to be there at <b>${this.datePipe.transform(new Date(appointment.appointmentDate - 600000), 'h:mma')}</b> for your <b>${this.datePipe.transform(new Date(appointment.appointmentDate), 'h:mma')}</b> appointment.</p>
<p>Thank you,</p>
<p>MTC Travel Services, 2M-119</p>`;
				break;
			case 'Spain (UVU)':
				subject = 'Missionaries Assigned to Spain';
				body = `<p>You are required to make a personal appearance at the Spain Consulate at UVU in order to pick up your visa. This means that you will leave the MTC and meet with Consul Lago, the Consul of Spain. You will then fly directly to your mission on your scheduled departure date.</p>
<p>You are scheduled to travel to the consulate on <b>${this.datePipe.transform(new Date(appointment.appointmentDate), 'EEEE, MMMM d')}</b>. You must report to Travel Services in 2M-119 at <b>${this.datePipe.transform(new Date(appointment.departureDate), 'h:mma')}</b> for your departure. Consul Lago’s office is located in the Liberal Arts Building, room #114, at Utah Valley University. The time allocated for this trip will not allow for any activities except to go to the consulate and return.</p>
<p>Please come to the Travel Office as soon as possible to confirm your consulate trip.</p>
					<p>Thank you,</p>
					<p>MTC Travel Services, 2M-119</p>`;
				break;
			case 'Italy (SLC)':
				subject = 'Missionaries Assigned to Italy';
				body = `<p>You are required to make a personal appearance at the Italian Consulate in Salt Lake City in order to pick up your visa. This means that you will leave the MTC and take the train to SLC and back.</p>
<p>You are scheduled to travel to the consulate on <b>${this.datePipe.transform(new Date(appointment.appointmentDate), 'EEEE, MMMM d')}</b>. You must report to Travel Services in 2M-119 at <b>${this.datePipe.transform(new Date(appointment.checkoutDate), 'h:mma')}</b> sharp for your departure to the train station. Please report to the front desk earlier that morning and they will open up a section of the cafeteria for you to get breakfast and make yourself a sack lunch for your trip.</p>
<p>Depart on Front Runner to SLC Central Station at <b>${this.datePipe.transform(new Date(appointment.frontRunnerDate), 'h:mma')}</b> (Do not take an earlier train)</p>
<p>Depart on Blue Line Trax to Gallivan Plaza at <b>${this.datePipe.transform(new Date(appointment.traxDate), 'h:mma')}</b> (Do not take an earlier trax)</p>
<p>In Salt Lake, you will meet with Travel Agent Lisa Palazzolo. Once finished at the consulate, please follow Lisa’s instructions on how and when to get back to the train station. The time allocated for this trip will not allow for any activities except to go to the consulate, have lunch and return.</p>
<p>**<b>If your companion is not on the list, then they will stay at the MTC while you are gone. They CANNOT go with you to the consulate.</b>** You will be traveling with a group of missionaries.</p>
<p>**<b>You must bring your DRIVER’S LICENSE and a PEN with you to the consulate.</b>**</p>
					<p>Thank you,</p>
					<p>MTC Travel Services, 2M-119</p>`;
				break;
			case 'Mexico (SLC)':
				subject = 'Missionaries Assigned to Mexico';
				body = `<p>In order to receive your visa to travel to Mexico, you must make a personal appearance at a Mexican Consulate. You are scheduled to travel to the consulate in Salt Lake on <b>${this.datePipe.transform(new Date(appointment.checkoutDate), 'EEEE, MMMM d')}</b>. Please meet the MTC driver in the Travel Office at <b>${this.datePipe.transform(new Date(appointment.appointmentDate), 'h:mma')}</b>. You will be riding the train to the Murray Station and then the Trax to the consulate. <b>Bring your photo I.D.</b> Elders, please wear your suit coat. Sisters, please have your hair pulled back off your shoulders and behind your ears.
<p>**<b>If your companion is not on the list, then they will stay at the MTC while you are gone. They CANNOT go with you to the consulate.</b>* * You will be traveling with a group of missionaries.</p>
<p><b>As soon as you receive this notice, go immediately to the Travel Office to confirm your trip.</b></p>
<p>Please report to the front desk earlier that morning and they will open up a section of the cafeteria for you to get breakfast and make yourself a sack lunch for your trip.</p>
<p>**<b>Please be prepared to answer the question: “Where are you going in Mexico?” Be specific. For example, do not just say “Mexico City”, you need to give a neighborhood—perhaps the area where the mission home is located.</b> You should immediately ask someone for this information if you do not already know it. For those called to smaller cities, your mission name should be sufficient, i.e. Culiacan, Hermosillo, Ciudad Juarez etc.****</p>
					<p>Thank you,</p>
					<p>MTC Travel Services, 2M-119</p>`;
				break;
			default: return;
		}
		this.emailService.sendEmail(emails, body, subject);
		this.emailTravelGroupLeader(appointment);
	}

	public emailTravelGroupLeader(appointment: any) {
		const missArray = appointment.missionaries.filter(m => m.missionaryId === appointment.travelGroupLeaderId);
		const emails = missArray.map(m => m.personalInfo.email).join(',');
		let subject = '';
		let body = '';
		switch (appointment.consulate) {
			case 'Italy (SLC)':
				subject = 'Italy Consulate Travel Leader';
				body = `<p>Elder/Sister Last Name:</p>
<p>Missionaries serving in Italy must make a personal appearance at the Italian Consulate to obtain a visa. You are scheduled to travel to the Italian Consulate in Salt Lake City on <b>${this.datePipe.transform(new Date(appointment.appointmentDate), 'EEEE, MMMM d')}</b>.</p>
<p>You will be the Travel Leader for your group. You will receive a cell phone, train passes, a list of missionaries going to the consulate, and instructions to ride the Frontrunner Train and Trax. The cell phone is to be used for business purposes only. If companions are not on the list, they DO NOT travel to the consulate with the group. Please report to the front desk earlier that morning and they will open up a section of the cafeteria for you to get breakfast and make yourself a sack lunch for your trip.</p>
<p>Please make sure you have everyone on your list before you leave for the train.</p>
<p>Please meet the MTC driver in the Travel Office (2M-119) at <b>${this.datePipe.transform(new Date(appointment.checkoutDate), 'h:mma')}</b> sharp. Do not arrive any earlier. You will be departing the MTC at <b>${this.datePipe.transform(new Date(appointment.departureDate), 'h:mma')}</b>. You will be riding the <b>${this.datePipe.transform(new Date(appointment.frontRunnerDate), 'h:mma')}</b> train to the Salt Lake Central Station and then be taking the <b>${this.datePipe.transform(new Date(appointment.traxDate), 'h:mma')}</b> Blue Line Trax to Gallivan Center. Please do not take any earlier trains. This schedule will get you to the consulate at the time we need you there.</p>
<p><b>Once you arrive, you will meet Travel Agent Lisa Palazzolo at the Gallivan Center</b>. Make sure your cell phone is on and wait for her there. When you are finished at the consulate, proceed back to the Trax and Frontrunner train.</p>
<p>Please call the Travel Office (801) 422-6951 when you get to the Orem Station, and we will send a driver to pick you up when you arrive back at the Provo Station. Then give your shuttle driver back the cell phone you borrowed.</p>
<p>If you have any questions, please come to the Travel Office.</p>
					<p>Thank you,</p>
					<p>MTC Travel Services, 2M-119</p>`;
				break;
			case 'Mexico (SLC)':
				subject = 'Mexico Consulate Travel Leader';
				body = `<p>Elder/Sister Last Name</p>
<p>Missionaries serving in Mexico must make a personal appearance at a Mexican Consulate to obtain a visa. You are scheduled to travel to the Mexican Consulate in Salt Lake City on <b>${this.datePipe.transform(new Date(appointment.appointmentDate), 'EEEE, MMMM d')}</b>.</p>
<p>Please meet the MTC driver in the Travel Office at <b>${this.datePipe.transform(new Date(appointment.checkoutDate), 'h:mma')}</b>. You will be riding the <b>${this.datePipe.transform(new Date(appointment.frontRunnerDate), 'h:mma')}</b> train to the Murray Station and then Trax to the consulate.</p>
<p>You will be the Travel Leader for your group. You will receive a list of missionaries in your group. Please make sure you have all missionaries before you leave the MTC to go to the train station. If companions are not on the list, they DO NOT travel to the consulate with the group. Please report to the front desk earlier that morning and they will open up a section of the cafeteria for you to get breakfast and make yourself a sack lunch for your trip.</p>
<p>You will receive a cell phone, train passes, and instructions to ride the Frontrunner Train and Trax. Please get off the train at the Murray Central Station, follow the instructions and map to ride the Trax, and then walk to the consulate. The cell phone is to be used for business purposes only. The trip is a consulate trip only; there is no time to stop to eat or for other activities.</p>
<p><b>Once you arrive, please do not enter the consulate until ${this.datePipe.transform(new Date(appointment.appointmentDate - 900000), 'h:mma')}</b>. When you are finished at the consulate, proceed immediately back to the Trax and Frontrunner train.</p>
<p>Please call the Travel Office (801) 422-6951 when you get to the Orem Station, and we will send a driver to pick you up when you arrive back at the Provo Station. Then give your shuttle driver back the cell phone you borrowed.</p>
<p>If you have any questions, please come to the Travel Office.</p>
					<p>Thank you,</p>
					<p>MTC Travel Services, 2M-119</p>`;
				break;
			default: return;
		}
		this.emailService.sendEmail(emails, body, subject);
	}

}
