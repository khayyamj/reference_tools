import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsInfoService } from '../../../../shared';
import { TrainingGroupService } from '../../../services';

@Component({
	selector: 'app-training-group-edit',
	templateUrl: './training-group-edit.component.html',
	styleUrls: ['./training-group-edit.component.less']
})
export class TrainingGroupEditComponent implements OnInit {

	public config = {};
	public dialogType:string;
	public showConfirmation = false;
	public trainingGroup:any={};
	constructor(public toolsInfoService: ToolsInfoService,
				private trainingGroupService: TrainingGroupService,
				public dialogRef:MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

	ngOnInit() {
		this.trainingGroup = this.trainingGroupService.editTrainingGroup(this.dialogData);
		this.trainingGroup.effectiveDate=new Date();
		this.trainingGroup.schedule=this.toolsInfoService.info.schedules.find((schedule)=>schedule.name===this.trainingGroup.schedule.name);
	}

	cancel(){
		this.dialogType='cancel';
		this.config = {
			cancelButtonText: 'no',
			confirmationButtonText: 'yes',
			content: 'Are you sure you want to cancel changes?'
		};
		this.showConfirmation=true;
	}

	save(){
		this.config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'save',
			content: `Are you sure you want to save these changes?`
		};
		this.dialogType='save';
		this.showConfirmation=true;
	}

	confirmation(answer){
		this.showConfirmation=false;
		if(answer){
			if (this.dialogType === 'save') {
				const trainingGroup = this.trainingGroupService.saveGroupChanges();
				this.dialogRef.close(trainingGroup);
			} else {
				this.dialogRef.close();
			}
		}
	}
}
