import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NoteService, MissionaryService } from '../../services';
import { RolesService } from '../../../shared';
import { AddNoteComponent } from './add-note';
import { SimpleConfirmationComponent, MTCToastService, CheckboxTableColumn, CheckboxTableConfig, MTCUser, MtcTimePipe, MtcDatePipe } from 'mtc-modules';
import * as _ from 'lodash';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.less']
})
export class NotesComponent implements OnInit {
	editComment:any;
	user:any;
	missionary:any;
	showPicture = true;
	viewTags = false;

	columns: CheckboxTableColumn[] = [
		{ title: 'Author', attr: 'createdByName', width: 15, isBold: true},
		{ title: 'Note', attr: 'summary', width: 50, showTwoLines:true},
		{ title: 'When Created', attr: 'createdDtHtml', width: 15 }
	];
	checkboxTableConfig: CheckboxTableConfig = {
		rowFunction: this.openNote.bind(this),
		headerHeight: 48,
		rowHeight: 70
	};
	placeholder = 'No notes have been created for this missionary';

	constructor(private userService: MTCUser,
				private dialog: MatDialog,
				private noteService:NoteService,
				public missionaryService: MissionaryService,
				public mtcDatePipe: MtcDatePipe,
				public mtcTimePipe: MtcTimePipe,
				public rolesService: RolesService,
				private toastService: MTCToastService) { }

	ngOnInit() {
		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});
		this.rolesService.loaded.subscribe(()=>{
			if(this.rolesService.canCreateConfidentialNotes){
				this.columns.push({title: 'Visibility', attr: 'visName', isBold: true});
				this.checkboxTableConfig.rowButtons = [{ text: 'edit', function: (note) => this.openNote(note,true) }];
			}
		});
		this.missionaryService.selectedMissionary.subscribe((theMissionary) => {
			if (!_.isEmpty(theMissionary)) {
				this.missionary = theMissionary;
				this.missionary.noteList = [];
				setTimeout(() => this.noteService.getMissionaryNotes(this.missionary));
			}
		});
	}

	addNote(){
		//TODO remove createdBy when missionary systems is turned off.
		this.openNote({
			noteText:'',
			subject:'',
			createdBy:this.user.byuPersonId,
			entityType: 'missionary',
			entityId: this.missionary.missionaryId,
			tags: []
		},true);
	}

	openNote(note,isCreate = false){
		this.dialog.open(AddNoteComponent, {
			data: { missionary: this.missionary, note: note, isCreate: isCreate },
			width: '1020px',
			height: '575px'
		}).afterClosed().subscribe((newNote) => {
			if(newNote){
				this.noteService.createNote(newNote, isCreate).subscribe(([noteResponse]) => {
					this.missionary.noteCount++;
					this.toastService.success(`Note saved <strong>successfully</strong>`);
					this.mapNoteTags(noteResponse);
					if(isCreate){
						this.missionary.noteList.unshift(noteResponse);
					}else{
						this.missionary.noteList.splice(this.missionary.noteList.findIndex((oldNote) => {
							return oldNote.noteId === newNote.noteId;
						}), 1, noteResponse);
					}
				});
				if(newNote.visName !== 'Public'){
					this.createPublicNote();
				}
			}
		});
	}

	mapNoteTags(note){
		note.tags.map((tag)=>{ this.noteService.mapNoteTags(tag, this.missionary); });
	}

	createPublicNote(){
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: 'You have created a note with limited visibility, would you like to create another public note?'
			},
			width: '500px',
			height: '175px'
		}).afterClosed().subscribe((response) => {
			if(response){
				//TODO remove createdBy when missionary systems is turned off.
				this.openNote({
					noteText:'',
					subject:'',
					createdBy:this.user.byuPersonId,
					entityType: 'missionary',
					entityId: this.missionary.missionaryId,
					visName: 'Public',
					visId: 1,
					tags: []
				},true);
			}
		});
	}


}
