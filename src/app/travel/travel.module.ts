import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/';
import { ReactiveFormsModule } from '@angular/forms';
import { TravelRoutingModule } from './travel.routes';
import { QuillEditorModule } from 'ng2-quill-editor';
import { DepartureModule } from '../travel-departures';

import {
	MatRadioModule,
	MatSelectModule,
	MatCardModule,
	MatTooltipModule
} from '@angular/material';

import {
	TravelGroupsComponent,
	TravelViewComponent,
	TravelGroupsWeekViewComponent,
	OldTravelGroupsWeekViewComponent,
	TravelPacketViewComponent,
	TravelGroupViewComponent,
	EditPacketComponent,
	ManualAppointmentsComponent,
	ConsulateAppointmentsComponent,
	NewAppointmentComponent,
	PrintModalComponent,
	OldPrintModalComponent,
	TempAssignmentsComponent,
	NewTempAssignmentComponent,
	TravelMissionarySearchComponent,
	ItineraryViewComponent
} from './components';

import {
	TravelGroupService,
	TravelPacketsService,
	TravelSearchService,
	AppointmentsService,
	SASService,
	TempAssignmentsService,
} from './services';


const dialogComponents = [
	EditPacketComponent,
	NewAppointmentComponent,
	PrintModalComponent,
	OldPrintModalComponent,
	NewTempAssignmentComponent
];

const components = [
	TravelGroupsComponent,
	TravelViewComponent,
	TravelGroupsWeekViewComponent,
	OldTravelGroupsWeekViewComponent,
	TravelPacketViewComponent,
	TravelGroupViewComponent,
	ManualAppointmentsComponent,
	TempAssignmentsComponent,
	ConsulateAppointmentsComponent,
	TravelMissionarySearchComponent,
	ItineraryViewComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [
];

const services = [
	TravelGroupService,
	TravelPacketsService,
	TravelSearchService,
	AppointmentsService,
	SASService,
	TempAssignmentsService,
];

const modules = [
	SharedModule,
	ReactiveFormsModule,
	TravelRoutingModule,
	DepartureModule,
	QuillEditorModule,
	MatRadioModule,
	MatSelectModule,
	MatCardModule,
	MatTooltipModule
];


@NgModule({
	declarations: [ components, directives, pipes ],
	imports: modules,
	providers: [services, pipes],
	exports: [components, directives, pipes],
	entryComponents: [dialogComponents]
})

export class TravelModule {

}
