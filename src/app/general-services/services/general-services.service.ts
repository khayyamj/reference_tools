import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToolsInfoService, HostnameService } from '../../shared/';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/take';

@Injectable()
export class GeneralServicesService {

	constructor(private hostname: HostnameService,
		private toolsInfoService: ToolsInfoService,
		private http: HttpClient) { }

	public getServiceAssignments() {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}generalservices/service`).map((services:any[]) => {
			services.forEach((s,i) => s.id = i);
			return services;
		});
	}


	//TODO implement mailbox methods in tools api
	public getMailboxes() {
		const subject = new Subject<any>();
		const source = Observable
			.interval(500)
			.timeInterval()
			.take(1);
		source.subscribe(() => {
			subject.next(
				this.toolsInfoService.info.mailboxes.map((m) => {
					return {
						id:m.id,
						name:m.name,
						combination: Math.floor(Math.random() * 900000) + 100000
					};
				})
			);
		});
		return subject.asObservable();
	}

	public deleteMailbox(mailbox){

	}

	public deleteMailboxes(mailboxes){

	}

	public upsertMailbox(mailbox){

	}

	public upsertAssignment(assignment){

	}

	public deleteAssignment(assignment){

	}



}
