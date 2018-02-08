import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TempAssignmentsService {

	constructor(private hostName: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient) { }

	getAllMissions() {
		return this.http.get(`${this.hostName.travelUrl}tempassignment/allmissions/`);
	}
	getAllTempAssignments(){
		return this.http.get(`${this.hostName.travelUrl}tempassignment?mtcId=${this.toolsInfoService.info.mtcId}`);
	}
	getTempAssignment(missionaryId: string) {
		return this.http.get(`${this.hostName.travelUrl}tempassignment/${missionaryId}`);
	}
	setTempAssignments(tempAssignments) {
		return this.http.put(`${this.hostName.travelUrl}tempassignment/tempassignment/`, tempAssignments);
	}
	setTempAssignmentEmail(id: string) {
		return this.http.put(`${this.hostName.travelUrl}tempassignment/tempassignmentemail/${id}`, null, { responseType: 'text' });
	}
	deleteTempAssignment(id: string) {
		return this.http.delete(`${this.hostName.travelUrl}tempassignment/${id}`, { responseType: 'text' });
	}

}
