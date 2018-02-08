import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MTCUser } from 'mtc-modules';
import { MissionaryService, NoteService } from '../../../services';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-print-summary-clinical',
	templateUrl: './print-summary-clinical.component.html',
	styleUrls: ['./print-summary-clinical.component.less']
})
export class PrintSummaryClinicalComponent implements OnInit {

	user: any;
	missionary: any = {};
	isDataAvailable = false;
	todaysDate;
	schedules;
	sub: Subscription;

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
				setTimeout(() => this.noteService.getMissionaryNotes(this.missionary).subscribe(() => {
					this.isDataAvailable = true;
					this.openPrintWindow();
				}));
				this.schedules = this.missionary.mtcInfo.schedule;
			}
		});

	}

	openPrintWindow() {
		window.addEventListener('afterprint', () => this.closePage());
		setTimeout(() => window.print(), 0);
	}

	closePage() {
		this.sub.unsubscribe();
		this.router.navigate(['./missionary'], { queryParams: { missionaryId: this.missionary.missionaryId } });
	}

}
