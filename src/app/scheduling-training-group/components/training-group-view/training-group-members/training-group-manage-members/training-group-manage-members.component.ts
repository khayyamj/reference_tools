import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core';
import { TrainingGroupService } from '../../../../services';
import { MTCToastService, CheckboxTableConfig, CheckboxTableColumn } from 'mtc-modules';
import * as moment from 'moment';

@Component({
	selector: 'scheduling-training-group-manage-members',
	templateUrl: './training-group-manage-members.component.html',
	styleUrls: ['./training-group-manage-members.component.less']
})
export class TrainingGroupManageMembersComponent implements OnInit {
	@Output() membersAdded = new EventEmitter<any>();
	@Input() members;
	trainingGroup;
	date = moment();
	columns: CheckboxTableColumn[] = [
		{ title: 'ID', attr: 'missionaryId' },
		{ title: 'TYPE', attr: 'type' },
		{ title: 'NAME', attr: 'fullName' },
		{ title: 'STATUS', attr:'status'},
		{ title: 'COMPANION', attr: 'companions[0].fullName' },
		{ title: 'MISSION', attr: 'missionAbbreviation' },
		{ title: 'TRAINING LANG.', attr: 'language' },
		{ title: 'ARRIVAL DATE', attr: 'arrival', mtcDate: true },
		{ title: 'DEPARTURE DATE', attr: 'departure', mtcDate: true }
	];
	config: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Add', function: this.addMembers.bind(this) }
		]
	};

	results = [];
	searchText = '';
	type = 'Missionary';

	constructor(private trainingGroupService:TrainingGroupService,
				private mtcToastService: MTCToastService,) {
		this.trainingGroupService.selectedTrainingGroup.subscribe((group) => {
			this.trainingGroup = group;
		});
	}

	ngOnInit() {}

	search(){
		this.trainingGroupService.getTrainingGroupMissionaries(this.type,this.searchText).subscribe((results:any) => {
			this.results = results;
			this.trainingGroupService.isSearching = false;
		});
	}

	addMembers(selectedMembers){
		selectedMembers=selectedMembers.filter((member) => {
			return this.members.every(oldMember => oldMember.missionaryId !== member.missionaryId);
		});
		if(selectedMembers.length){
			this.trainingGroupService.addMembersToTrainingGroup(selectedMembers,this.trainingGroup.id, this.date.format('YYYY-MM-DD')).subscribe(()=>{
				this.mtcToastService.success( selectedMembers.length + ' Missionar' + (selectedMembers.length === 1 ? 'y': 'ies')+' <strong>successfully</strong> added');
				this.membersAdded.emit();
			});
		}
	}

	dateToMoment(data){
		this.date = moment(data);
	}
}
