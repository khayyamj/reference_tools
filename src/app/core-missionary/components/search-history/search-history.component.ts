import { Component, OnInit } from '@angular/core';
import { MissionaryApiService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { Router } from '@angular/router';


@Component({
	selector: 'app-missionary-search-history',
	templateUrl: './search-history.component.html',
	styleUrls: ['./search-history.component.less']
})
export class SearchHistoryComponent implements OnInit {
	missionaries: any = [];
	columns: CheckboxTableColumn[] = [
		{ title: 'MISSIONARY', attr: 'fullName', fixed: true },
		{ title: 'ID', attr: 'missionaryId', fixed: true },
		{ title: 'MISSION', attr: 'missionName', fixed: true },
		{ title: 'LANGUAGE', attr: 'trainingLanguage', fixed: true },
		{ title: 'STATUS', attr: 'status', fixed: true },
		{ title: 'ARRIVAL', attr: 'mtcArrival', fixed: true, mtcDate: true }
	];

	config: CheckboxTableConfig = {
		rowFunction: this.openMissionary.bind(this)
	};
	constructor(public missionaryAPIService: MissionaryApiService,
				private router: Router) {}

	ngOnInit() {
		this.missionaryAPIService.getMissionarySearchHistory().subscribe((missionariesResponse) => {
			this.missionaries = missionariesResponse;
		});
	}

	openMissionary(missionary) {
		this.router.navigate(['/missionary'], { queryParams: { missionaryId: missionary.missionaryId } });
	}

}
