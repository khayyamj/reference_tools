import { Component } from '@angular/core';
import { RolesService, HostnameService, ToolsInfoService } from './shared/';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent {
	openMobileSideMenu: Boolean = false;
	toastOptions = {
		position: ['bottom', 'right'],
		timeOut: 4000,
		showProgressBar: false,
		animate: 'fromLeft'
	};
	apiUrls = [
		`${this.hostName.mtcToolsAPIUrl}version`,
		`${this.hostName.travelUrl}version`,
		`${this.hostName.mtcAPIUrl}version`,
		`${this.hostName.missionaryUrl}version`
	];

	constructor(public rolesService: RolesService,
		private hostName: HostnameService,
		private toolsInfoService: ToolsInfoService) {
		toolsInfoService.init();
	}

}
