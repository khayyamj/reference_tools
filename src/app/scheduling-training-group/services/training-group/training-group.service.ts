import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FutureChangesService } from '../../../scheduling-records/services/future-changes';

@Injectable()
export class TrainingGroupService {

	public trainingGroupToEdit: any = {};
	public trainingGroupToEditOrigin: any = {};
	private selectedTrainingGroupSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ id: 'search' });
	public isSearching = false;
	private trainingGroupArray = [];
	public trainingGroupsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.trainingGroupArray);
	private trainingGroup: any = {};
	public newMembers = [];
	constructor(private futureChangesService: FutureChangesService,
				private toolsInfoService: ToolsInfoService,
				private hostname: HostnameService,
				private http: HttpClient,
				private router: Router) {
	}

	saveGroupChanges() {
		let futureChange: any = {};
		const properties: any = ['schedule', 'language', 'trainingWeek', 'classroom']
			.filter((property) =>{
				return this.trainingGroupToEdit[property] && this.trainingGroupToEdit[property].name !== this.trainingGroupToEditOrigin[property].name;
			});

		const changes = properties.map((property) => {
			this.trainingGroup[property] = this.trainingGroupToEdit[property].name;
			futureChange = {
				fullName:this.trainingGroupToEdit.trainingGroup,
				changeType: property,
				futureValue: this.trainingGroupToEdit[property].id,
				effectiveDate: moment(this.trainingGroupToEdit.effectiveDate).format('MM/DD/YYYY'),
				mtcId: this.toolsInfoService.info.mtcId
			};
			if (property === 'trainingWeek') {
				futureChange.futureValue = this.trainingGroupToEdit[property].name;
			}
			return futureChange;
		});
		this.futureChangesService.createTrainingGroupsFutureChanges(changes).subscribe();
		return this.trainingGroup;
	}

	getHistory(trainingGroupId) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}training/missionary/changes/history/${trainingGroupId}`);
	}

	getPersonnel(trainingGroupId) {
		return this.http.get(`${this.hostname.missionaryUrl}traininggroups/personnel/${trainingGroupId}`);
	}

	get selectedTrainingGroup() {
		return this.selectedTrainingGroupSubject.asObservable();
	}

	get trainingGroups() {
		return this.trainingGroupsSubject.asObservable();
	}


	getTrainingGroup(id) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}traininggroups/${this.toolsInfoService.info.mtcId}/${id}`);
	}

	getTrainingGroups(type, searchText) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}traininggroups/search/${this.toolsInfoService.info.mtcId}/${type}?searchtext=${searchText}`);
	}

	getTrainingGroupFutureChanges (name) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}training/changes/${this.toolsInfoService.info.mtcId}?traininggroupname=${name}`);
	}

	getTrainingGroupsDateFilter(type, searchText, startDate, endDate) {
		return this.http.get(`${this.hostname.missionaryUrl}traininggroups/search/${this.toolsInfoService.info.mtcId}/${type}?searchtext=${searchText}&startdate=${startDate}&enddate=${endDate}`);
	}

	createTrainingGroup(trainingGroup) {
		['week', 'schedule', 'classroom', 'language', 'building','trainingGroup'].forEach((attr) => {
			if (trainingGroup[attr] && trainingGroup[attr].name) {
				trainingGroup[attr] = trainingGroup[attr].name;
			}
		});
		return this.http.post(`${this.hostname.mtcToolsAPIUrl}traininggroups/create`, trainingGroup);
	}

	isSelectedTrainingGroup(trainingGroup) {
		return this.selectedTrainingGroupSubject.getValue() && this.selectedTrainingGroupSubject.getValue().id === trainingGroup.id;
	}

	removeAllTrainingGroups() {
		this.trainingGroupArray = [];
		this.trainingGroupsSubject.next(this.trainingGroupArray);
		this.selectedTrainingGroupSubject.next({ id: 'search' });
		this.router.navigate(['scheduling/training-groups/search']);
	}

	addTrainingGroup(groupName, select) {
		const id = typeof groupName === 'object' ? groupName.id : groupName;
		const trainingGroup = this.trainingGroupArray.find((group) => {
			return group.id === id;
		});
		if (trainingGroup && select) {
			this.selectedTrainingGroupSubject.next(trainingGroup);
		} else if (!trainingGroup && id) {
			this.isSearching = true;
			this.getTrainingGroup(id).subscribe((group) => {
				this.isSearching = false;
				if (!_.isEmpty(group)) {
					this.trainingGroupArray.push(group);
					this.trainingGroupsSubject.next(this.trainingGroupArray);
					if (select) {
						this.selectedTrainingGroupSubject.next(group);
					}
				}
			});
		}
	}

	getTrainingGroupMembers(groupId) {
		return this.http.get(`${this.hostname.missionaryUrl}traininggroups/missionaries/${this.toolsInfoService.info.mtcId}/${groupId}`);
	}

	getTrainingGroupMissionaries(type, searchText) {
		this.isSearching = true;
		return this.http.get(`${this.hostname.missionaryUrl}traininggroups/missionaries/search/${this.toolsInfoService.info.mtcId}/${type}?searchtext=${searchText}`);
	}
	addMembersToTrainingGroup(members, trainingGroupId, startDate) {
		this.newMembers = members;
		members.forEach((member) => {
			member.trainingGroupId = trainingGroupId;
			member.startDate = startDate;
			member.delete = false;
		});
		return this.http.post(`${this.hostname.missionaryUrl}traininggroups/missionaries`, members);
	}
	deleteMembersFromTrainingGroup(members) {
		members.forEach((member) => {
			member.delete = true;
		});
		return this.http.post(`${this.hostname.missionaryUrl}traininggroups/missionaries`, members);
	}

	removeTrainingGroup(trainingGroup) {
		this.trainingGroupArray.splice(this.trainingGroupArray.indexOf(trainingGroup), 1);
		this.trainingGroupsSubject.next(this.trainingGroupArray);
		if (this.isSelectedTrainingGroup(trainingGroup) && this.trainingGroupArray.length) {
			this.selectedTrainingGroupSubject.next(this.trainingGroupArray[0]);
		} else {
			this.selectedTrainingGroupSubject.next({ id: 'search' });
			this.router.navigate(['scheduling/training-groups/search']);
		}
	}

	editTrainingGroup(trainingGroup) {
		this.trainingGroup = trainingGroup;
		this.trainingGroupToEditOrigin = {
			trainingGroup:trainingGroup.trainingGroup,
			id: trainingGroup.id,
			classroom: { name: trainingGroup.classroom },
			schedule: { name: trainingGroup.schedule },
			language: { name: trainingGroup.language },
			trainingWeek: { name: trainingGroup.week }
		};
		this.trainingGroupToEdit = _.cloneDeep(this.trainingGroupToEditOrigin);
		return this.trainingGroupToEdit;
	}

	getTrainingGroupFutureMissionaries(traininggroupid){
		return this.http.get(`${this.hostname.missionaryUrl}traininggroups/futuremissionaries/${this.toolsInfoService.info.mtcId}/${traininggroupid}`);
	}

}
