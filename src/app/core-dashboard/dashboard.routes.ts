import {
	NoItineraryComponent,
	NonMatchingItineraryComponent,
	MissingTravelPacketsComponent,
	DashboardComponent
} from './components/';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RoleGuard } from '../shared/';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'dashboard/no-itinerary', component: NoItineraryComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer']} },
			{ path: 'dashboard/nonmatching-itinerary', component: NonMatchingItineraryComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer']} },
			{ path: 'dashboard/missing-packets', component: MissingTravelPacketsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer']} },
		])
	],
	exports: [
		RouterModule
	]
})
export class DashboardRoutingModule { }
