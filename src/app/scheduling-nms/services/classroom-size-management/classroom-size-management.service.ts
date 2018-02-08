import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostnameService } from '../../../shared';

@Injectable()
export class ClassroomSizeManagementService {

	constructor(private hostname: HostnameService,
		private http: HttpClient) { }

	getClassroomSizes() {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}scheduling/classroomsize`);
	}

	saveClassrooms(editedClassrooms) {
		return this.http.post(`${this.hostname.mtcToolsAPIUrl}scheduling/classroomsize`, editedClassrooms);
	}
}
