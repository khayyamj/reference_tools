import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TravelSearchService {

	constructor(private hostname: HostnameService,
				private http: HttpClient) { }


	public getMissionaryById(id){
		return this.http.get(`${this.hostname.travelUrl}travel-groups/missionary/${id}`);
	}

	public getSeniorCoupleSpouse(id){
		return this.http.get(`${this.hostname.travelUrl}travel-groups/missionary/${id}/spouse`);
	}

}
