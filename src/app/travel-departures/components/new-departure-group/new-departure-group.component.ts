import { Component, OnInit } from '@angular/core';
import { DepartureGroupService } from '../../services';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
	selector: 'travel-new-departure-group',
	templateUrl: './new-departure-group.component.html',
	styleUrls: ['./new-departure-group.component.less']
})
export class NewDepartureGroupComponent implements OnInit {
	newDepartureGroup: any;
	destinations = [];
	today = moment();
	show = '';
	constructor(private departureGroupService: DepartureGroupService,
				private dialogRef:MatDialogRef<any>,
				public fb: FormBuilder) {
				this.newDepartureGroup = fb.group({
						mtcDepartureDate: [moment(), Validators.required],
						departureGroupType:['',Validators.required]
				});
	}

	ngOnInit() {
		this.departureGroupService.getDepartureGroupTypes().subscribe((typesResponse:any) => {
			this.destinations = typesResponse;
		});
	}

	setForm(selected){
		const inputs = ['time', 'frontRunnerTime'];
		const index = selected.name === 'Train Station';
		const startValue = index ? '' : this.today;
		this.show = inputs[+index];
		this.newDepartureGroup.get('departureGroupType').setValue(selected);
		this.newDepartureGroup.registerControl(this.show, new FormControl(startValue,Validators.required));
		this.newDepartureGroup.removeControl(inputs[+!index]);
	}

	save() {
		if(this.newDepartureGroup.valid) {
			const newGroup = this.newDepartureGroup.value;
			if(newGroup.departureGroupType.name === 'Train Station'){
				newGroup.departureScheduleId = newGroup.frontRunnerTime.departureScheduleId;
			} else {
				newGroup.mtcDepartureDate = moment(newGroup.mtcDepartureDate);
				newGroup.mtcDepartureDate.set({
					'seconds':newGroup.time.seconds(),
					'minutes':newGroup.time.minutes(),
					'hours':newGroup.time.hours()
				});
			}
			newGroup.departureGroupTypeId = newGroup.departureGroupType.id;
			this.dialogRef.close(newGroup);
		}
	}
}
