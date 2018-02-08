import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { MTCUser } from 'mtc-modules';

import { DepartureGroupService } from '../../services';
import * as _ from 'lodash';

@Component({
	selector: 'travel-departure-note-editor',
	templateUrl: './departure-note-editor.component.html',
	styleUrls: ['./departure-note-editor.component.less']
})
export class DepartureNoteEditorComponent implements OnInit {
	public note: any;
	public originalNote: any;
	public viewer: any;
	public firstTime = false;
	public edit = false;
	public config: any = {};
	public showConfirmation: boolean;
	private dialogType;

	@ViewChild('input') private input: ElementRef;

	constructor(public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) private data: any,
		private departureGroupService: DepartureGroupService,
		private userService: MTCUser) { }

	ngOnInit() {
		this.note = _.cloneDeep(this.data);
		if (!this.note || !this.note.note) {
			this.note = {
				note: '',
				dgId: this.note.dgId
			};
			this.firstTime = true;
			this.startEdit();
		}
		this.userService.getUser().subscribe((user) => {
			this.viewer = user;
			if (this.note.noteId && this.note.modBy !== this.viewer.id) {
				this.note.readBy = this.viewer.id;
				this.note.readDate = new Date().getTime();
				this.departureGroupService.updateNote(this.note).subscribe();
			}
		});
	}

	startEdit() {
		const delayFromFullInit = 500;
		this.originalNote = _.cloneDeep(this.note);
		this.edit = true;
		setTimeout(() => {
			this.input.nativeElement.focus();
		}, delayFromFullInit);
	}

	cancelEdit() {
		this.dialogRef.close();
	}

	save(form) {
		if (form.valid) {
			this.note.modBy = this.viewer.id;
			this.note.note = form.value.note;
			this.departureGroupService.createNote(this.note).subscribe((note:any) => {
				this.note = note;
				this.dialogRef.close(this.note);
			});
		}
	}

	deleteNote() {
		this.dialogType = 'delete';
		this.config = {
			content: 'Are you sure you want to delete this note?',
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete'
		};
		this.showConfirmation = true;
	}

	confirmation(answer) {
		if(answer) {
			if (this.dialogType === 'delete') {
				this.departureGroupService.deleteNote(this.note.noteId).subscribe(() => {
					this.dialogRef.close('delete note');
				});
			}
		} else {
			this.showConfirmation = false;
		}
	}

}
