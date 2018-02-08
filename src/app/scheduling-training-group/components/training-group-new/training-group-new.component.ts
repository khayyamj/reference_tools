import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ToolsInfoService } from '../../../shared';
import { TrainingGroupService } from '../../services';
import { MTCToastService } from 'mtc-modules';


@Component({
	selector: 'app-training-group-new',
	templateUrl: './training-group-new.component.html',
	styleUrls: ['./training-group-new.component.less']
})
export class TrainingGroupNewComponent implements OnInit{

	trainingGroup:any = {};
	classrooms = [];
	classroom;

	showName = false;

	constructor(public toolsInfoService: ToolsInfoService,
				public dialogRef: MatDialogRef<any>,
				private trainingGroupService: TrainingGroupService,
				private toastService: MTCToastService) { }

	ngOnInit() {
		this.classrooms = this.toolsInfoService.info.classrooms;
	}

	getLayout() {
		return this.showName ? 'space-around' : 'flex-start';
	}

	save(form) {
		if(form.valid) {

			this.trainingGroup = {
				trainingGroup: form.value.trainingGroup,
				schedule: form.value.schedule.id,
				week: form.value.week.name,
				language: form.value.language.id,
				classroom: form.value.room.id,
				building: form.value.building.id,
				mtcId: this.toolsInfoService.info.mtcId
			};

			this.trainingGroupService.createTrainingGroup(this.trainingGroup).subscribe((newRoom:any) => {
				this.trainingGroupService.addTrainingGroup(newRoom.id, true);
				this.toastService.success(`Training Group saved <strong>successfully</strong>`);
				this.dialogRef.close();
			});
		}
	}

	onBuildingChosen(newBuilding, form) {
		if (newBuilding.input) {
			this.classrooms = this.toolsInfoService.info.classrooms;
		} else {
			this.classrooms = this.toolsInfoService.info.classrooms.filter(room => room.building === newBuilding.name);
			if (form.value.room && form.value.room.building !== newBuilding.name) {
				this.classroom = null;
			}
		}
	}
}
