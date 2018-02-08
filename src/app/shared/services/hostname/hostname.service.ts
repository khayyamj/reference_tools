import { Injectable } from '@angular/core';
import { WindowRefService } from '../window-ref';

@Injectable()
export class HostnameService {
	_url = 'http://localhost:8080/';
	_env = 'dev';

	constructor(private windowRefService: WindowRefService) {
		this.init();
	}

	init(){
		const win = this.windowRefService.getWindow();
		if (win.location.hostname.includes('support-apps.mtc.byu.edu')) {
			this.url = 'https://supportapplications.mtc.byu.edu/';
			this.env = 'support';
		} else if (win.location.hostname.includes('test-apps.mtc.byu.edu') || win.location.hostname.includes('test2.mtc.byu.edu')) {
			this.url = 'https://testapplications.mtc.byu.edu/';
			this.env = 'test';
		} else if (win.location.hostname.includes('stage-apps.mtc.byu.edu') || win.location.hostname.includes('stage.mtc.byu.edu')) {
			this.url = 'https://stageapplications.mtc.byu.edu/';
			this.env = 'stage';
		} else if (win.location.hostname.includes('beta-apps.mtc.byu.edu')) {
			this.url = 'https://betaapplications.mtc.byu.edu/';
			this.env = 'beta';
		} else if (win.location.hostname.includes('dev-apps.mtc.byu.edu') || win.location.hostname.includes('test1.mtc.byu.edu')) {
			this.url = 'https://devapplications.mtc.byu.edu/';
			this.env = 'dev';
		} else if (win.location.hostname.includes('cdn.mtc.byu.edu') ||
					win.location.hostname.includes('apps.mtc.byu.edu')) {
			this.url = 'https://app.mtc.byu.edu/';
			this.env = '';
		} else {
			this.url = 'http://localhost:8080/';
			this.env = 'dev';
		}
	}

	set url(value){
		this._url = value;
	}

	set env(value){
		this._env = value;
	}

	get env(){
		return this._env === '' ? 'prod' : this._env;
	}

	get url(){
		return this._url;
	}

	get travelUrl(){
		return `${this._url}travel/v2/`;
	}

	get missionarySystemsUrl(){
		return `${this._url}missionarysystems${this._env}/v1/`;
	}

	get mtcAPIUrl(){
		return `${this._url}mtc/v2/`;
	}

	get hostname(){
		return this.windowRefService.getWindow().location.hostname;
	}

	get mtcToolsAPIUrl(){
		return `${this._url}mtctools/v1/`;
	}

	get standardsUrl(){
		return 'https://app.mtc.byu.edu/standards/v1/'; // we always want prod
	}

	get missionaryUrl(){
		return `${this._url}missionary/v2/`;
	}

	get noteUrl(){
		return `${this._url}note/v1/`;
	}
}
