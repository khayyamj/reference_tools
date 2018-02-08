import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ManualItineraryService {
	constructor(private hostName: HostnameService,
				private http: HttpClient) { }

	getManualItinerariesInfo() {
		return this.http.get(`${this.hostName.travelUrl}settings/manualitineraries/`);
	}

	getManualItineraryByMissionId(missionId) {
		return this.http.get(`${this.hostName.travelUrl}settings/manualitinerary/${missionId}`);
	}

	addManualItinerary(itinerary) {
		return this.http.put(`${this.hostName.travelUrl}settings/manualitinerary/${itinerary.missionId}`, itinerary);
	}

	deleteManualItinerary(itinerary) {
		return this.http.delete(`${this.hostName.travelUrl}settings/manualitinerary/${itinerary.missionId}`);
	}
}
