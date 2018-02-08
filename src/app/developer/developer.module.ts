import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/';
import { RouterModule } from '@angular/router';
import {
	MatRadioModule,
	MatSelectModule,
	MatCardModule,
	MatTooltipModule
} from '@angular/material';

import {
	LogListComponent
} from './components';

import {
	ApiLogsService
} from './services';


const dialogComponents = [
];

const components = [
	LogListComponent,
	...dialogComponents
];

const directives = [
];

const pipes = [
];

const services = [
	ApiLogsService
];

const modules = [
	SharedModule,
	RouterModule,
	MatSelectModule,
];

@NgModule({
	declarations: [ components, directives, pipes ],
	imports: modules,
	providers: [ services, pipes ],
	exports: [ components, directives, pipes ],
	entryComponents: dialogComponents
})
export class DeveloperModule {

}
