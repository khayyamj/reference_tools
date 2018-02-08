import { Component, OnInit } from '@angular/core';
import { TravelGroupService } from '../../../travel/';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EditMissionSettingsComponent } from './edit-mission-settings';
import * as _ from 'lodash';

@Component({
	selector: 'travel-settings-mission',
	templateUrl: './mission-settings.component.html',
	styleUrls: ['./mission-settings.component.less']
})
export class MissionSettingsComponent implements OnInit {
	searchText = '';
	missions: any[] = [];

	constructor(private travelGroupService: TravelGroupService,
				private dialog: MatDialog,
				private router: Router,) {}

	ngOnInit() {
		this.travelGroupService.getMissions().subscribe((missions:any) => {
			this.missions = missions;
		});
	}

	isBoolean(bool){
		return _.isBoolean(bool);
	}

	shouldShowMission(mission) {
		return !this.searchText || _.includes(mission.missionName.toLowerCase(), this.searchText.toLowerCase()) ||
			_.includes(mission.missionAbbreviation.toLowerCase(), this.searchText.toLowerCase());
	}

	onEdit(mission) {
		this.dialog.open(EditMissionSettingsComponent,{
			data:mission,
			width:'1200px'
		});
	}

	back(){
		this.router.navigate(['/travel/settings']);
	}
}
