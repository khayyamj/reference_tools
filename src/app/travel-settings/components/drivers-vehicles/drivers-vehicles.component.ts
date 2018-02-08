import { Component, OnInit } from '@angular/core';
import { DriversVehiclesService } from '../../services';
import { MatDialog } from '@angular/material';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { AddNewDriverVehicleComponent } from './add-new-driver-vehicle';

@Component({
	selector: 'app-drivers-vehicles',
	templateUrl: './drivers-vehicles.component.html',
	styleUrls: ['./drivers-vehicles.component.less']
})

export class DriversVehiclesComponent implements OnInit {

	isDriversLoading = true;
	isVehiclesLoading = true;
	tabs = ['Drivers', 'Vehicles'];
	selectedTab = 'Drivers';
	drivers = [];
	vehicles = [];
	driverColumns: CheckboxTableColumn[] = [
		{ title: 'Name', attr: 'name' },
		{ title: 'CDL Certified', attr: 'commercialVehicle', yesNo: true },
	];
	vehicleColumns: CheckboxTableColumn[] = [
		{ title: 'Vehicle ID', attr: 'vehicleName' },
		{ title: 'CDL Required', attr: 'commercialVehicle', yesNo: true },
		{ title: 'Capacity', attr: 'passengerCapacity' },
	];

	checkboxTableConfig: CheckboxTableConfig = {
		topButtons: [
			{ text: 'REMOVE', function: this.removeSelected.bind(this) }
		],
		rowButtons: [
			{ text: 'EDIT', function: this.openDialog.bind(this) }
		]
	};

	constructor(private dialog: MatDialog,
		private driversVehiclesService: DriversVehiclesService) {
	}

	ngOnInit() {
		this.driversVehiclesService.getAllDrivers().subscribe((drivers) => {
			drivers.forEach(driver => {
				driver.name = driver.lastName + ', ' + driver.firstName;
			});
			this.drivers = drivers;
			this.isDriversLoading = false;
		});
		this.driversVehiclesService.getAllVehicles().subscribe((vehicles) => {
			this.vehicles = vehicles;
			this.isVehiclesLoading = false;
		});
	}

	removeSelected() {
		if (this.selectedTab === 'Drivers') {
			this.drivers = this.drivers.filter(result => !result.selected);
			this.driversVehiclesService.updateDrivers(this.drivers);
		} else if (this.selectedTab === 'Vehicles') {
			this.vehicles = this.vehicles.filter(result => !result.selected);
			this.driversVehiclesService.updateVehicles(this.vehicles);
		}
	}

	openDialog(selected?) {
		this.dialog.open(AddNewDriverVehicleComponent, {
			width: '600px',
			data: { selected: selected, type:this.selectedTab},
		}).afterClosed().subscribe((returnSelected) => {
			if (returnSelected) {
				const type = this.selectedTab.toLowerCase();
				if(returnSelected.isEdit){
					const index = this[type].findIndex(object => returnSelected[type.slice(0, -1) + 'Id'] === object[type.slice(0,-1) + 'Id']);
					this[type][index] = returnSelected;
					this.driversVehiclesService['update' + this.selectedTab](this[type]);
				} else {
					this[type].push(returnSelected);
					this.driversVehiclesService['create' + this.selectedTab.slice(0,-1)](returnSelected);
					if(type === 'drivers') {
						returnSelected.name = returnSelected.firstName + ' ' + returnSelected.lastName;
					}
				}
			}
		});
	}
}
