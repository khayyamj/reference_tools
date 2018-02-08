import { Component, Input } from '@angular/core';
import { TrainingGroupService } from '../../../services/training-group';
import { CheckboxTableConfig, CheckboxTableColumn } from 'mtc-modules';
import * as moment from 'moment';

@Component({
	selector: 'scheduling-training-group-history',
	templateUrl: './training-group-history.component.html',
	styleUrls: ['./training-group-history.component.less']
})
export class TrainingGroupHistoryComponent {
	@Input() trainingGroup = { id: 123 };
	history = {
		addedMissionaries:[],
		removedMissionaries:[]
	};
	changeType = 'groupChanges';
	id;
	type;
	name;
	previousGroupId;
	updatedBy;
	updatedDate;
	enddate;
	columns: CheckboxTableColumn[] = [
		{ title: 'Id', attr:'missionaryId'},
		{ title: 'Type', attr:'type'},
		{ title: 'Missionary' , attr:'fullName'},
		{ title: 'Previous Group' , attr:'trainingGroupId'},
		{ title: 'Change Made By' , attr:'updatedBy'},
		{ title: 'Addition Date and Time', attr:'updatedDateString' }
	];
	newColumns: CheckboxTableColumn[] = [
		{ title: 'Id', attr:'missionaryId'},
		{ title: 'Type', attr:'type'},
		{ title: 'Missionary' , attr:'fullName'},
		{ title: 'New Group' , attr:'trainingGroupId'},
		{ title: 'Change Made By' , attr:'updatedBy'},
		{ title: 'Addition Date and Time', attr:'updatedDateString' }
	];
	config: CheckboxTableConfig = {
		placeholder: 'No history available'
	};

	constructor(private trainingGroupService: TrainingGroupService) {
		this.trainingGroupService.selectedTrainingGroup.subscribe((trainingGroup) => {
			this.trainingGroup = trainingGroup;
			this.trainingGroupService.getHistory(this.trainingGroup.id).subscribe((data: any) => {
				for (const prop in data) {
					if (data.hasOwnProperty(prop) && data[prop]) {
						data[prop].forEach((missionary) => {
							missionary.updatedDateString = moment(missionary.updatedDate).format('MM/DD/YY h:mm A').toString();
						});
					}
				}
				Object.assign(this.history, data);
			});
		});
	}

}
