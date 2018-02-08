import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MissionaryRoutingModule } from './missionary.routes';
import { AssistanceModule } from '../assistance';
import { SharedModule } from '../shared';
import { TrainingGroupModule } from '../scheduling-training-group';
import { QuillEditorModule } from 'ng2-quill-editor';
import { DndModule } from 'ng2-dnd';
import {
	MatTabsModule,
	MatSlideToggleModule,
	MatDialogModule,
	MatInputModule,
	MatCheckboxModule,
	MatRadioModule,
	MatButtonModule,
	MatSelectModule
} from '@angular/material';

import {
	MissionaryMainComponent,
	BasicMissionaryComponent,
	MTCInfoComponent,
	MissionInfoComponent,
	PersonalInfoComponent,
	EcclesiasticalInfoComponent,
	TeacherCommentComponent,
	TeacherCommentListComponent,
	SearchHistoryComponent,
	MissionaryScheduleComponent,
	ChangeHistoryComponent,
	CreateChangeComponent,
	NotesComponent,
	MissionarySearchComponent,
	HeaderComponent,
	MissionaryOverviewComponent,
	AddNoteComponent,
	NoteTagsComponent,
	AssistanceComponent,
	WebHistoryComponent,
	PrintSummaryOnePageComponent,
	PrintSummaryClinicalComponent,
	PrintSummaryModalComponent,
	TrainingInfoComponent,
} from './components';

import {
	MissionaryService,
	MissionaryApiService,
	NoteService,
	ChangeService,
} from './services';

import {
} from './pipes';

const dialogComponents = [
	CreateChangeComponent,
	AddNoteComponent,
	PrintSummaryModalComponent,
	TeacherCommentComponent
];

const components = [
	MissionaryMainComponent,
	BasicMissionaryComponent,
	MTCInfoComponent,
	MissionInfoComponent,
	PersonalInfoComponent,
	EcclesiasticalInfoComponent,
	TrainingInfoComponent,
	TeacherCommentListComponent,
	SearchHistoryComponent,
	MissionaryScheduleComponent,
	ChangeHistoryComponent,
	NotesComponent,
	NoteTagsComponent,
	MissionarySearchComponent,
	HeaderComponent,
	MissionaryOverviewComponent,
	WebHistoryComponent,
	PrintSummaryOnePageComponent,
	PrintSummaryClinicalComponent,
	AssistanceComponent,
	PrintSummaryOnePageComponent,
	PrintSummaryClinicalComponent,
	...dialogComponents
];

const directives = [

];

const pipes = [

];

const services = [
	MissionaryService,
	MissionaryApiService,
	NoteService,
	ChangeService,
];

const modules = [
	MissionaryRoutingModule,
	AssistanceModule,
	SharedModule,
	QuillEditorModule,
	DndModule.forRoot(),
	MatSlideToggleModule,
	MatTabsModule,
	MatDialogModule,
	TrainingGroupModule,
	MatInputModule,
	MatCheckboxModule,
	MatRadioModule,
	MatButtonModule,
	MatSelectModule,
	ReactiveFormsModule,
	MatRadioModule
];

@NgModule({
	declarations: [ components, directives, pipes ],
	imports: modules,
	providers: [ services, pipes ],
	exports: [ components, directives, pipes ],
	entryComponents: [ dialogComponents ]
})
export class MissionaryModule {

}
