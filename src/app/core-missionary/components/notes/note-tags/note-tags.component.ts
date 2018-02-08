import { Component, OnInit } from '@angular/core';
import { MissionaryService, NoteService } from '../../../services';
import { MTCUser, CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import * as _ from 'lodash';

@Component({
	selector: 'app-note-tags',
	templateUrl: './note-tags.component.html',
	styleUrls: ['./note-tags.component.less']
})
export class NoteTagsComponent implements OnInit {

	displayTags: Array<any> = [
		{ tag: 'IFR', amount: 0, selected: false, notes: [], name: 'In Field Representative'},
		{ tag: 'Stake President', amount: 0, selected: false, notes: [], },
		{ tag: 'Mission President', amount: 0, selected: false, notes: [], },
		{ tag: 'MTC President', amount: 0, selected: false, notes: [], },
		{ tag: 'Branch President', amount: 0, selected: false, notes: [], },
		{ tag: 'Family', amount: 0, selected: false, notes: [], },
		{ tag: 'Clinical', amount: 0, selected: false, notes: [], },
		{ tag: 'Medical', amount: 0, selected: false, notes: [], },
		{ tag: 'Travel', amount: 0, selected: false, notes: [], },
		{ tag: 'Training', amount: 0, selected: false, notes: [], },
		{ tag: 'Scheduling', amount: 0, selected: false, notes: [], },
		{ tag: 'Missionary', amount: 0, selected: false, notes: [], },
	];
	tableHeaders: CheckboxTableColumn[] = [
		{title: 'Author', attr: 'createdByName', width: 15},
		{title: 'Note', attr: 'summary', width: 50, showTwoLines: true},
		{title: 'When Created', attr: 'createdDtHtml', width: 15},
		{title: 'Tag', attr: 'tags', isArray: {displayBy: 'abbrev',tooltip:'name'}, showTooltip: true, width: 10}
	];
	checkboxTableConfig: CheckboxTableConfig = {
		headerHeight: 48,
		buttonColumnWidth: 5,
		rowHeight: 70,
		rowButtons: [{ text: 'edit', function: this.editNote.bind(this)}],
		rowFunction: this.viewNote.bind(this)
	};
	missionary: any;
	expandAll;
	user;

	constructor(
		private missionaryService: MissionaryService,
		private userService: MTCUser,
		private noteService: NoteService,
	) {	}

	ngOnInit() {
		this.missionaryService.selectedMissionary.subscribe((missionary) => {
			this.missionary = missionary;
			if (Object.keys(missionary).length !== 0) {
				if (_.isEmpty(this.missionary.noteList) && this.missionary.noteCount > 0) {
					setTimeout(() => this.noteService.getMissionaryNotes(this.missionary).subscribe(() => this.tagUpdate()));
				}
				this.tagUpdate();
			}
		});

		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});

	}

	tagUpdate() {
		this.displayTags.forEach(tagToClear => tagToClear.notes = []);
		if (_.isEmpty(this.missionary.noteList)) {
			this.displayTags.forEach((tag) => {
				tag.amount = tag.notes.length;
			});
			return;
		}
		this.missionary.noteList.forEach((note) => {
			if (!note.tags || (note.archivedDt && !this.missionary.showArchivedNotes)) {
				return;
			}
			note.tags.forEach((noteTag) => {
				//TODO this for loop should be a for each
				for (const tag in this.displayTags) {
					if ((this.displayTags[tag].name || this.displayTags[tag].tag) === noteTag.tagName) {
						this.noteService.mapNoteTags(noteTag, this.missionary);
						this.displayTags[tag].notes.push(note);
					}
				}
			});
		});
		this.displayTags.forEach((tag) => {
			tag.amount = tag.notes.length;
		});
	}

	onSelect(tag: any):void {
		tag.expand = !tag.expand;
	}

	onExpandAll() {
		this.expandAll = !this.expandAll;
		return this.displayTags.map((tag) => {
			tag.expand = this.expandAll;
		});
	}

	openNoteModal(note, isEditing) {
		this.noteService.editNote(note, this.missionary, isEditing).subscribe(missionary => {
			this.missionary = missionary;
			this.displayTags.forEach(tag => {
				tag.notes = [];
			});
			this.tagUpdate();
		});
	}

	viewNote(note){
		this.openNoteModal(note, false);
	}

	editNote(note){
		this.openNoteModal(note, true);
	}

	shouldShowArchivedNotes(check, missionary) {
		missionary.showArchivedNotes = check;
		this.tagUpdate();
	}
}
