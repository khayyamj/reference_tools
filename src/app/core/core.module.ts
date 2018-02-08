import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreRoutingModule } from './core.routes';
import { SharedModule } from '../shared';
import {
	MatSidenavModule
} from '@angular/material';

import {
	SidebarComponent,
	MobileSidebarComponent,
	CustomSearchComponent,
	CustomSearchEditDatesComponent,
	SaveCustomSearchComponent,
	CustomSearchListComponent,
	UnauthorizedComponent,
} from './components';

import {
	CustomSearchService
} from './services';

import {
} from './pipes';

const dialogComponents = [
	SaveCustomSearchComponent,
	CustomSearchListComponent,
	CustomSearchEditDatesComponent
];

const components = [
	SidebarComponent,
	MobileSidebarComponent,
	CustomSearchComponent,
	UnauthorizedComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [

];

const services = [
	CustomSearchService
];

const modules = [
	CoreRoutingModule,
	SharedModule,
	ReactiveFormsModule,
	MatSidenavModule,
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: modules,
	providers: [services, pipes],
	exports: [components, directives, pipes],
	entryComponents: [dialogComponents]
})
export class CoreModule {

}
