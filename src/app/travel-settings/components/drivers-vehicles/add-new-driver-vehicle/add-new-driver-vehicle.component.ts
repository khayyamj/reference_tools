import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsInfoService } from '../../../../shared';
import * as _ from 'lodash';

@Component({
	selector: 'app-add-new-vehicle',
	templateUrl: './add-new-driver-vehicle.component.html',
	styleUrls: ['./add-new-driver-vehicle.component.less']
})
export class AddNewDriverVehicleComponent implements OnInit {
	selected:any = {};
	displayTitle;
	type;
	name;
	first:any = {};
	second:any = {};
	config;
	showConfirmation;

	constructor(public dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private dialogData: any,
				public toolsInfoService: ToolsInfoService, ) { }

	ngOnInit() {
		if (this.dialogData.selected) {
			this.selected = _.cloneDeep(this.dialogData.selected);
			this.selected.isEdit = true;
		} else {
			this.selected.isEdit = false;
		}
		this.type = this.dialogData.type.slice(0,-1);
		if(this.type === 'Driver'){
			this.name = this.selected.name;
			this.first.prop = 'firstName';
			this.first.placeholder = 'First Name';
			this.second.prop = 'lastName';
			this.second.placeholder = 'Last Name';
		} else {
			this.name = this.selected.vehicleName;
			this.first.prop = 'vehicleName';
			this.first.placeholder = 'Vehicle ID';
			this.second.prop = 'passengerCapacity';
			this.second.placeholder = 'Capacity';
		}

		this.displayTitle = (this.selected.isEdit ? 'Edit ' : 'Add ') + this.type;
	}

	save(form) {
		if(form.valid){
			this.config = {
				cancelButtonText: 'no',
				confirmationButtonText: 'yes',
				content: 'Are you sure want to save these changes?'
			};
			this.showConfirmation = true;
		}
	}

	confirmation(answer) {
		if (answer) {
			this.dialogRef.close(this.selected);
		}

		this.showConfirmation = false;
	}
}
