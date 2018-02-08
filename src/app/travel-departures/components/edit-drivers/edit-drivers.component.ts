import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DriversVehiclesService } from '../../../travel-settings';


@Component({
	selector: 'travel-departure-schedule-edit-drivers',
	templateUrl: './edit-drivers.component.html',
	styleUrls: ['./edit-drivers.component.less']
})
export class EditDriversComponent implements OnInit {
	public driverVehicles: any = [];

	public driverList: any = [];
	public vehicleList: any = [];

	public driverForm: FormGroup;

	showError = false;

	constructor(private driversVehiclesService: DriversVehiclesService,
				private fb: FormBuilder,
				public dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private data: any) { }

	ngOnInit() {

		this.driversVehiclesService.getAllDrivers().subscribe((data) => {
			this.driverList = data;
		});
		this.driversVehiclesService.getAllVehicles().subscribe((data) => {
			this.vehicleList = data;
		});
		this.driverForm = this.fb.group({
			driverVehicles: this.fb.array([])
		});

		this.data.forEach((element, index) => {
			const driver = this.driverList.find((d) => {
				return element.driver.firstName === d.firstName && element.driver.lastName === d.lastName;
			});
			const vehicle = this.vehicleList.find((v) => {
				return element.vehicle.vehicleName === v.vehicleName;
			});

			const control = <FormArray>this.driverForm.controls['driverVehicles'];
			control.push(this.initDriverVehicleForm(index, driver, vehicle));
		});

		if(!this.data.length){
			this.addDriverVehicle(this.data.length);
		}
	}

	initDriverVehicleForm(index: number, driver: any = '', vehicle: any = '') {
		if (index === 0) {
			return this.fb.group({
				driver: [driver, Validators.required, validateUniqueDriver(index)],
				vehicle: [vehicle, Validators.required]
			},{
				validator:this.validateCDLDriver.bind(this)
			});
		} else {
			return this.fb.group({
				driver: [driver, Validators.required, validateUniqueDriver(index)],
				vehicle: [vehicle]
			},{
				validator:this.validateCDLDriver.bind(this)
			});
		}
	}

	addDriverVehicle(index?: number) {
		if(this.driverForm.valid){
			const control = <FormArray>this.driverForm.controls['driverVehicles'];
			control.push(this.initDriverVehicleForm(index));
		}
	}

	removeDriverVehicle(index: number){
		const control = <FormArray>this.driverForm.controls['driverVehicles'];
		control.removeAt(index);
	}

	save(driverVehicles:any[]) {
		if(this.driverForm.valid) {
			this.showError = false;
			this.dialogRef.close(driverVehicles.filter((dv) => {
				if (dv.vehicle === '' || !dv.vehicle) {
					dv.vehicle = {
						vehicleId: -1
					};
				}
				return dv.driver.driverId;
			}));
		} else {
			this.showError = true;
		}
	}

	shouldShowError(driverVehicle: any){
		if(driverVehicle && driverVehicle.controls.vehicle && driverVehicle.controls.driver){
			return ((driverVehicle.controls.vehicle.touched && driverVehicle.controls.driver.hasError('required')) || this.showError);
		}
		return this.showError;
	}

	showNonUniqueError(driverVehicle: any){
		if(driverVehicle && driverVehicle.controls.driver){
			return driverVehicle.controls.driver.hasError('notUniqueDriver');
		}
		return false;
	}

	getDriverVehicles(form) {
		return form.get('driverVehicles').controls;
	}

	validateCDLDriver(c: FormControl) {
		if(c.value.vehicle.commercialVehicle && !c.value.driver.commercialVehicle) {
			c.get('driver').setErrors({ notCDL: true });
		}
	}
}

function validateUniqueDriver(index: number) {
	return function (c: FormControl) {
		const pairs = c.root.value.driverVehicles;
		let match = false;
		for (const pair in pairs) {
			if (+pair === index) {
				continue;
			}
			if (pairs[pair].driver === c.value) {
				match = true;
				break;
			}
		}
		return Observable.of((match) ? { notUniqueDriver: true } : null);
	};
}
