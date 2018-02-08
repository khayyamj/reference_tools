import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToolsInfoService } from '../../../../shared';
import { NewMissionarySchedulingService } from '../../../services';
import * as _ from 'lodash';


@Component({
	selector: 'app-edit-senior-missionary-modal',
	templateUrl: './senior-missionary-edit-modal.component.html',
	styleUrls: ['./senior-missionary-edit-modal.component.less']
})
export class EditSeniorMissionaryModalComponent implements OnInit {
	missionaries: Array<any>;
	validate: any = {};
	keys = ['bringingCar','accommodations','needs'];
	selects = {
		bringingCar:{
			placeholder: 'Bringing a Car',
			list: this.toolsInfo.info.booleanList
		},
		accommodations:{
			placeholder: 'Accommodations',
			list: this.toolsInfo.info.booleanList
		},
		needs: {
			placeholder: 'Needs',
			list: this.toolsInfo.info.needs
		}
	};

	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private data: any,
				private toolsInfo: ToolsInfoService,
				private newMissionarySchedulingService:NewMissionarySchedulingService) {}

	ngOnInit() {
		this.missionaries = this.data;
		if(this.missionaries.length < 3){
			this.keys.forEach((key)=>{
				if(typeof this.missionaries[0][key] === 'string'){
					this.validate[key] = this.missionaries[0][key] === 'Yes' ? '1' : '0';
				} else{
					this.validate[key] = this.missionaries[0][key] || [];
				}
			});
			if(this.validate.needs.length) {
				this.validate.needs = this.toolsInfo.info.needs[this.validate.needs.length === 1 ? this.validate.needs[0].id - 1 : 2].id;
			}
		}
	}

	onSave() {
		let update = false;
		this.keys.forEach((key)=>{
			if(!_.isEqual(this.validate[key],this.missionaries[0][key]) || (typeof this.validate[key] !== 'undefined' && this.missionaries.length > 1)){
				update = true;
				this.missionaries.forEach((missionary) => {
					let newValue = this.validate[key];
					if(key === 'needs') {
						newValue = newValue ? [this.toolsInfo.info.needs[newValue -1]] : this.toolsInfo.info.needs.slice(0,2);
					}
					missionary[key] = newValue;
				});
			}
		});

		if(update){
			this.newMissionarySchedulingService.updateSeniorMissionaryData(this.missionaries);
			this.missionaries.map((missionary) => {
				missionary.selected = false;
				missionary.accommodations = missionary.accommodations === '1' ? 'Yes' : 'No';
				missionary.bringingCar = missionary.bringingCar === '1' ? 'Yes' : 'No';
			});
			this.dialogRef.close(this.missionaries);
		} else {
			this.dialogRef.close();
		}
	}
}
