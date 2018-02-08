import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
	selector: 'app-missionary-teacher-comments',
	templateUrl: './teacher-comment.component.html',
	styleUrls: ['./teacher-comment.component.less']
})
export class TeacherCommentComponent implements OnInit {

	missionary: any;
	comment: any;

	constructor( @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

	ngOnInit() {
		this.comment = this.dialogData.comment;
		this.missionary = this.dialogData.missionary;
	}
}
