import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../shared/';

import {
	MissionMainComponent,
	MissionSearchComponent,
	MissionViewComponent,
} from './components';


@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'missions',
				component: MissionMainComponent,
				children: [
					{ path: 'search/view', component: MissionViewComponent },
					{ path: 'search', component: MissionSearchComponent },
					{ path: '**', redirectTo: 'search' }
				]
			}
		])

	],
	exports: [
		RouterModule
	]
})
export class MissionsRoutingModule { }
