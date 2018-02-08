import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { MtcDatePipe } from 'mtc-modules';

@Injectable()
export class DepartureGroupService {

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient,
				private mtcDate: MtcDatePipe) { }

	public getTrainTimesForDate(date: Date) {
		return this.http.get(`${this.hostname.travelUrl}departure-groups/train-times?date=${this.mtcDate.transform(date)}`);
	}

	public getDepartureGroupsByDate(startDate, endDate) {
		return this.http.get(`${this.hostname.travelUrl}departure-groups?mtcId=${this.toolsInfoService.info.mtcId}&startDate=${startDate}&endDate=${endDate}`);
	}

	public getDepartureGroupItem(departureGroupItem) {
		return this.http.get(`${this.hostname.travelUrl}departure-groups/item/${departureGroupItem.departureGroupItemId}/${departureGroupItem.travelGroupLeader}`);
	}

	public updateDepartureGroupItem(departureGroupItem) {
		return this.http.put(`${this.hostname.travelUrl}departure-groups/item`, departureGroupItem);
	}

	public createDepartureGroup(group) {
		return this.http.post(`${this.hostname.travelUrl}departure-groups/`, group);
	}

	public deleteDepartureGroup(id) {
		return this.http.delete(`${this.hostname.travelUrl}departure-groups/${id}`);
	}

	public getHidePastUserConfig() {
		return this.http.get(`${this.hostname.travelUrl}departure-groups/hidepast`);
	}

	public getDepartureGroupTypes() {
		return this.http.get(`${this.hostname.travelUrl}departure-groups/types`);
	}

	public updateDriverVehicle(id,newDriverVehicles) {
		return this.http.put(`${this.hostname.travelUrl}departure-groups/${id}/driver-vehicle`, newDriverVehicles);
	}

	public updateNote(note){
		return this.http.put(`${this.hostname.travelUrl}departure-groups/note/`, note);
	}

	public createNote(note) {
		return this.http.post(`${this.hostname.travelUrl}departure-groups/note/${note.dgId}`, note);
	}

	public deleteNote(id) {
		return this.http.delete(`${this.hostname.travelUrl}departure-groups/note/${id}`);
	}

}
