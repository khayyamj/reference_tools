import { Component, OnInit } from '@angular/core';
import { MissionaryService } from '../../services';
import { RolesService } from '../../../shared';
import { MatDialog } from '@angular/material';
import { PrintSummaryModalComponent } from '../print-summary/print-summary-modal';
import { Router } from '@angular/router';

@Component({
	selector: 'app-missionary-overview',
	templateUrl: './missionary-overview.component.html',
	styleUrls: ['./missionary-overview.component.less']
})
export class MissionaryOverviewComponent implements OnInit {

	missionary:any;

	constructor(private missionaryService: MissionaryService,
				public rolesService: RolesService,
				private dialog: MatDialog,
				private router: Router
			) {}

	ngOnInit() {
		this.missionaryService.selectedMissionary.subscribe((miss) => {
			this.missionary = miss;
		});
	}

	openPrintSummaryModal() {
		this.dialog.open(PrintSummaryModalComponent, {
			width: '400px'
		}).afterClosed().subscribe((printSummaryModalInfo) => {
			if (printSummaryModalInfo) {
				this.missionary.printSummaryModalInfo = printSummaryModalInfo;
				if (printSummaryModalInfo.reportType === 'clinical') {
					this.router.navigate(['missionary/print-summary-clinical']);
				} else {
					this.router.navigate(['missionary/print-summary-one-page']);
				}
			}
		});
	}
}
