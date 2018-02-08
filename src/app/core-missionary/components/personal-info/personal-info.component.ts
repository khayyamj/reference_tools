import { Component, OnInit } from '@angular/core';
import { MissionaryService } from '../../services';
import { RolesService } from '../../../shared';

@Component({
	selector: 'app-missionary-personal-info',
	templateUrl: './personal-info.component.html',
	styleUrls: ['./personal-info.component.less']
})


export class PersonalInfoComponent implements OnInit {

	missionary:any;
	currentContact: any;
	hasContact: boolean;

	constructor(public missionaryService: MissionaryService,
				public rolesService:RolesService) {
	}

	ngOnInit() {
		this.missionaryService.selectedMissionary.subscribe((miss) => {
			this.missionary = miss;
			if (this.missionary && this.missionary.contactList){
				//TODO: move this varible to model in the backend
				this.missionary.contactList = this.missionary.contactList.map((contact) => {contact.displayName = contact.contactType + ' - ' + contact.name; return contact;});
				this.currentContact = this.missionary.contactList[0];
			}
		});
	}

}
