import { Component, OnInit } from '@angular/core';
import { MissionaryService, MissionaryApiService } from '../../services';
import { RolesService, ToolsInfoService } from '../../../shared';
import * as _ from 'lodash';
import { TrainingGroupService } from '../../../scheduling-training-group';
import { MtcDatePipe } from 'mtc-modules';
@Component({
	selector: 'app-missionary-mtc-info',
	templateUrl: './mtc-info.component.html',
	styleUrls: ['./mtc-info.component.less']
})
export class MTCInfoComponent implements OnInit {

	missionary:any;
	missionaryClone;
	editTravel = false;
	editScheduling = false;
	userLoaded;
	active;
	languages;
	residences;
	sublanguages;
	trainingGroups;
	mailboxes;
	groupdates = [];
	schedules;
	trainingWeeks;
	statuses;
	substatuses;
	secureSubStatuses;
	branches;
	ecclgroups;
	constructor(private missionaryService: MissionaryService,
				private missionaryAPIService: MissionaryApiService,
				private rolesService: RolesService,
				private mtcDatePipe:MtcDatePipe,
				private trainingGroupService:TrainingGroupService,
				public toolsInfoService: ToolsInfoService) { }

	ngOnInit() {
		//TODO:SecureStatus and groupdates needs an end point
		this.missionaryService.selectedMissionary.subscribe((miss) => {
			this.missionary = miss;
			if(this.missionary.mtcInfo) {
				this.missionary.mtcInfo.trainingGroup = { id:this.missionary.mtcInfo.trainingGroupId };
			}
			this.missionaryClone = _.cloneDeep(miss);
		});
		this.trainingGroupService.getTrainingGroups('In-Residence','').subscribe((trainingGroups)=>{
			this.trainingGroups = trainingGroups;
		});
	}

	edit() {
		if(!this.userLoaded){
			this.rolesService.loaded.subscribe(()=>{
				this.userLoaded = true;
				this.setEditing();
			});
		} else {
			this.setEditing();
		}
	}

	save(){
		this.editTravel = false;
		this.editScheduling = false;
		this.missionaryClone = _.cloneDeep(this.missionary);
		this.missionary.mtcInfo.mtcArrival = this.mtcDatePipe.transform(this.missionary.mtcInfo.mtcArrival);
		this.missionary.mtcInfo.mtcActualArrival = this.mtcDatePipe.transform(this.missionary.mtcInfo.mtcActualArrival);
		this.missionary.mtcInfo.mtcActualDeparture = this.mtcDatePipe.transform(this.missionary.mtcInfo.mtcActualDeparture);
		this.missionary.mtcInfo.mtcDeparture = this.mtcDatePipe.transform(this.missionary.mtcInfo.mtcDeparture);
		this.missionaryAPIService.updateMissionary(this.missionary).subscribe();
	}
	cancel(){
		this.editTravel = false;
		this.editScheduling = false;
		this.missionary = _.cloneDeep(this.missionaryClone);
	}
	setEditing(){
		this.editScheduling = this.rolesService.isSchedulingUser;
		this.editTravel = this.rolesService.isTravelUser;
	}
	setChanges(changePropId, changePropName, event) {
		changePropId.includes('Status') ? this.missionary.personalInfo[changePropId] = event.id : this.missionary.mtcInfo[changePropId] = event.id;
		if(changePropName) {
			changePropName.includes('Status') ? this.missionary.personalInfo[changePropName] = event.name : this.missionary.mtcInfo[changePropName] = event.name;
		}
	}

	checkRolesForEdit(){
		return !this.editScheduling && !this.editTravel && !this.rolesService.isOnlyGeneralUser;
	}
}
