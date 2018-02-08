import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared/services';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SchedulingWidgetService {

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient) { }

}
