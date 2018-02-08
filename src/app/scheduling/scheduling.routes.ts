import {
	ZoneManagementComponent,
	FacilitiesManagementComponent,
	ResidenceRoomComponent,
	ClassroomComponent
} from './components/';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../shared/';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'zones',  component: ZoneManagementComponent, canActivate: [RoleGuard], data: { roles: ['mtc-scheduling', 'developer'] } },
			{ path: 'facilities',  component: FacilitiesManagementComponent, canActivate: [RoleGuard], data: { roles: ['mtc-scheduling', 'developer'] } },
			{ path: 'residence',  component: ResidenceRoomComponent, canActivate: [RoleGuard], data: { roles: ['mtc-scheduling', 'developer'] } },
			{ path: 'classroom',  component: ClassroomComponent, canActivate: [RoleGuard], data: { roles: ['mtc-scheduling', 'developer'] } },
		])
	],
	exports: [
		RouterModule
	]
})
export class SchedulingRoutingModule { }
