import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../shared/';

import {
	NapiDataComponent,
	NewRecordComponent,
	ExceptionManagementComponent,
	EditExceptionComponent,
	FutureChangesComponent,
	MissionAbbreviationsComponent
	} from './components';


@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'records',
				canActivate: [RoleGuard],
				children: [
					{ path: 'napi',  component: NapiDataComponent},
					{ path: 'new-record',  component: NewRecordComponent},
					{ path: 'exception-management',  component: ExceptionManagementComponent},
					{ path: 'exception-management/:type',  component: EditExceptionComponent},
					{ path: 'future-changes',  component: FutureChangesComponent},
					{ path: 'mission-abbreviations',  component: MissionAbbreviationsComponent}
				],
				data: {
					roles: ['mtc-scheduling', 'developer']
				}
			}
		])

	],
	exports: [
		RouterModule
	]
})
export class RecordsRoutingModule { }
