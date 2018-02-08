import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MissionariesAssistanceComponent, ManageItemsComponent } from './components';
import { RoleGuard } from '../shared';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'items', component: ManageItemsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-assistance', 'developer'] } },
			{ path: 'assistance/missionaries', component: MissionariesAssistanceComponent },
		])
	],
	exports: [
		RouterModule
	]
})
export class AssistanceRoutingModule { }
