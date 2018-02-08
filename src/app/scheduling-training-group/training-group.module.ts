import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/';
import { TrainingGroupRoutingModule } from './training-group.routes';
import { RecordsModule } from '../scheduling-records';

import {
	MatRadioModule,
	MatTabsModule
} from '@angular/material';

import {
	TrainingGroupViewComponent,
	TrainingGroupFutureChangesComponent,
	TrainingGroupMembersComponent,
	TrainingGroupManageMembersComponent,
	TrainingGroupPersonnelComponent,
	TrainingGroupSearchComponent,
	TrainingGroupMainComponent,
	TrainingGroupNewComponent,
	TrainingGroupHistoryComponent,
	EditGroupFutureChangeComponent,
	TrainingGroupEditComponent
} from './components';

import {
	TrainingGroupService
} from './services';

const dialogComponents = [
	EditGroupFutureChangeComponent,
	TrainingGroupEditComponent,
	TrainingGroupNewComponent,
	TrainingGroupManageMembersComponent
];

const components = [
	TrainingGroupViewComponent,
	TrainingGroupFutureChangesComponent,
	TrainingGroupMembersComponent,
	TrainingGroupPersonnelComponent,
	TrainingGroupSearchComponent,
	TrainingGroupMainComponent,
	TrainingGroupHistoryComponent,
	EditGroupFutureChangeComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [
];

const services = [
	TrainingGroupService
];

const modules = [
	SharedModule,
	RecordsModule,
	TrainingGroupRoutingModule,
	MatRadioModule,
	MatTabsModule
];

@NgModule({
	declarations: [components, directives, pipes],
	imports: [modules],
	exports: [components, directives, pipes],
	providers: [services],
	entryComponents: [dialogComponents]
})
export class TrainingGroupModule { }
