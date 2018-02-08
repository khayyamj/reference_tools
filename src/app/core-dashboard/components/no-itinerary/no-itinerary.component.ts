import { Component, OnInit } from '@angular/core';
import { TravelWidgetService } from '../../services';
import { CheckboxTableColumn } from 'mtc-modules';
import { TravelTypeFilterService } from './../../../shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'dashboard-no-itinerary-component',
	templateUrl: './no-itinerary.component.html',
	styleUrls: ['./no-itinerary.component.less']
})
export class NoItineraryComponent implements OnInit {

	missionaries = [];
	allMissionaries = [];

	checkboxTablePlaceholder: 'No-Itineraries Loading...';

	columns: CheckboxTableColumn[] = [
		{ title: 'Missionary', attr: 'fullName', width: 33, fixed: true },
		{ title: 'Abbreviation', attr: 'missionAbbreviation', width: 33},
		{ title: 'Departure', attr: 'mtcDeparture', width: 33, fixed: true, mtcDate: true }
	];

	filters = [];
	loading = true;

	constructor(private travelWidgetService: TravelWidgetService, private typeFilter: TravelTypeFilterService,
		private route: ActivatedRoute,
		private router: Router) { }

	ngOnInit() {
		this.travelWidgetService.getNoItineraryMissionaries().subscribe((noItineraryData: any) => {
			this.allMissionaries = noItineraryData;
			this.loading = false;
			this.filterMissionaries(this.filters);
		});
	}

	filterMissionaries(filters) {
		this.filters = filters;
		this.missionaries = this.allMissionaries.filter((missionary) => this.typeFilter.checkMissionaryFilter(filters,missionary));
	}

	back() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
