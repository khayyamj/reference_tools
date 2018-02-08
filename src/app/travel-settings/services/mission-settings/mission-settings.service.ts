import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MissionSettingsService {
	constructor(private hostName: HostnameService,
				private http: HttpClient) { }

	setMissionSetting(mission: any) {
		return this.http.put(`${this.hostName.travelUrl}settings/missionconfig/${mission.missionId}`, mission);
	}
}

