import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WidgetService } from '../../services';

@Component({
	selector: 'dashboard-manage-dashboard',
	templateUrl: './manage-dashboard.component.html',
	styleUrls: ['./manage-dashboard.component.less']
})
export class ManageDashboardComponent implements OnInit {

	newWidget: any = {};
	availableWidgets: any;

	constructor(private widgetService: WidgetService,
				public dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private dialogData: any) { }

	ngOnInit() {
		this.widgetService.getAvailableWidgets().subscribe((data) => {
			this.availableWidgets = data;
			this.availableWidgets.map((widget) => {
				this.dialogData.forEach(userWidget => {
					if (userWidget.id === widget.id) {
						widget.selected = true;
						Object.assign(widget, userWidget);
					}
				});
			});
		});
	}

	save(){
		const savedWidgets = this.availableWidgets.filter(widget => widget.selected).sort((a, b) => {
			if (a.x !== undefined && b.x === undefined) {
				return -1;
			} else if (a.x === undefined && b.x !== undefined) {
				return 1;
			} else {
				return a.x-b.x;
			}
		});
		this.dialogRef.close(savedWidgets);
	}
}
