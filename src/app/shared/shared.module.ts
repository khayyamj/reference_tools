import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
	PipeModule,
	MTCCommonModule
} from 'mtc-modules';

import {
	MatCardModule,
	MatProgressBarModule,
	MatCheckboxModule,
	MatTooltipModule,
	MatInputModule,
	MatButtonModule,
	MatDialogModule,
} from '@angular/material';

import {
	ItineraryComponent,
	NotificationBadgeComponent,
	SubHeaderComponent,
	TabsComponent,
	ColumnTableComponent,
	TravelTypeFilterComponent,
} from './components';

import {
	WindowRefService,
	HostnameService,
	ViewedItemService,
	EmailService,
	ConfigService,
	TravelTypeFilterService,
} from './services';

import {
	MissingInfoPipe,
} from './pipes';


const dialogComponents = [
];

const components = [
	ItineraryComponent,
	NotificationBadgeComponent,
	SubHeaderComponent,
	TabsComponent,
	ColumnTableComponent,
	TravelTypeFilterComponent,
	...dialogComponents
];

const directives = [
];

const pipes = [
	MissingInfoPipe,
];

const services = [
	WindowRefService,
	HostnameService,
	DatePipe,
	ViewedItemService,
	EmailService,
	ConfigService,
	TravelTypeFilterService,
];

const modulesToExport = [
	MTCCommonModule,
	FlexLayoutModule,
	FormsModule,
	PipeModule,
	MatInputModule,
	MatButtonModule,
	MatDialogModule,
	MatProgressBarModule,
	MatCheckboxModule,
	CommonModule,
];

const modules = [
	RouterModule,
	MTCCommonModule,
	PipeModule,
	FlexLayoutModule,
	MatCardModule,
	MatProgressBarModule,
	MatTooltipModule,
	...modulesToExport
];

@NgModule({
	declarations: [ components, directives, pipes ],
	imports: modules,
	providers: [ services, pipes ],
	exports: [ components, directives, pipes, ...modulesToExport ],
	entryComponents: dialogComponents
})
export class SharedModule {

}
