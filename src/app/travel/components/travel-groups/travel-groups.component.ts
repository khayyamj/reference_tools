import { Component, OnInit } from '@angular/core';
import { TravelGroupService } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'travel-travel-groups',
	templateUrl: './travel-groups.component.html',
	styleUrls: ['./travel-groups.component.less']
})
export class TravelGroupsComponent implements OnInit {

	loading = 1;
	myDate  = new Date();
	filter = 'all';
	searchText = '';
	missions = [];
	startedSingleLoad: boolean;
	groupId: string;

	constructor(private travelGroupService: TravelGroupService,
				private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params.subscribe((params: any) => {
			this.searchText = params['missionName'];
			this.groupId = params['groupId'];
			this.startedSingleLoad = false;
		});
		this.travelGroupService.getMissions().subscribe((missions: any[]) => {
			this.missions = missions.map((m) => {
				m.hideTravelGroups = true;
				return m;
			});
			this.loading--;
		});
	}

	get filteredMission() {
		return this.missions.filter((mission)=>{
			if (!this.searchText) {
				return false;
			} else if (this.searchText.toLowerCase() === mission.missionName.toLowerCase()) {
				if (!this.startedSingleLoad) {
					this.getTravelGroups(mission);
					this.startedSingleLoad = true;
				}
				return true;
			}
			const search=this.searchText.replace(/[^a-z\s'-]/gi,'');
			const regex: RegExp = new RegExp(`(^${search.toLowerCase()}|\\s${search.toLowerCase()})`);
			return mission.missionName.toLowerCase().match(regex) !== null;
		});
	}

	toggleTravelGroups(mission) {
		if (!mission.hideTravelGroups && mission.travelGroups) {
			mission.hideTravelGroups = true;
		} else {
			mission.hideTravelGroups = false;
			if (!mission.travelGroups) {
				this.getTravelGroups(mission);
			}
		}
	}

	toggleHideTravelers(tg) {
		tg.hideTravelers = !tg.hideTravelers;
	}

	getTravelGroups(mission) {
		this.loading++;
		this.travelGroupService.getTravelGroupByMissionId(mission.missionId).subscribe((travelGroups:any[]) => {
			if(travelGroups.length){
				mission.travelGroups = travelGroups.map((tg) => {
					tg.hideTravelers = !(tg.travelGroupId === this.groupId);
					mission.hideTravelGroups = false;
					return tg;
				});
			} else {
				mission.travelGroups = [];
			}
			this.loading--;
		});
	}

	isSenior(type) {
		return type === 'Senior Sister' || type === 'Couple';
	}

}
