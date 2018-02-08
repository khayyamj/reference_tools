import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ToolsInfoService } from '../../../shared';
import { Router } from '@angular/router';
import { MissionApiService } from '../mission-api';

@Injectable()
export class MissionService {

	constructor(private toolsInfoService: ToolsInfoService,
				private router: Router,
				private missionApiService: MissionApiService){

	}

	missionsArray = [];
	public isSearching = false;
	private selectedMissionSubject: BehaviorSubject<any> = new BehaviorSubject({ id: 'search' });
	public missionsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.missionsArray);

	get missions(){
		return this.missionsSubject.asObservable();
	}

	get selectedMission(){
		return this.selectedMissionSubject.asObservable();
	}

	addMission(groupName, select) {
		const id = typeof groupName === 'object' ? groupName.id : groupName;
		const mission = this.missionsArray.find(m => m.id === id);
		if (mission && select) {
			this.selectedMissionSubject.next(mission);
		} else if (!mission && id) {
			if(this.toolsInfoService.info.missions){
				this.emitAddedMission(id, select, this.toolsInfoService.info.missions);
			}else{
				this.toolsInfoService.isLoaded('missions').subscribe((missions) => {
					this.emitAddedMission(id, select, missions);
				});
			}
		}
	}

	emitAddedMission(id, select, missions){
		const mission = missions.find(m => m.id === id);
		this.missionsArray.push(mission);
		this.missionsSubject.next(this.missionsArray);
		if (select) {
			this.selectedMissionSubject.next(mission);
		}
		this.missionApiService.getAssistance(mission.id).subscribe((assistance) => {
			mission.assistance = assistance;
		});
	}

	isSelectedMission(mission) {
		return this.selectedMissionSubject.getValue() && this.selectedMissionSubject.getValue().id === mission.id;
	}

	removeAllMissions() {
		this.missionsArray = [];
		this.missionsSubject.next(this.missionsArray);
		this.selectedMissionSubject.next({ id: 'search' });
		this.router.navigate(['missions/search']);
	}

	removeMission(mission) {
		this.missionsArray.splice(this.missionsArray.indexOf(mission),1);
		this.missionsSubject.next(this.missionsArray);
		if(this.isSelectedMission(mission) && this.missionsArray.length){
			this.selectedMissionSubject.next(this.missions[0]);
		}else{
			this.selectedMissionSubject.next({ id: 'search' });
			this.router.navigate(['missions/search']);
		}
	}

}
