import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { MtcDatePipe } from 'mtc-modules';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class NewMissionarySchedulingService {

	showGroupDate = true;
	earliestGroupDate;
	groupDate;
	get formattedGroupDate() {
		return this.mtcDate.transform(this.groupDate);
	}

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient,
				private mtcDate:MtcDatePipe) {}
	getScheduleDate(type, date = new Date()){
		//whether monday or wednesday
		type = type === 'Young' ? 3 : 1;
		this.groupDate = moment(new Date(date)).day(type);
		this.earliestGroupDate = moment().day(type);
		if(type  < moment().day()){
			this.earliestGroupDate.add(1,'w');
		}
		if(moment().isAfter(this.groupDate)){
			this.groupDate = this.earliestGroupDate;
		}
	}

	checkRunScheduling(){
		return this.earliestGroupDate.isSame(this.groupDate) ? '' : this.formattedGroupDate;
	}

	getScheduledMissionaries(listType,date=''){
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/scheduling/missionary/${this.toolsInfoService.info.mtcId}?groupDate=${date}&type=${listType}`);
	}

	getIncomingMissionaries() {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/projection/${this.toolsInfoService.info.mtcId}/${this.formattedGroupDate}`);
	}

	getExceptionMissionaries() {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/projection/exception/${this.toolsInfoService.info.mtcId}/${this.formattedGroupDate}`);
	}

	getScheduledSeniorMissionaries(listType?){
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/scheduling/senior/${this.toolsInfoService.info.mtcId}/${this.formattedGroupDate}/?type=${listType}`);
	}

	getCurriculumSeniorMissionaries(date){
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/projection/senior/${this.toolsInfoService.info.mtcId}/${date}`);
	}

	saveScheduledSeniorMissionaries(missionaries){
		return this.http.post(`${this.hostname.mtcToolsAPIUrl}scheduling/senior/finish`, missionaries);
	}

	saveScheduledYoungMissionary(missionary) {
		missionary = [missionary];
		return this.http.post(`${this.hostname.mtcToolsAPIUrl}scheduling/missionary`, missionary);
	}

	saveScheduledYoungMissionaries(missionaries) {
		return this.http.post(`${this.hostname.mtcToolsAPIUrl}scheduling/finish`, missionaries);
	}

	getIncomingSeniorMissionaries(groupDate) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/scheduling/senior/incoming/${this.toolsInfoService.info.mtcId}/${groupDate}`);
	}
	seniorIncomingSurvey(seniorMissionaryList) {
		this.http.post(`${this.hostname.mtcToolsAPIUrl}scheduling/senior/incoming/survey`, seniorMissionaryList);
	}

	updateSeniorMissionaryData(updatedSeniorMissionaries) {
		this.http.post(`${this.hostname.mtcToolsAPIUrl}scheduling/senior/incoming`, updatedSeniorMissionaries).subscribe();
	}
}
