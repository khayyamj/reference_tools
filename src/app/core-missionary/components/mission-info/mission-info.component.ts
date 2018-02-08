import { Component, OnInit } from '@angular/core';
import { MissionaryService } from '../../services';
import { RolesService } from '../../../shared';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'app-missionary-mission-info',
	templateUrl: './mission-info.component.html',
	styleUrls: ['./mission-info.component.less']
})
export class MissionInfoComponent implements OnInit {

	missionary:any;
	itinerary:any;
	selectedTabIndex = 0;
	checkboxColumns: CheckboxTableColumn[] = [
		{ title: 'Travel Group', attr: 'unitAbbreviation' },
		{ title: 'Travel Type', attr: 'travelType' },
		{ title: 'Departure Date', attr: 'departureDate', mtcDate: true}

	];
	checkboxConfig: CheckboxTableConfig = {
		resultsCountName: false
	};

	constructor(public missionaryService: MissionaryService,
				public rolesService: RolesService) {
				this.missionaryService.selectedMissionary.subscribe((miss) => {
					this.missionary = miss;
				});
	}

	ngOnInit() { }

}
