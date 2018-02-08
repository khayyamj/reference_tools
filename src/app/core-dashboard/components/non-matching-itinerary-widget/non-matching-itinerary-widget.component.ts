import { Component, OnInit } from '@angular/core';
import { TravelWidgetService, WidgetService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'dashboard-non-matching-itinerary-widget',
	templateUrl: './non-matching-itinerary-widget.component.html',
	styleUrls: ['./non-matching-itinerary-widget.component.less']
})
export class NonMatchingItineraryWidgetComponent implements OnInit {

	missionaries = [];
	checkboxTablePlaceholder: 'Non-Matching-Itineraries Loading...';
	columns: CheckboxTableColumn[] = [
		{ title: 'Travel Group', attr: 'missionAbbreviation', width: 55, fixed: true },
		{ title: 'Passengers', attr: 'travelGroupMemberCount', width: 35, fixed: true }
	];
	checkboxConfig: CheckboxTableConfig = {
		resultsCountName: false
	};

	constructor(private travelWidgetService: TravelWidgetService,
				private widgetService: WidgetService) { }

	ngOnInit() {
		setTimeout(() => this.loadNonMatchingItineraries());
	}

	loadNonMatchingItineraries() {
		this.widgetService.widgetsLoading++;

		this.travelWidgetService.getNonMatchingItineraryMissionaries().subscribe((nonMatchingItineraryData: any) => {
			this.missionaries = nonMatchingItineraryData;
			this.widgetService.widgetsLoading--;
		});
	}
}
