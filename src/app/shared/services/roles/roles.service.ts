import { Injectable } from '@angular/core';
import { MTCUser } from 'mtc-modules';
import { Subject } from 'rxjs/Subject';
import { WindowRefService } from '../window-ref/';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class RolesService {
	isDeveloper = false;
	isTravelUser = false;
	isSchedulingUser = false;
	isGeneralServicesUser = false;
	isAssistanceUser = false;
	isGeneralUser = false;
	isEcclUser = false;
	isMedicalUser = false;
	isLoaded = false;
	isAuthorizedUser = false;
	isInfoDesk = false;

	private subject:Subject<any> = new Subject<any>();
	public get loaded(){
		if(this.isLoaded){
			this.windowRefService.getWindow().setTimeout(() => { this.subject.next(); },10);
		}
		return this.subject.asObservable();
	}

	constructor(
		private userService: MTCUser,
		private windowRefService: WindowRefService) {
		this.userService.getUser().subscribe(() => {
			this.isDeveloper = userService.hasRole('developer');
			this.isTravelUser = this.isDeveloper || userService.hasRole('mtc-travel');
			this.isSchedulingUser = this.isDeveloper || userService.hasRole('mtc-scheduling');
			this.isGeneralServicesUser = this.isDeveloper || userService.hasRole('mtc-general-services');
			this.isAssistanceUser = this.isDeveloper || userService.hasRole('mtc-assistance');
			this.isEcclUser = this.isDeveloper || userService.hasRole('mtc-ecclesiastical');
			this.isMedicalUser = userService.hasRole('mtc-medical');
			this.isInfoDesk = this.isDeveloper || userService.hasRole('mtc-info-desk');
			this.isAuthorizedUser = this.isGeneralUser		||
									this.isTravelUser		||
									this.isSchedulingUser	||
									this.isEcclUser			||
									this.isMedicalUser		||
									this.isInfoDesk;
			this.isLoaded = true;
			this.subject.next();
		});
	}

	get isOnlyGeneralUser(){
		return this.isGeneralUser && !this.isTravelUser && !this.isSchedulingUser && !this.isEcclUser && !this.isMedicalUser;
	}

	get canCreateConfidentialNotes(){
		return this.isEcclUser || this.isMedicalUser;
	}

	isUserInRole(role){
		return this.userService.hasRole(role);
	}
}
