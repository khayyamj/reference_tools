import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared/services';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CoreWidgetService {

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient) { }

	public getWeekDepartureCounts() {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}departures?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

	public getWeekDepartureCountsByDay(date) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}departures/${date}?mtcId=${this.toolsInfoService.info.mtcId}`);
	}

}
