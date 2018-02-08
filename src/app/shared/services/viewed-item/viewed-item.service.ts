import { Injectable } from '@angular/core';
import { HostnameService } from '../hostname/hostname.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ViewedItemService {

	constructor(private hostname: HostnameService,
				private http: HttpClient) { }

	public getLastViewedList(id:string){
		return this.http.get(`${this.hostname.travelUrl}vieweditem/` + id);
	}

	public setNewViewed(viewedObj){
		return this.http.put(`${this.hostname.travelUrl}vieweditem/`, viewedObj);
	}

}
