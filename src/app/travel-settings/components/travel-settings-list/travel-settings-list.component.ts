import {Component} from '@angular/core';

@Component({
	selector: 'travel-settings-list',
	templateUrl: './travel-settings-list.component.html',
	styleUrls: ['./travel-settings-list.component.less']
})
export class TravelSettingsListComponent {
	public settings;

	constructor() {
		this.settings = [
			{
				title: 'Dashboard Settings',
				instructions: 'Settings to customize your dashboard. Show/hide views and order in the dashboard',
				state: 'dashboard'
			},
			{
				title: 'Non-Flight Itineraries',
				instructions: 'Edit non-flight itineraries for missions',
				state: 'manual-itineraries'
			},
			{
				title: 'Travel Lead Times',
				instructions: 'Set the lead times for airport departures',
				state: 'lead-times'
			},
			{
				title: 'Travel Notes',
				instructions: 'Edit general travel notes for all itineraries or travel leader notes for travel leader itineraries',
				state: 'general-travel-notes'
			},
			{
				title: 'Missions',
				instructions: 'Setup and edit mission settings',
				state: 'mission'
			},
			{
				title: 'Drivers and Vehicles',
				instructions: 'Manage the list of drivers and vehicles',
				state: 'drivers-vehicles'
			}
		];
	}
}
