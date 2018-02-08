import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/';
import { RecordsRoutingModule } from './records.routes';
import { ReactiveFormsModule } from '@angular/forms';

import {
	MatTabsModule
} from '@angular/material';

import {
	MissionaryInfoService,
	EditExceptionService,
	ExceptionsManagementService,
	NapiDataService,
	FutureChangesService,
	MissionAbbreviationService
} from './services';


import {
	RecordsMainComponent,
	NapiDataComponent,
	NewRecordComponent,
	ExceptionManagementComponent,
	EditExceptionComponent,
	FutureChangesComponent,
	MissionAbbreviationsComponent,
	EditFutureChangesMissionaryComponent,
	EditFutureChangesRoomsComponent,
	EditFutureChangesTrainingGroupComponent,
	ExceptionActionComponent
} from './components';

const dialogComponents = [
	EditFutureChangesMissionaryComponent,
	EditFutureChangesRoomsComponent,
	EditExceptionComponent,
	EditFutureChangesTrainingGroupComponent
];

const components = [
	RecordsMainComponent,
	NapiDataComponent,
	NewRecordComponent,
	ExceptionManagementComponent,
	FutureChangesComponent,
	MissionAbbreviationsComponent,
	ExceptionActionComponent,
	...dialogComponents
];



const directives = [

];

const pipes = [
];

const services = [
	MissionaryInfoService,
	EditExceptionService,
	ExceptionsManagementService,
	NapiDataService,
	FutureChangesService,
	MissionAbbreviationService
];

const modules = [
	SharedModule,
	RecordsRoutingModule,
	ReactiveFormsModule,
	MatTabsModule
];

@NgModule({
	declarations: [ components, directives, pipes ],
	imports: [modules],
	exports: [ components, directives, pipes ],
	providers: [ services ],
	entryComponents: [ dialogComponents ]
})
export class RecordsModule { }
