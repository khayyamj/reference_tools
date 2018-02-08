import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class AirlineSettingsService {

private airlinesSubject = new BehaviorSubject<any[]>([]);
private airlineGroupsSubject = new BehaviorSubject<any[]>([]);

	constructor(private hostName: HostnameService,
				private http: HttpClient) {
		this.http.get(`${this.hostName.travelUrl}settings/airlines/`).subscribe((airlines:any[]) => {
			this.airlinesSubject.next(airlines);
		});
		this.http.get(`${this.hostName.travelUrl}settings/airlinegroups/`).subscribe((groups:any[]) => {
			this.airlineGroupsSubject.next(groups);
		});
	}

	getAirlines() {
		return this.airlinesSubject.asObservable();
	}

	getAirlineGroups() {
		return this.airlineGroupsSubject.asObservable();
	}

	deleteAirlineGroup(airlineGroupId) {
		return this.http.delete(`${this.hostName.travelUrl}settings/airlinegroup/${airlineGroupId}`);
	}

	setAirlineGroup(airlineGroup) {
		return this.http.put(`${this.hostName.travelUrl}settings/airlinegroup/`, airlineGroup);
	}

}
