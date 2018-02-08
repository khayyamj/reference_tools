import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TravelPacketsService {
	private travelPacketsRouteClicked: BehaviorSubject<any> = new BehaviorSubject<any>(false);
	public travelPacketsRouteClicked$: any = this.travelPacketsRouteClicked.asObservable();
	public loading: boolean;

	constructor(private hostName: HostnameService,
				private http: HttpClient) { }

	//Make sure that the dates are in MM-DD-YYYY format
	getMissionsForDates(startDate: String, endDate: String) {
		return this.http.get(`${this.hostName.travelUrl}packets/missions?startDate=${startDate}&endDate=${endDate}`);
	}

	getTravelPacketStatusesForTravelGroup(travelGroupId: number) {
		return this.http.get(`${this.hostName.travelUrl}packets/${travelGroupId.toString()}`);
	}

	updateTravelPacketStatus(travelPacketStatus: any) {
		return this.http.put(`${this.hostName.travelUrl}packets`, travelPacketStatus, {responseType: 'text'});
	}

	createTravelPacketStatus(travelPacketStatuses: Array<any>) {
		return this.http.post(`${this.hostName.travelUrl}packets`, travelPacketStatuses, { responseType: 'text' });
	}

}
