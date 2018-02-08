import { Component, OnInit, HostBinding } from '@angular/core';
import { MissionService } from '../../services';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-mission-main',
	templateUrl: './mission-main.component.html',
	styleUrls: ['./mission-main.component.less']
})
export class MissionMainComponent implements OnInit {

	missions:any;
	currentMission;

	@HostBinding('attr.flex') flex = '';

	constructor(public missionService: MissionService,
				private router: Router,
				private route: ActivatedRoute) {
					this.route.queryParams
						.map(params => params['missionid'] || '')
						.subscribe((missionId) => {
							this.currentMission = {id:missionId};
							this.missionService.addMission(missionId,true);
							if(!missionId){
								this.openSearchPage();
							}
						});
				}

	ngOnInit() {
		this.missionService.missionsSubject.subscribe((missions) => {
			this.missions = missions;
		});

		this.missionService.selectedMission.subscribe((mission) => {
			this.currentMission = mission;
		});
	}

	onTabClicked(event){
		if(event.id !== 'search && event.id'){
			this.router.navigate(['/missions/search/view'], { queryParams: { 'missionid': event.id } });
		}
	}

	openSearchPage(){
		this.router.navigate(['missions/search']);
	}

}
