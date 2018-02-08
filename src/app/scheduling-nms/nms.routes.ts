import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../shared/';

import {
	NewMissionarySchedulingLandingPageComponent,
	CheckAndFinishComponent,
	ClassroomSizeManagementComponent
	} from './components';


@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'missionaries/classroom-management', component: ClassroomSizeManagementComponent, canActivate: [RoleGuard], data: { roles: ['mtc-scheduling','developer']} },
			{ path: 'missionaries/:type', component: NewMissionarySchedulingLandingPageComponent, canActivate: [RoleGuard], data: { roles: ['mtc-scheduling','developer']} },
			{ path: 'missionaries/:type/check-and-finish', component: CheckAndFinishComponent, canActivate: [RoleGuard], data: { roles: ['mtc-scheduling','developer']} }
		])

	],
	exports: [
		RouterModule
	]
})
export class NewMissionarySchedulingRoutingModule { }
