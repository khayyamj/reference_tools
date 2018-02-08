import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { GridsterConfig } from 'angular-gridster2';
import { Observable } from 'rxjs/Observable';
import { WidgetService } from '../../services';
import { ManageDashboardComponent } from '../manage-dashboard';
import { DashboardService } from '../../services';

@Component({
	selector: 'dashboard-main',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

	options:GridsterConfig = {
		gridType: 'scrollVertical',
		margin: 8,
		minCols: 8,
		maxCols: 8,
		minRows: 5,
		maxRows: 100,
		maxItemCols: 4,
		minItemCols: 2,
		maxItemRows: 4,
		minItemRows: 1,
		maxItemArea: 16,
		minItemArea: 2,
		defaultItemCols: 2,
		defaultItemRows: 2,
		draggable: {
			enabled: true,
			stop: this.itemDragStop.bind(this),
			ignoreContent: true
		},
		pushItems: false,
		displayGrid: 'none'
	};
	gridHeight = 1200;
	changeCount = 0;

	constructor(public widgetService: WidgetService,
				private location: Location,
				@Inject(DOCUMENT) private doc: any,
				private dialog: MatDialog,
				public zone: NgZone,
				private dashboardService: DashboardService) {}

	ngOnInit() {
		this.widgetService.getUserWidgets().subscribe((data) => {
			this.widgetService.dashboard = data;
			this.widgetService.mapComponentsToDashboard();
			this.handleResize();
		});
		if(window.innerWidth < 1200) {
			this.location.go('');
		}
	}

	itemDragStop(widget, itemComponent) {
		if(itemComponent.drag.positionX % 2 !== 0){
			return Observable.throw(new Error()).toPromise();
		} else {
			setTimeout(() => {
				this.widgetService.updateUserWidgets().subscribe();
			});
			return Observable.of().toPromise();
		}
	}

	manageDashboard(){
		this.dialog.open(ManageDashboardComponent, {
			height: '660px',
			width: '1000px',
			data: this.widgetService.dashboard
		}).afterClosed().subscribe((userWidgets) => {
			if(userWidgets){
				this.widgetService.changeWidgets(userWidgets);
			}
		});
	}

	handleResize(){
		this.changeCount++;
		const row = this.doc.getElementsByClassName('row')[0];
		if(!row){
			this.gridHeight = 800;
		}else{
			const height = row.style.height;
			const newHeight = Number(height.slice(0,-2)) + this.options.margin;
			if(newHeight !== this.gridHeight){
				this.gridHeight = newHeight;
				this.changeCount = 0;
			}
		}
		if(this.changeCount < 5){
			setTimeout(() => this.handleResize(),500);
		}else{
			this.dashboardService.onResize(this.gridHeight);
		}
	}

	getHeight(rows){
		return this.gridHeight * rows + this.options.margin;
	}
}
