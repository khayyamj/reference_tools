import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostnameService, ToolsInfoService } from '../../../shared/services';

@Injectable()
export class MissionaryApiService {

	constructor(private http: HttpClient,
				private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService) { }

	getMissionaryById(missionaryId) {
		return this.http.get(`${this.hostname.missionaryUrl}missionaries/${missionaryId}?includePersonalInfo=true&includeMTCInfo=true&includeMissionInfo=true&includeChangeHistory=true&includeContacts=true&includeUnitInfo=true&includeTravelInfo=true`);
	}

	getMissionaryNotesById(missionaryId) {
		return this.http.get(`${this.hostname.missionaryUrl}missionaries/${missionaryId}?includeNotes=true`);
	}

	getMissionarySearchHistory(){
		return this.http.get(`${this.hostname.missionaryUrl}missionaries/history`);
	}

	getMissionaries(searchOptions, query, searchByMission = false){
		const searchQueries = `preMTC=${searchOptions.preMTC}
								&scheduled=${searchOptions.scheduled}
								&inResidence=${searchOptions.inResidence}
								&departed=${searchOptions.departed}
								&mtcId=${this.toolsInfoService.info.mtcId}`;
		return this.http.get(`${this.hostname.missionaryUrl}missionaries?${searchQueries}&query=${query}&searchByMission=${searchByMission}`);
	}


	createNewMissionary(dataset){
		return this.http.post(`${this.hostname.missionaryUrl}create/missionaries`, dataset);
	}

	getMissionarySchedule(id,date){
		return this.http.get(`${this.hostname.missionaryUrl}missionaries/schedule/${id}/${date}`);
	}

	updateMissionary(missionary){
		return this.http.put(`${this.hostname.missionaryUrl}missionaries/update`,missionary);
	}

	createMissionaryRecord(newRecord){
		return this.http.post(`${this.hostname.missionaryUrl}create`, newRecord);
	}

	getMissionaryBrowsingHistory(missionaryId) {
		return this.http.get(`${this.hostname.missionaryUrl}missionaries/${missionaryId}/browsing-history`);
	}
}
