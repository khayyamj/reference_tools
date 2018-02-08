import { Component, OnInit } from '@angular/core';
import { TrainingGroupService } from '../../../services';

@Component({
	selector: 'scheduling-training-group-personnel',
	templateUrl: './training-group-personnel.component.html',
	styleUrls: ['./training-group-personnel.component.less']
})
export class TrainingGroupPersonnelComponent implements OnInit {

	displayZoneCoordinator = false;
	displayTrainingCoordinator = false;
	displayTrainingManager = false;
	loading = true;
	public personnel = {teachers: [], zoneCoordinator: '', trainingCoordinator: '', trainingManager: ''};

	constructor(private trainingGroupService: TrainingGroupService) { }

	ngOnInit() {
		this.trainingGroupService.selectedTrainingGroup.subscribe((trainingGroup) => {
			this.loading = true;
			this.trainingGroupService.getPersonnel(trainingGroup.id).takeWhile((personnel:any) => {
				return personnel.id === trainingGroup.id;
			}).subscribe((personnel:any) => {
				this.personnel = personnel;
				if(Array.isArray(personnel.zoneCoordinator)) {
					this.personnel.zoneCoordinator = 'None';
				} else {
					this.displayZoneCoordinator = true;
				}
				if(Array.isArray(personnel.trainingCoordinator)) {
					this.personnel.trainingCoordinator = 'None';
				} else {
					this.displayTrainingCoordinator = true;
				}
				if(Array.isArray(personnel.trainingManager)) {
					this.personnel.trainingManager = 'None';
				} else {
					this.displayTrainingManager = true;
				}
				this.loading = false;
			});
		});
	}

}
