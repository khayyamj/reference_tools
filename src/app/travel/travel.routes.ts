import {
	TravelGroupsComponent,
	TravelGroupsWeekViewComponent,
	OldTravelGroupsWeekViewComponent,
	ManualAppointmentsComponent,
	ConsulateAppointmentsComponent,
	TempAssignmentsComponent,
	TravelGroupViewComponent,
	TravelPacketViewComponent
} from './components/';

import { DepartureGroupListComponent} from '../travel-departures/components/departure-group-list/departure-group-list.component';
import { NgModule }	from '@angular/core';
import { RouterModule } from '@angular/router';

import { RoleGuard } from '../shared/';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'groups',  component: TravelGroupsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] } },
			{ path: 'travel-groups/week-view', component: TravelGroupsWeekViewComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] } },
			{ path: 'travel-groups/group-view/:travelGroupId', component: TravelGroupViewComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] } },
			{ path: 'travel-groups/:travelColumnTable', component: OldTravelGroupsWeekViewComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] } },
			{ path: 'travel-groups/:travelColumnTable/packet/:missionAbbreviation/:travelGroupId', component: TravelPacketViewComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] } },
			{ path: 'manual-appointments', component: ManualAppointmentsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] }},
			{ path: 'consulate-appointments', component: ConsulateAppointmentsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] }},
			{ path: 'departure-schedule', component: DepartureGroupListComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] }},
			{ path: 'temp-assignments', component: TempAssignmentsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-travel','developer'] }},
			{ path: 'settings', loadChildren: '../travel-settings/settings.module#TravelSettingsModule' },
		])
	],
	exports: [
		RouterModule
	]
})
export class TravelRoutingModule { }
