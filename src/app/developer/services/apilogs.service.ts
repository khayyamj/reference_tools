import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../shared';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Injectable()
export class ApiLogsService {

	logs = [];
	loading = false;

	constructor(private hostname:HostnameService,
				private toolsInfoService:ToolsInfoService,
				private http:HttpClient,
				private datePipe:DatePipe) {
	}
	getLogs(startDate: any, endDate: any) {
		const parameters = '?startDate=' + startDate.format('DD MMM YYYY') + '&endDate=' + endDate.format('DD MMM YYYY');
		this.loading = true;
		this.http.get(`${this.hostname.mtcToolsAPIUrl}apilog?startDate=${startDate.format('DD MMM YYYY')}&endDate=${endDate.format('DD MMM YYYY')}`).subscribe((response:any) => {
			this.logs = response;
			this.loading = false;
		});
	}

}
