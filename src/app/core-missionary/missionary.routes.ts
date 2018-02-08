import {
	MissionaryMainComponent,
	MissionaryOverviewComponent,
	MTCInfoComponent,
	PersonalInfoComponent,
	EcclesiasticalInfoComponent,
	MissionInfoComponent,
	TrainingInfoComponent,
	TeacherCommentListComponent,
	SearchHistoryComponent,
	MissionaryScheduleComponent,
	ChangeHistoryComponent,
	NotesComponent,
	NoteTagsComponent,
	WebHistoryComponent,
	AssistanceComponent,
	PrintSummaryOnePageComponent,
	PrintSummaryClinicalComponent,
} from './components/';
import { RoleGuard } from './../shared';

import { NgModule }	from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'missionary',
				component: MissionaryMainComponent,
				children: [
					{ path: '', component: MissionaryOverviewComponent },
					{ path: 'mtc', component: MTCInfoComponent },
					{ path: 'mission', component: MissionInfoComponent },
					{ path: 'personal', component: PersonalInfoComponent },
					{ path: 'ecclesiastical', component: EcclesiasticalInfoComponent },
					{ path: 'training', component: TrainingInfoComponent },
					{ path: 'teacher-comments', component: TeacherCommentListComponent, canActivate: [RoleGuard], data: { roles: ['mtc-ecclesiastical', 'developer']} },
					{ path: 'search-history', component: SearchHistoryComponent },
					{ path: 'notes', component: NotesComponent },
					{ path: 'web-history', component: WebHistoryComponent, canActivate: [RoleGuard], data: { roles: ['mtc-ecclesiastical', 'mtc-info-desk', 'developer'] } },
					{ path: 'schedule', component: MissionaryScheduleComponent },
					{ path: 'change-history', component: ChangeHistoryComponent },
					{ path: 'tags', component: NoteTagsComponent, canActivate: [RoleGuard], data: { roles: ['mtc-ecclesiastical']} },
					{ path: 'print-summary-one-page', component: PrintSummaryOnePageComponent },
					{ path: 'print-summary-clinical', component: PrintSummaryClinicalComponent },
					{ path: 'assistance', component: AssistanceComponent, canActivate: [RoleGuard], data: { roles: ['mtc-assistance', 'developer']} },
				]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class MissionaryRoutingModule { }
