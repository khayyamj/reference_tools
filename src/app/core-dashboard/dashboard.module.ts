import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { TravelPacketsService } from '../travel';
import {
	MatDialogModule,
	MatButtonModule,
	MatIconModule,
	MatTooltipModule,
} from '@angular/material';
import { GridsterModule } from 'angular-gridster2';
import { DashboardRoutingModule } from './dashboard.routes';

import {
	DashboardComponent,
	ManageDashboardComponent,
	NoItineraryWidgetComponent,
	NonMatchingItineraryWidgetComponent,
	NoItineraryComponent,
	NonMatchingItineraryComponent,
	MissingTravelPacketsComponent,
	MissingTravelPacketsWidgetComponent,
	WeekJuniorDeparturesWidgetComponent,
	DayJuniorDeparturesWidgetComponent,
} from './components';

import {
	DashboardService,
	CoreWidgetService,
	TravelWidgetService,
	SchedulingWidgetService,
	WidgetService
} from './services';

import {
} from './pipes';

const dialogComponents = [
	ManageDashboardComponent
];

const widgetComponents = [
	NoItineraryWidgetComponent,
	NonMatchingItineraryWidgetComponent,
	MissingTravelPacketsWidgetComponent,
	WeekJuniorDeparturesWidgetComponent,
	DayJuniorDeparturesWidgetComponent,
];

const components = [
	DashboardComponent,
	NoItineraryComponent,
	NonMatchingItineraryComponent,
	MissingTravelPacketsComponent,
	...widgetComponents,
	...dialogComponents
];

const directives = [

];

const pipes = [

];

const services = [
	DashboardService,
	CoreWidgetService,
	TravelWidgetService,
	SchedulingWidgetService,
	WidgetService,
	TravelPacketsService
];

const modules = [
	SharedModule,
	GridsterModule,
	MatDialogModule,
	MatButtonModule,
	MatIconModule,
	MatTooltipModule,
	DashboardRoutingModule,
];

@NgModule({
	declarations: [ components, directives, pipes ],
	imports: modules,
	providers: [ services, pipes ],
	exports: [ components, directives, pipes ],
	entryComponents: [ dialogComponents, widgetComponents ]
})
export class DashboardModule {

}
