import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared/services/hostname/hostname.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChangeService {

	constructor(private hostName: HostnameService,
				private http: HttpClient) { }

	createChange(change){
		return this.http.post(`${this.hostName.missionaryUrl}change`,change);
	}

}
