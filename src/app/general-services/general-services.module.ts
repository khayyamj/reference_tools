import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/';
import {
	MatSelectModule
} from '@angular/material';
import { GeneralServicesRoutingModule } from './general-services.routes';

import {
	ServiceAssignmentsComponent,
	MailboxListComponent,
	EditMailboxComponent,
	EditServiceAssignmentComponent
} from './components';

import {
	GeneralServicesService,
} from './services';

import {
} from './pipes';

const dialogComponents = [
	EditMailboxComponent,
	EditServiceAssignmentComponent
];

const components = [
	ServiceAssignmentsComponent,
	MailboxListComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [

];

const services = [
	GeneralServicesService
];

const modules = [
	SharedModule,
	GeneralServicesRoutingModule,
	MatSelectModule,
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: modules,
	providers: [services, pipes],
	exports: [components, directives, pipes],
	entryComponents: [dialogComponents]
})
export class GeneralServicesModule {

}
