import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeneralTravelNotesService {
	constructor(private hostName: HostnameService,
				private http: HttpClient) { }

	getGeneralNotes() {
		return this.http.get(`${this.hostName.travelUrl}settings/generalnotes/`);
	}

	setGeneralNotes(generalNotes) {
		return this.http.put(`${this.hostName.travelUrl}settings/generalnotes/`, generalNotes);
	}
}
