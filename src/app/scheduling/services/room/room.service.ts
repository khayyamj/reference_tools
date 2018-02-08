import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RoomService {

	roomsData = {residence: [], classroom: []};

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient) { }

	searchRooms (type, searchtext) {
		return this.http.get(`${this.hostname.mtcAPIUrl}mtcs/rooms/search/${this.toolsInfoService.info.mtcId}/${type}?searchtext=${searchtext}`);
	}

}
