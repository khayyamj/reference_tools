import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostnameService, ToolsInfoService } from '../../../shared/services';

@Injectable()
export class MissionApiService {

	constructor(private http: HttpClient,
		private hostname: HostnameService,
		private toolsInfoService: ToolsInfoService) { }

	getAssistance(missionId) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/assistance/inventory/mission/${missionId}`);
	}

	updateAssistance(missionId,assistanceItems,setToDefault){
		//TODO we need an endpoint that will accept an array of items
		assistanceItems.forEach((i) => {
			if(setToDefault){
				i.quantity = i.defaultQuantity;
			}
			i.missionUnitNum = missionId; //TODO something is wrong with one of the endpoints so this is neccessary
			this.http.put(`${this.hostname.mtcToolsAPIUrl}/assistance/inventory/mission`,i).subscribe();
		});
	}

}
