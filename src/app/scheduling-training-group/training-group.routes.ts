import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../shared/';

import {
	TrainingGroupSearchComponent,
	TrainingGroupMainComponent,
	TrainingGroupViewComponent
	} from './components';


@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'training-groups',
				component: TrainingGroupMainComponent,
				canActivate: [RoleGuard],
				children: [
					{ path: 'search/view', component: TrainingGroupViewComponent },
					{ path: 'search', component: TrainingGroupSearchComponent },
					{ path: '**', redirectTo: 'search'}
				],
				data: {
					roles: ['mtc-scheduling','developer']
				}
			}
		])

	],
	exports: [
		RouterModule
	]
})
export class TrainingGroupRoutingModule { }
