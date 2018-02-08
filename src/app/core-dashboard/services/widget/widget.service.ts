import { Injectable } from '@angular/core';
import { HostnameService } from '../../../shared/index';
import { HttpClient } from '@angular/common/http';
import {
	NoItineraryWidgetComponent,
	NonMatchingItineraryWidgetComponent,
	MissingTravelPacketsWidgetComponent,
	WeekJuniorDeparturesWidgetComponent,
	DayJuniorDeparturesWidgetComponent,
} from '../../components';

@Injectable()
export class WidgetService {

	public dashboard: any;
	public widgetsLoading = 0;

	constructor(private hostname: HostnameService,
				private http: HttpClient) {}

	changeWidgets(newWidgets) {
		this.dashboard = newWidgets;
		this.mapComponentsToDashboard();
		this.updateUserWidgets().subscribe();
	}

	mapComponentsToDashboard() {
		this.dashboard.map((widget) => {
			switch (widget.id) {
				case 1:
					widget.component = NonMatchingItineraryWidgetComponent;
					break;
				case 2:
					widget.component = NoItineraryWidgetComponent;
					break;
				case 3:
					widget.component = MissingTravelPacketsWidgetComponent;
					break;
				case 4:
					widget.component = WeekJuniorDeparturesWidgetComponent;
					break;
				case 5:
					widget.component = DayJuniorDeparturesWidgetComponent;
					break;
				default:
					break;
			}
		});
	}

	//TODO Combine into one endpoint when backend model for widget has "selected"
	public getAvailableWidgets() {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}widgets`);
	}

	public getUserWidgets() {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}widgets/user`);
	}

	public updateUserWidgets() {
		return this.http.put(`${this.hostname.mtcToolsAPIUrl}widgets/user/update`, this.dashboard);
	}
}
