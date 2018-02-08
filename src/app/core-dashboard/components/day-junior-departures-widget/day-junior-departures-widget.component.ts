import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoreWidgetService, DashboardService, WidgetService } from '../../services';
import { MtcDatePipe } from 'mtc-modules';
import * as moment from 'moment';

@Component({
	selector: 'dashboard-day-junior-departures-widget',
	templateUrl: './day-junior-departures-widget.component.html',
	styleUrls: ['./day-junior-departures-widget.component.less']
})
export class DayJuniorDeparturesWidgetComponent implements OnInit {

	missionaries = [];
	@ViewChild('graph') graph: ElementRef;
	sundayLabel = '';
	saturdayLabel = '';

	get height(){
		return this.graph.nativeElement.clientHeight;
	}
	get width(){
		return this.graph.nativeElement.clientWidth;
	}

	constructor(private coreWidgetService: CoreWidgetService,
				private dashboardService: DashboardService,
				private widgetService: WidgetService,
				private datePipe: MtcDatePipe) { }

	ngOnInit() {
		const currWeekSunday = moment().clone().startOf('week').startOf('day');
		this.changeSelected(currWeekSunday);
	}

	changeSelected(newDate){
		setTimeout(() => this.loadWidget(newDate));
	}

	loadWidget(date){
		this.widgetService.widgetsLoading++;

		this.coreWidgetService.getWeekDepartureCountsByDay(this.datePipe.transform(date)).subscribe((weekDepartureData: any) => {
			this.dashboardService.resizeSubject.subscribe(() => {
				this.plotGraph(weekDepartureData);
			});

			this.plotGraph(weekDepartureData);
			this.widgetService.widgetsLoading--;
		});
	}


	plotGraph(days){
		const colors = {
			Mon: '#51BC95',
			Tue: '#7F6DB0',
			Wed: '#FFC600',
			Thu: '#EF5458',
			Fri: '#B4A4DF',
			Sat: '#A3E3CB',
			Sun: '#FFE897'
		};
		const data = [{
			values: days.map(d => d.count),
			labels: days.map(d => d.day),
			marker: {
				colors: days.map(d => colors[d.day])
			},
			hole: .8,
			type: 'pie',
			textinfo: 'value',
			textposition: 'outside',
			sort: false
		}];
		const layout = {
			autosize: true,
			showlegend: true,
			height: this.height,
			width: this.width,
			margin:{
				l: this.width / 20,
				r: this.width / 5,
				b: this.height / 5,
				t: this.height / 10,
			}
		};

		const config = {
			doubleClick: false,
			showTips: false,
			showAxisDragHandles: false,
			displayModeBar: false,
			scrollZoom: false
		};

		try {
			Plotly.purge(this.graph.nativeElement);
			Plotly.newPlot(this.graph.nativeElement, data, layout, config);
		} catch (error) {
			setTimeout(() => {
				this.plotGraph(days);
			}, 500);
		}
	}
}
