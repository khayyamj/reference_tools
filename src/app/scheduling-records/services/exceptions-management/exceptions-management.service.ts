import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ExceptionsManagementService {

	public exceptionToEdit;

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient) { }

	public getActiveExceptions(){
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}exceptions/active/${this.toolsInfoService.info.mtcId}`);
	}

	public getInactiveExceptions(){
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}exceptions/inactive/${this.toolsInfoService.info.mtcId}`);
	}

	public activateExceptions(list){
		return this.http.put(`${this.hostname.mtcToolsAPIUrl}exceptions/activate`, list);
	}

	public deactivateExceptions(list){
		return this.http.put(`${this.hostname.mtcToolsAPIUrl}exceptions/deactivate`, list);
	}
	public deleteException(list){
		return this.http.put(`${this.hostname.mtcToolsAPIUrl}exceptions`,list);
	}

}
