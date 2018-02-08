import {
	MailboxListComponent,
	ServiceAssignmentsComponent
} from './components/';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RoleGuard } from '../shared/';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'mailboxes', component: MailboxListComponent, canActivate: [RoleGuard], data: { roles: ['mtc-general-services', 'developer'] }  },
			{ path: 'service-assignments', component: ServiceAssignmentsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-general-services', 'developer'] } }
		])
	],
	exports: [
		RouterModule
	]
})
export class GeneralServicesRoutingModule { }
