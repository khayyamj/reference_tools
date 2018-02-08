import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NapiDataService {

	public missionary:any={};

	constructor(private hostname: HostnameService,
		private http: HttpClient) { }

	public getNapiData(id?) {
		if (id) {
			return this.http.post(`${this.hostname.mtcToolsAPIUrl}slcrefresh/${id}`, id, {responseType:'text'});
		} else {
			return this.http.post(`${this.hostname.mtcToolsAPIUrl}slcrefresh`, id, {responseType:'text'});
		}
	}

}
