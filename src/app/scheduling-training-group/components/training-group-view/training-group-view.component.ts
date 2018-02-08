import { Component, OnInit } from '@angular/core';
import { TrainingGroupService } from '../../services';
import { TrainingGroupEditComponent } from './training-group-edit';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'scheduling-training-group-view',
	templateUrl: './training-group-view.component.html',
	styleUrls: ['./training-group-view.component.less']
})
export class TrainingGroupViewComponent implements OnInit {

	selectedTab = 'MEMBERS';
	trainingGroup: any;
	tabs = ['MEMBERS', 'TRAINING STAFF', 'HISTORY', 'FUTURE CHANGES'];

	constructor(private trainingGroupService: TrainingGroupService,
				private dialog: MatDialog) {
		this.trainingGroupService.selectedTrainingGroup.subscribe((group) => {
			this.trainingGroup = group;
		});
	}

	ngOnInit() {
	}

	editTrainingGroup() {
		this.dialog.open(TrainingGroupEditComponent, {
			data: this.trainingGroup,
			width: '395px',
			disableClose: true
		}).afterClosed().subscribe((dialogData) => {
			if (dialogData) {
				this.trainingGroup = dialogData;
			}
		});
	}
}
