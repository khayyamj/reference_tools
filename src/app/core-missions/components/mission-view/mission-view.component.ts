import { Component, OnInit } from '@angular/core';
import { MissionService } from '../../services';
import { RolesService } from '../../../shared';

@Component({
	selector: 'app-mission-view',
	templateUrl: './mission-view.component.html',
	styleUrls: ['./mission-view.component.less']
})
export class MissionViewComponent implements OnInit {

	mission:any;
	tabs = ['CONTACTS'];
	tabIndex = 0;
	constructor(private missionService: MissionService,
				private rolesService: RolesService) { }

	ngOnInit() {
		this.missionService.selectedMission.subscribe(mission => this.mission = mission);
		this.rolesService.loaded.subscribe(() => {
			this.tabs = ['CONTACTS'];
			if(this.rolesService.isTravelUser){
				this.tabs.push('TRAVEL');
			}

			if(this.rolesService.isSchedulingUser){
				this.tabs.push('ASSISTANCE');
			}
		});
	}

	isOnTab(tab){
		return this.tabs[this.tabIndex] === tab;
	}

}
