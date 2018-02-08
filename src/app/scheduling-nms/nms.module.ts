import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/';
import { NewMissionarySchedulingRoutingModule } from './nms.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
	MatTabsModule,
	MatSelectModule,
} from '@angular/material';

import {
	EditSeniorMissionaryModalComponent,
	NewMissionarySchedulingLandingPageComponent,
	CheckAndFinishComponent,
	EditMissionayExceptionComponent,
	SeniorMissionaryComponent,
	SeniorMissionaryListComponent,
	EditClassroomSizeComponent,
	ClassroomSizeManagementComponent
} from './components';

import {
	NewMissionarySchedulingService,
	ClassroomSizeManagementService,
} from './services';


const dialogComponents = [
	EditSeniorMissionaryModalComponent,
	EditMissionayExceptionComponent,
	EditClassroomSizeComponent
];

const components = [

	NewMissionarySchedulingLandingPageComponent,
	CheckAndFinishComponent,
	ClassroomSizeManagementComponent,
	SeniorMissionaryComponent,
	SeniorMissionaryListComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [
];

const services = [
	NewMissionarySchedulingService,
	ClassroomSizeManagementService
];

const modules = [
	SharedModule,
	NewMissionarySchedulingRoutingModule,
	ReactiveFormsModule,
	FlexLayoutModule,
	MatTabsModule,
	MatSelectModule,
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: [modules],
	exports: [components, directives, pipes],
	providers: [services],
	entryComponents: [dialogComponents]
})
export class NewMissionarySchedulingModule { }
