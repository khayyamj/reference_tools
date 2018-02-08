import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TrainingGroupService } from '../../../services';
import { TrainingGroupManageMembersComponent } from './training-group-manage-members';
import { CheckboxTableConfig, CheckboxTableColumn } from 'mtc-modules';

@Component({
	selector: 'scheduling-training-group-members',
	templateUrl: './training-group-members.component.html',
	styleUrls: ['./training-group-members.component.less']
})
export class TrainingGroupMembersComponent implements OnInit {

	showAddMembers: boolean;
	results = [];
	trainingGroup: any;
	columns: CheckboxTableColumn[] = [
		{ title: 'ID', attr: 'missionaryId' },
		{ title: 'TYPE', attr: 'type' },
		{ title: 'NAME', attr: 'fullName' },
		{ title: 'STATUS', attr: 'status' },
		{ title: 'SUB STATUS', attr: 'subStatus' },
		{ title: 'ARRIVAL DATE', attr: 'arrival', mtcDate: true },
		{ title: 'DEPARTURE DATE', attr: 'departure', mtcDate:true }
	];
	config: CheckboxTableConfig = {
		placeholder: 'There are no members assigned to this training group',
		topButtons: [
			{ text: 'Remove from Group', function: this.removeMembers.bind(this) }
		]
	};

	constructor(private dialog: MatDialog,
				private trainingGroupService: TrainingGroupService) {
					this.trainingGroupService.selectedTrainingGroup.subscribe((group) => {
						this.trainingGroup = group;
						this.refreshList();
					});
				}

	ngOnInit() {}

	refreshList() {
		this.trainingGroupService.getTrainingGroupMembers(this.trainingGroup.id).subscribe((member:any) => {
			this.results = member;
		});
	}

	openManageMembers() {
		this.dialog.open(TrainingGroupManageMembersComponent, {
			width: '400px'
		});
	}

	removeMembers(selectedMembers){
		this.trainingGroupService.deleteMembersFromTrainingGroup(selectedMembers).subscribe(() => {
			this.refreshList();
		});
	}
}
