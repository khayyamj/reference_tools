import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/';
import { TravelSettingsModule } from '../travel-settings';
import { DragulaModule } from 'ng2-dragula';


import {
	MatRadioModule,
	MatSelectModule
} from '@angular/material';

import {
	DepartureGroupListComponent,
	NewDepartureGroupComponent,
	EditDriversComponent,
	DeparturePrintComponent,
	DepartureNoteEditorComponent,
	FrontrunnerTimesComponent,
	DepartureGroupItemComponent
} from './components';

import {
	DepartureGroupService,
} from './services';

const dialogComponents = [
	EditDriversComponent,
	DeparturePrintComponent,
	DepartureNoteEditorComponent,
	NewDepartureGroupComponent
];

const components = [
	DepartureGroupListComponent,
	FrontrunnerTimesComponent,
	DepartureGroupItemComponent,
	...dialogComponents
];

const directives = [
];

const pipes = [
];

const services = [
	DepartureGroupService,
];

const modules = [
	SharedModule,
	ReactiveFormsModule,
	TravelSettingsModule,
	DragulaModule,
	MatRadioModule,
	MatSelectModule
];

@NgModule({
	declarations: [ components, directives, pipes ],
	imports: modules,
	providers: [ services, pipes ],
	exports: [ components, directives, pipes ],
	entryComponents: [ dialogComponents ]
})
export class DepartureModule {

}
