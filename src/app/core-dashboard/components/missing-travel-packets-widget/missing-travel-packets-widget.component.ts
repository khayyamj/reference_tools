import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TravelWidgetService, DashboardService, WidgetService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'dashboard-missing-travel-packets-widget',
	templateUrl: './missing-travel-packets-widget.component.html',
	styleUrls: ['./missing-travel-packets-widget.component.less']
})
export class MissingTravelPacketsWidgetComponent implements OnInit {

	missionaries = [];
	@ViewChild('graph') graph: ElementRef;

	checkboxTablePlaceholder: 'Missing Travel Packets Loading...';

	columns: CheckboxTableColumn[] = [
		{ title: 'Missionary', attr: 'missionaryName', width: 55, fixed: true },
		{ title: 'Travel Group', attr: 'missionAbbreviation', fixed: true, width: 45 },
	];

	checkboxConfig: CheckboxTableConfig = {
		resultsCountName: false
	};

	constructor(private travelWidgetService: TravelWidgetService,
				private dashboardService: DashboardService,
				private widgetService: WidgetService) { }

	ngOnInit() {
		setTimeout(() => this.loadMissingTravelPackets());
	}

	loadMissingTravelPackets() {
		this.widgetService.widgetsLoading++;
		this.travelWidgetService.getMissingTravelPackets().subscribe((travelPacketsData: any) => {
			const totalPackets = travelPacketsData.length;
			this.missionaries = travelPacketsData.filter((packet) => {
				return !packet.received && !packet.resolvedDate;
			});
			this.dashboardService.resizeSubject.subscribe(() => {
				this.plotGraph(totalPackets, totalPackets - this.missionaries.length);
			});
			this.widgetService.widgetsLoading--;
		});
	}

	plotGraph(total, received) {
		const percentReceived = Math.floor((received / total) * 100);
		const color = percentReceived === 100 ? 'rgb(81,188,149)' : 'rgb(239,84,88)';
		const data = [{
			values: [percentReceived, 100 - percentReceived],
			labels: [received, total-received + ' '],
			marker: {
				colors: [color, 'rgb(255,255,255)']
			},
			hoverinfo: 'label',
			hole: .8,
			type: 'pie',
			textinfo: 'none'
		}];


		const layout = {
			showlegend: false,
			height: this.graph.nativeElement.clientHeight,
			width: this.graph.nativeElement.clientWidth,
			annotations: [
				{
					font: {
						size: 48,
						color: color,
						family: 'Open Sans, sans-serif'
					},
					showarrow: false,
					text: `<b>${percentReceived}%</b>`,
					x: 0.5,
					y: 0.55
				},
				{
					font: {
						size: 16,
						color: color,
						family: 'Open Sans, sans-serif'
					},
					showarrow: false,
					text: 'Received',
					x: 0.5,
					y: 0.38
				},
			],
			margin: {
				l: 30,
				r: 30,
				b: 10,
				t: 10
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
			if(!isNaN(percentReceived)){
				Plotly.purge(this.graph.nativeElement);
				Plotly.newPlot(this.graph.nativeElement, data, layout, config);
			}
		} catch (error) {
			setTimeout(() => {
				this.plotGraph(total, received);
			}, 500);
		}
	}
}
