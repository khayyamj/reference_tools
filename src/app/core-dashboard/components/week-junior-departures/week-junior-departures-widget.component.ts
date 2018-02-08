import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoreWidgetService, DashboardService, WidgetService } from '../../services';
import * as moment from 'moment';

@Component({
	selector: 'dashboard-week-junior-departures-widget',
	templateUrl: './week-junior-departures-widget.component.html',
	styleUrls: ['./week-junior-departures-widget.component.less']
})
export class WeekJuniorDeparturesWidgetComponent implements OnInit {

	@ViewChild('graph') graph: ElementRef;

	constructor(private coreWidgetService: CoreWidgetService,
				private dashboardService: DashboardService,
				private widgetService: WidgetService) { }

	ngOnInit() {
		setTimeout(() => this.loadWeekJrDepartures());
	}

	loadWeekJrDepartures() {
		this.widgetService.widgetsLoading++;
		this.coreWidgetService.getWeekDepartureCounts().subscribe((counts) => {
			this.dashboardService.resizeSubject.subscribe(() => {
				this.plotGraph(counts);
			});
			this.widgetService.widgetsLoading--;
		});

	}

	plotGraph(counts) {
		try {
			const data = [{
				x: counts.map(c => moment(c.startDate).format('DD MMM') + '-' + moment(c.endDate).format('DD MMM')),
				y: counts.map(c => c.count),
				text: counts.map(c => c.count),
				width: counts.map(() => .25),
				textposition: 'outside',
				hoverinfo: 'none',
				type: 'bar',
				name: 'Total Departures',
				marker: {
					color: 'rgb(128,186,149)'
				}
			}];

			const layout = {
				height: this.graph.nativeElement.clientHeight,
				width: this.graph.nativeElement.clientWidth,
				font: {
					family: 'Open Sans, sans-serif'
				},
				showlegend: true,
				bargap: 0.05,
				legend: {
					orientation: 'h',
					x: .75
				},
				xaxis: {
					fixedRange: true
				},
				yaxis: {
					fixedRange: true,
					range: [0, Math.max(...counts.map(c => c.count))+100]
				},
				margin: {
					l: 50,
					r: 25,
					b: 20,
					t: 10
				}
			};

			const config = {
				doubleClick: false,
				showTips: false,
				showAxisDragHandles: false,
				displayModeBar: false,
				scrollZoom: false,
				staticPlot: true
			};

			Plotly.purge(this.graph.nativeElement);
			Plotly.plot(this.graph.nativeElement, data, layout, config);
		} catch (error) {
			setTimeout(() => {
				this.plotGraph(counts);
			}, 500);
		}
	}
}
