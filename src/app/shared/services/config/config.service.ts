import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WindowRefService } from '../window-ref/';
import { HostnameService } from '../hostname/hostname.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
	configs:any[];
	isLoaded = false;

	public get loaded(){
		const subject:Subject<any> = new Subject<any>();
		if(this.isLoaded){
			this.windowRefService.getWindow().setTimeout(() => { subject.next(); },10);
		}else{
			this.getConfigs().subscribe((configs:any[]) => {
				this.configs = configs;
				this.isLoaded = true;
				subject.next();
			});
		}
		return subject.asObservable();
	}

	constructor(
		private http: HttpClient,
		private hostName: HostnameService,
		private windowRefService: WindowRefService) {
	}

	getConfigs(){
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}userconfigs`);
	}

	setConfigs(configs){
		this.configs = configs;
		return this.http.put(`${this.hostName.mtcToolsAPIUrl}userconfigs`, configs);
	}

	getConfig(configGroup,name){
		return this.configs.find((config) => {
			return config.configGroup === configGroup && config.name === name;
		});
	}

	setConfig(configGroup,name,value){
		const config = this.getConfig(configGroup,name);
		config.value = value;
		return this.http.put(`${this.hostName.mtcToolsAPIUrl}userconfig`, config, {responseType: 'text'});
	}
}
