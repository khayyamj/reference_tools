import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DriversVehiclesService {

	private driversSubject = new BehaviorSubject<any>([]);
	private vehiclesSubject = new BehaviorSubject<any>([]);


	constructor(private hostName: HostnameService,
				private http: HttpClient) {

		this.http.get(`${this.hostName.travelUrl}driver/`).subscribe((drivers: any[]) => {
			this.driversSubject.next(drivers);
		});

		this.http.get(`${this.hostName.travelUrl}vehicle/`).subscribe((vehicles: any[]) => {
			this.vehiclesSubject.next(vehicles);
		});
	}

	//DRIVERS

	getAllDrivers() {
		return this.driversSubject.asObservable();
	}


	updateDrivers(drivers) {
		this.http.put(`${this.hostName.travelUrl}driver/`, drivers).subscribe((updatedDrivers: any[]) => {
			this.driversSubject.next(updatedDrivers);
		});
	}

	createDriver(driver) {
		this.http.post(`${this.hostName.travelUrl}driver/`, driver).subscribe();
	}

	//VEHICLES

	getAllVehicles() {
		return this.vehiclesSubject.asObservable();
	}

	updateVehicles(vehicles) {
		this.http.put(`${this.hostName.travelUrl}vehicle/`, vehicles).subscribe((updatedVehicles: any[]) => {
			this.vehiclesSubject.next(updatedVehicles);
		});
	}

	createVehicle(vehicle) {
		this.http.post(`${this.hostName.travelUrl}vehicle/`, vehicle).subscribe();
	}
}
