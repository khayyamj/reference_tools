import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/';
import { MissionsRoutingModule } from './missions.routes';

import {
	MatRadioModule,
	MatTabsModule
} from '@angular/material';

import {
	MissionAssistanceComponent,
	MissionMainComponent,
	MissionSearchComponent,
	MissionViewComponent,
} from './components';

import {
	MissionService,
	MissionApiService
} from './services';

const dialogComponents = [

];

const components = [
	MissionAssistanceComponent,
	MissionMainComponent,
	MissionSearchComponent,
	MissionViewComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [
];

const services = [
	MissionService,
	MissionApiService
];

const modules = [
	SharedModule,
	MissionsRoutingModule,
	MatRadioModule,
	MatTabsModule
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: [modules],
	exports: [components, directives, pipes],
	providers: [services],
	entryComponents: [dialogComponents]
})
export class MissionsModule { }
