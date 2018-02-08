import { Component, OnInit } from '@angular/core';
import { GeneralTravelNotesService } from '../../services';
import { Router } from '@angular/router';
import { MTCToastService, MTCUser } from 'mtc-modules';
import * as _ from 'lodash';

interface GeneralNote {
	id: number;
	noteDesc: string;
	noteContent: string;
	modBy: string;
	modDate: string;
	modName: string;
	reportId: number;
}

@Component({
	selector: 'travel-settings-general-notes',
	templateUrl: './general-travel-notes.component.html',
	styleUrls: ['./general-travel-notes.component.less']
})
export class GeneralTravelNotesComponent implements OnInit {
	edit = false;

	generalNotes: Array<GeneralNote> = null;
	generalNotesCopy: Array<GeneralNote> = null;
	tabs = ['general notes','leader notes','luggage notes'];
	reportId = 0;
	username = '';

	editorConfig = {
		theme: 'bubble',
		modules: {
			toolbar: [
				['bold', 'italic', 'underline'],
				[{ 'list': 'ordered' }, { 'list': 'bullet' }],
				[{ 'indent': '-1' }, { 'indent': '+1' }]
			]
		},
	};

	constructor(private generalTravelNotesService: GeneralTravelNotesService,
				private router: Router,
				private toastService: MTCToastService,
				private userService: MTCUser) {
		this.userService.getUser().subscribe((user) => {
			this.username = user.name;
		});
	}

	ngOnInit() {
		this.generalTravelNotesService.getGeneralNotes().subscribe((notes:any) => {
			this.generalNotes = notes;
			this.generalNotesCopy = notes;
		});
	}

	getCurrentReport() {
		return this.generalNotes.find((gn) => {
			return gn.reportId.toString() === this.reportId.toString();
		});
	}

	back() {
		this.edit = false;
		this.router.navigate(['/travel/settings']);
	}

	cancel() {
		this.generalNotes = _.cloneDeep(this.generalNotesCopy);
		this.edit = false;
	}

	save() {
		this.edit = false;
		const changedNotes = this.generalNotes.filter((note) => {
			return note.reportId.toString() === this.reportId.toString();
		});
		this.generalTravelNotesService.setGeneralNotes(changedNotes).subscribe(() => {
			const toastMessage = this.reportId.toString() === '0' ? 'General notes' : 'Travel leader notes';
			this.toastService.success(toastMessage + ' <strong>successfully</strong> saved');
			changedNotes.forEach((note) => {
				note.modName = this.username;
				note.modDate = new Date().getTime().toString();
			});
		}, () => {
			this.toastService.error('General travel notes <strong>failed</strong> to save');
		});
	}
}
