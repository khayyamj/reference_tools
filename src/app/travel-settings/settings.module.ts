import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/';
import { DragulaModule } from 'ng2-dragula';
import { DndModule } from 'ng2-dnd';
import { TravelSettingsRoutingModule } from './settings.routes';
import { QuillEditorModule } from 'ng2-quill-editor';

import {
	MatRadioModule,
	MatTabsModule,
	MatCardModule,
	MatSelectModule,
	MatTooltipModule
} from '@angular/material';

import {
	TravelSettingsMainComponent,
	TravelSettingsListComponent,
	ManualItineraryListComponent,
	EditManualItineraryComponent,
	GeneralTravelNotesComponent,
	LuggageTravelNotesComponent,
	MissionSettingsComponent,
	EditMissionSettingsComponent,
	LeadTimesComponent,
	DriversVehiclesComponent,
	NewLeadTimeComponent,
	ExceptionModalComponent,
	AddNewDriverVehicleComponent
} from './components';

import {
	ManualItineraryService,
	GeneralTravelNotesService,
	AirlineSettingsService,
	MissionSettingsService,
	LeadTimesService,
	DriversVehiclesService
} from './services';

const dialogComponents = [
	EditManualItineraryComponent,
	EditMissionSettingsComponent,
	NewLeadTimeComponent,
	ExceptionModalComponent,
	AddNewDriverVehicleComponent,
];

const components = [
	TravelSettingsMainComponent,
	TravelSettingsListComponent,
	ManualItineraryListComponent,
	GeneralTravelNotesComponent,
	LuggageTravelNotesComponent,
	MissionSettingsComponent,
	LeadTimesComponent,
	DriversVehiclesComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [
];

const services = [
	ManualItineraryService,
	GeneralTravelNotesService,
	AirlineSettingsService,
	MissionSettingsService,
	LeadTimesService,
	DriversVehiclesService
];

const modules = [
	SharedModule,
	ReactiveFormsModule,
	TravelSettingsRoutingModule,
	DragulaModule,
	DndModule.forRoot(),
	QuillEditorModule,
	MatRadioModule,
	MatTabsModule,
	MatCardModule,
	MatSelectModule,
	MatTooltipModule
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: modules,
	providers: [services, pipes],
	exports: [components, directives, pipes],
	entryComponents: [dialogComponents]
})
export class TravelSettingsModule {

}
