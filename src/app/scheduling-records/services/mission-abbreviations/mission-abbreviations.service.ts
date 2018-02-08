import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MissionAbbreviationService {

	public mission:any={};

	constructor(private hostname: HostnameService,
				private http: HttpClient) { }

	public setMissionAbbreviation(mission){
		return this.http.put(`${this.hostname.mtcToolsAPIUrl}missions`,mission);
	}

}
