import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MissionaryService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { TeacherCommentComponent } from './teacher-comment';
import * as moment from 'moment';

@Component({
	selector: 'app-missionary-teacher-comments',
	templateUrl: './teacher-comment-list.component.html',
	styleUrls: ['./teacher-comment-list.component.less']
})
export class TeacherCommentListComponent implements OnInit {

	missionary: any;

	comments: any = [];

	checkboxTableColumns: CheckboxTableColumn[] = [
		{ title: 'When Created', attr: 'dateCreated', width: 15, fixed: true, mtcDate: true},
		{ title: 'Author', attr: 'author', width: 15, fixed: true,  isBold: true },
		{ title: 'Comment', attr: 'comment', width: 35, fixed: true, showTwoLines: true },
		{ title: 'Plan', attr: 'plan', width: 35, fixed: true, showTwoLines: true },
	];
	checkboxTableConfig: CheckboxTableConfig = {
		headerHeight: 48,
		rowHeight: 70,
		rowFunction: this.openComment.bind(this),
	};

	constructor(private missionaryService: MissionaryService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.missionaryService.selectedMissionary.subscribe((miss) => {
			this.missionary = miss;
			if (this.missionary.missionaryId) {
				this.missionaryService.loadingCount++;
				this.missionaryService.getTeacherComments(this.missionary.missionaryId).subscribe((comments) => {
					this.comments = comments;
					this.missionaryService.loadingCount--;
				});
			}
		});
	}

	openComment(comment) {
		this.dialog.open(TeacherCommentComponent, {
			data: { comment: comment, missionary: this.missionary },
			width: '1020px',
			height: '575px'
		});
	}
}
