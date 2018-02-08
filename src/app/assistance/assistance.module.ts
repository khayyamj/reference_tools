import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AssistanceRoutingModule } from './assistance.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { AssistanceService } from './services';

import {
	MatSelectModule
} from '@angular/material';

import {
	ItemTableComponent,
	MissionariesAssistanceComponent,
	PrintEvaluationComponent,
	ManageItemsComponent,
	EditItemComponent,
	ManageCategoriesComponent,
} from './components';


const dialogComponents = [
	ItemTableComponent,
	PrintEvaluationComponent,
	EditItemComponent,
	ManageCategoriesComponent
];

const components = [
	MissionariesAssistanceComponent,
	ManageItemsComponent,
	...dialogComponents
];

const directives = [
];

const pipes = [
];

const services = [
	AssistanceService,
];

const modules = [
	SharedModule,
	ReactiveFormsModule,
	AssistanceRoutingModule,
	MatSelectModule
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: [modules],
	exports: [components, directives, pipes],
	providers: [services],
	entryComponents: [dialogComponents],
})

export class AssistanceModule { }
