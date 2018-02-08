import {
	TravelSettingsMainComponent,
	TravelSettingsListComponent,
	ManualItineraryListComponent,
	GeneralTravelNotesComponent,
	MissionSettingsComponent,
	LeadTimesComponent,
	DriversVehiclesComponent
} from './components/';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RoleGuard } from '../shared/';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: TravelSettingsMainComponent,
				canActivate: [RoleGuard],
				children: [
					{ path: '', component: TravelSettingsListComponent },
					{ path: 'mission', component: MissionSettingsComponent },
					{ path: 'general-travel-notes', component: GeneralTravelNotesComponent },
					{ path: 'manual-itineraries', component: ManualItineraryListComponent },
					{ path: 'lead-times', component: LeadTimesComponent },
					{ path: 'drivers-vehicles', component: DriversVehiclesComponent }
				],
				data: {
					roles: ['mtc-travel','developer']
				}
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class TravelSettingsRoutingModule { }
