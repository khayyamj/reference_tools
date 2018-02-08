import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { MtcDatePipe } from 'mtc-modules';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LeadTimesService {
	constructor(private hostName: HostnameService,
				private http: HttpClient,
				private mtcDate: MtcDatePipe) { }

	getDeparturePeriods() {
		return this.http.get(`${this.hostName.travelUrl}departure-schedule/leadtimes/`);
	}

	getPeriod(date) {
		date = this.mtcDate.transform(date);
		return this.http.get(`${this.hostName.travelUrl}departure-schedule/period/${date}`);
	}

	updatePeriod(period) {
		return this.http.put(`${this.hostName.travelUrl}departure-schedule/period/`, period);
	}

	createPeriod(period) {
		return this.http.post(`${this.hostName.travelUrl}departure-schedule/period/`, period);
	}

	deletePeriod(id:string) {
		return this.http.delete(`${this.hostName.travelUrl}departure-schedule/period/${id}`);
	}

	getYearlyExceptions() {
		return this.http.get(`${this.hostName.travelUrl}departure-schedule/exceptions/`);
	}

	updateExceptionsForYear(year, exceptions) {
		return this.http.put(`${this.hostName.travelUrl}departure-schedule/exceptions/${year}`, exceptions);
	}

}

