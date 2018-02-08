import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MissionaryInfoService {
	//TODO should these functions be in the missionaryService?

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient) { }

	public getDistricts(branch){
		return this.http.get(`${this.hostname.missionaryUrl}${branch}/districts`);
	}

	public getOccupantsByRoom (room) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}room/occupants/${this.toolsInfoService.info.mtcId}/${room}`);
	}

}
