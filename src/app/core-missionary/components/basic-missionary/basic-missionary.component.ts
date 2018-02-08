import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../shared';
import { MissionaryService } from '../../services';
import * as _ from 'lodash';

@Component({
	selector: 'app-basic-missionary',
	templateUrl: './basic-missionary.component.html',
	styleUrls: ['./basic-missionary.component.less']
})
export class BasicMissionaryComponent implements OnInit {
	@Input() set missionary(missionary) {
		this._missionary = missionary;
		this.hasRestrictedContacts = this.missionary.contactList.some((contact) => {
			return contact.doNotContact;
		});
	}
	get missionary(){
		return this._missionary;
	}
	@Input() toggle = false;
	showPicture;
	hasRestrictedContacts;
	_missionary: any = {};
	constructor(private missionaryService: MissionaryService, private configService: ConfigService, ) { }

	ngOnInit() {
		this.configService.loaded.subscribe(() => {
			if (this.configService.getConfig('Missionary Profile', 'showPicture')) {
				this.showPicture = this.configService.getConfig('Missionary Profile', 'showPicture').value === '1';
			}
		});
	}

	getPicture() {
				if(this.showPicture) {
					return this.missionaryService.getPicture(this.missionary);
				} else {
					return this.missionaryService.getPicture({});
				}
			}

	setFilter(checked) {
				this.showPicture = checked;
				const v = checked ? '1' : '0';
				this.configService.setConfig('Missionary Profile', 'showPicture', v).subscribe();
			}

	showToggle() {
				return this.toggle && !_.isNil(this.showPicture);
			}
}
