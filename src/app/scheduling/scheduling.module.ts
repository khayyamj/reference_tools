import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulingRoutingModule } from './scheduling.routes';
import { RouterModule } from '@angular/router';

import {
	MatSelectModule,
} from '@angular/material';

import {
	ZoneManagementComponent,
	EditZoneComponent,
	FacilitiesManagementComponent,
	ResidenceRoomComponent,
	ClassroomComponent,
	RoomComponent,
	RoomSearchComponent,
	RoomHistoryComponent,
	EditRoomComponent,
	EditFacilitiesFutureChangesComponent
} from './components';

import {
	ZoneManagementService,
	FacilitiesManagementService,
	EditFacilitiesFutureChangeService,
	RoomService
} from './services';

import { RecordsModule } from '../scheduling-records';
import { TrainingGroupModule } from '../scheduling-training-group';
import { NewMissionarySchedulingModule} from '../scheduling-nms';

const dialogComponents = [
	RoomHistoryComponent,
	EditRoomComponent,
	EditZoneComponent,
	EditFacilitiesFutureChangesComponent
];

const components = [
	ZoneManagementComponent,
	FacilitiesManagementComponent,
	ResidenceRoomComponent,
	ClassroomComponent,
	RoomComponent,
	RoomSearchComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [
];

const services = [
	ZoneManagementService,
	FacilitiesManagementService,
	EditFacilitiesFutureChangeService,
	RoomService
];

const modules = [
	SharedModule,
	ReactiveFormsModule,
	SchedulingRoutingModule,
	RouterModule,
	RecordsModule,
	TrainingGroupModule,
	NewMissionarySchedulingModule,
	MatSelectModule,
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: modules,
	providers: [ services, pipes ],
	exports: [ components, directives, pipes ],
	entryComponents: [ dialogComponents ]
})
export class SchedulingModule {

}
