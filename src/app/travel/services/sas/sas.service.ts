import { Injectable } from '@angular/core';
import { HostnameService, WindowRefService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SASService {

	constructor(private hostName: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient,
				private windowRefService: WindowRefService) { }

	goToPrintout(queryParams: String, individual: boolean, travelOffice: boolean) {
		this.getUserInfo().subscribe((userInfo:any) => {
			const token = this.windowRefService.getWindow().btoa(MTCAuth.getToken().accessToken);
			const username = userInfo.username;
			const password = userInfo.password;
			const env = this.hostName.env;
			const envNum = this.getEnvNum(env);
			if(individual){
				const url = `https://sasweb.mtc.byu.edu:8343/SASStoredProcess/do?_program=%2FShared+Data%2F${envNum}_${env}%2FAppAdmin%2FTravel%2FSP_IndividualItinerariesPDFReport_${env}&mtcin=${this.toolsInfoService.info.mtcId}&_username=${username}&_password=${password}&authorization=${token}${queryParams}`;
				this.windowRefService.getWindow().open(url);
			}
			if(travelOffice){
				const url = `https://sasweb.mtc.byu.edu:8343/SASStoredProcess/do?_program=%2FShared+Data%2F${envNum}_${env}%2FAppAdmin%2FTravel%2FSP_OfficeItinerariesPDFReport_${env}&mtcin=${this.toolsInfoService.info.mtcId}&_username=${username}&_password=${password}&authorization=${token}${queryParams}`;
				if(individual){
					this.windowRefService.getWindow().setTimeout(() => {
						this.windowRefService.getWindow().open(url);
					},2000);
				}else{
					this.windowRefService.getWindow().open(url);
				}
			}
		});
	}

	printBetweenDates(startDate, endDate, individual: boolean, office: boolean, sendEmail: Number){
		const queryParam = `&wkstartin=${startDate}&wkendin=${endDate}&sendemails=${sendEmail}`;
		this.goToPrintout(queryParam,individual,office);
	}

	createIndividualItinerary(missionaryId, travelGroupId, sendEmail: Number){
		const queryParams = `&midin=${missionaryId}&tgidin=${travelGroupId}&sendemails=${sendEmail}`;
		this.goToPrintout(queryParams, true, false);
	}

	createGroupItinerary(travelGroupId, individual: boolean, travelOffice: boolean, sendEmail: Number){
		const queryParams = `&tgidin=${travelGroupId}&sendemails=${sendEmail}`;
		this.goToPrintout(queryParams, individual, travelOffice);
	}

	getEnvNum(env) {
		let num = 1;
		switch(env){
			case 'prod':
				num = 1;
				break;
			case 'test':
				num = 2;
				break;
			case 'dev':
				num = 3;
				break;
			case 'support':
				num = 4;
				break;
			case 'stage':
				num = 5;
				break;
			case 'beta':
				num = 6;
				break;
		}
		return num;
	}

	getUserInfo() {
		return this.http.get(`${this.hostName.travelUrl}sas`);
	}

}
