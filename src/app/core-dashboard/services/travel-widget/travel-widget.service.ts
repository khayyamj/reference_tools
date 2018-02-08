import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared/services';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TravelWidgetService {

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient) { }

	public getMissingTravelPackets() {
		return this.http.get(`${this.hostname.travelUrl}packets?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

	public resolveTravelPacketStatus(packet) {
		return this.http.put(`${this.hostname.travelUrl}packets`, packet);
	}

	public getNoItineraryMissionaries() {
		return this.http.get(`${this.hostname.travelUrl}dashboard/noitineraries?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

	public getNonMatchingItineraryMissionaries() {
		return this.http.get(`${this.hostname.travelUrl}dashboard/nonmatchingitineraries?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

	public ignoreTravelGroups(tgids: string) {
		return this.http.post(`${this.hostname.travelUrl}dashboard/ignore`, tgids, {responseType: 'text'});
	}

}
