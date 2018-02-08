import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MTCUser } from 'mtc-modules';
import { MissionaryService, NoteService } from '../../../services';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-print-summary-one-page',
	templateUrl: './print-summary-one-page.component.html',
	styleUrls: ['./print-summary-one-page.component.less']
})
export class PrintSummaryOnePageComponent implements OnInit {

	user: any;
	missionary: any = {};
	missionaryId: number;
	isDataAvailable = false;
	todaysDate;
	schedules: any[] = [];
	sub: Subscription;
	displayNotes: any = [];
	noteCnt = {
		publicNotes: 0,
		ecclNotes: 0,
		medicalNotes: 0
	};
	noMissionaryNotes = false;

	constructor(public missionaryService: MissionaryService,
				private noteService: NoteService,
				private userService: MTCUser,
				private router: Router) { }

	ngOnInit() {
		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});
		this.todaysDate = moment();
		this.sub = this.missionaryService.selectedMissionary.subscribe((miss) => {
			if (miss.missionaryId) {
				this.missionary = miss;
				this.schedules = this.missionary.mtcInfo.schedule || [];
				this.missionary.noteList = [];
				setTimeout(() => this.noteService.getMissionaryNotes(this.missionary).subscribe(() => this.initializeNotesSection(miss)));
			}
		});
	}

	initializeNotesSection(miss) {
		this.displayNotes = this.missionary.noteList.filter(note => {
			if(miss.printSummaryModalInfo.includePublicNotes && note.visName === 'Public') {
				this.noteCnt.publicNotes++;
				return true;
			} else if (miss.printSummaryModalInfo.includeConfidentialNotes && note.visName !== 'Public') {
				if(note.visName === 'Ecclesiastical') {
					this.noteCnt.ecclNotes++;
				} else if(note.visName === 'Medical-Clinical') {
					this.noteCnt.medicalNotes++;
				}
				return true;
			} else {
				return false;
			}
		});
		this.isDataAvailable = true;
		this.openPrintWindow();
	}

	openPrintWindow() {
		window.addEventListener('afterprint', () => this.closePage());
		setTimeout(() => window.print(), 0);
	}

	closePage() {
		this.sub.unsubscribe();
		this.router.navigate(['./missionary'], { queryParams: { missionaryId: this.missionary.missionaryId } });
	}


	showPublicNotes() {
		if(this.missionary.printSummaryModalInfo.includePublicNotes || this.missionary.printSummaryModalInfo.includeConfidentialNotes) {
			if(this.noteCnt.publicNotes + this.noteCnt.ecclNotes === 0) {
				this.noMissionaryNotes = true;
			}
			return true;
		}
		return false;
	}

	hasScheduleOrNotes(){
		return (
			this.showPublicNotes() ||
			(this.missionary.printSummaryModalInfo.includeSchedule && this.schedules.length > 0) ||
			this.missionary.printSummaryModalInfo.includeConfidentialNotes
		);
	}

}
