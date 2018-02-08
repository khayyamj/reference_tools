import { Component, OnInit } from '@angular/core';
import { TravelWidgetService } from '../../services';
import { CheckboxTableConfig, CheckboxTableColumn } from 'mtc-modules';
import { TravelTypeFilterService } from './../../../shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'dashboard-non-matching-itinerary-component',
	templateUrl: './non-matching-itinerary.component.html',
	styleUrls: ['./non-matching-itinerary.component.less']
})
export class NonMatchingItineraryComponent implements OnInit {

	missionaries = [];
	allMissionaries = [];

	config: CheckboxTableConfig = {
		rowButtons: [{
			text: 'Remove',
			function: this.remove.bind(this)
		}]
	};

	columns: CheckboxTableColumn[] = [
		{ title: 'Travel Group', attr: 'missionAbbreviation', width: 30, fixed: true },
		{ title: 'Passengers', attr: 'travelGroupMemberCount', width: 20, fixed: true },
		{ title: 'Flight 1', attr: 'flight1'},
		{ title: 'Flight 2', attr: 'flight2'},
		{ title: 'Flight 3', attr: 'flight3'},
		{ title: 'Flight 4', attr: 'flight4'},
		{ title: 'Departure Date', attr: 'departureDate', mtcDate: true}
	];

	filters = [];
	loading = true;

	constructor(private travelWidgetService: TravelWidgetService, private typeFilter: TravelTypeFilterService,
		private route: ActivatedRoute,
		private router: Router) { }

	ngOnInit() {
		this.travelWidgetService.getNonMatchingItineraryMissionaries().subscribe((nonMatching: any) => {
			this.allMissionaries = nonMatching;
			this.loading = false;
			this.filterMissionaries(this.filters);
		});
	}

	filterMissionaries(filters) {
		this.filters = filters;
		this.missionaries = this.allMissionaries.filter((missionary) => {
			return (filters.domestic && missionary.domestic)
				|| (filters.international && !missionary.domestic);
		});
	}

	remove(missionary){
		this.travelWidgetService.ignoreTravelGroups(missionary.travelGroupId).subscribe(() => {
			this.allMissionaries.splice(this.allMissionaries.findIndex(m => m === missionary),2);
			this.filterMissionaries(this.filters);
		});
	}

	back() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
