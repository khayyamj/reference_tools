import { Component, OnInit } from '@angular/core';
import { TravelWidgetService, WidgetService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'dashboard-no-itinerary-widget',
	templateUrl: './no-itinerary-widget.component.html',
	styleUrls: ['./no-itinerary-widget.component.less']
})
export class NoItineraryWidgetComponent implements OnInit {

	missionaries = [];
	checkboxTablePlaceholder: 'No-Itineraries Loading...';
	columns: CheckboxTableColumn[] = [
		{ title: 'Missionary', attr: 'fullName', width: 45, fixed: true },
		{ title: 'Departure', attr: 'mtcDeparture', width: 55, fixed: true, mtcDate: true }
	];

	checkboxTableConfig: CheckboxTableConfig = {
		resultsCountName: false
	};

	constructor(private travelWidgetService: TravelWidgetService,
				private widgetService: WidgetService) { }

	ngOnInit() {
		setTimeout(() => this.loadNoItineraryMissionaries());
	}

	loadNoItineraryMissionaries() {
		this.widgetService.widgetsLoading++;

		this.travelWidgetService.getNoItineraryMissionaries().subscribe((noItineraryData: any) => {
			this.missionaries = noItineraryData;
			this.widgetService.widgetsLoading--;
		});
	}
}
