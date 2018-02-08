import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { ApiLogsService } from '../../services';
import * as moment from 'moment';

@Component({
	selector: 'app-log-list',
	templateUrl: './log-list.component.html',
	styleUrls: ['./log-list.component.less']
})

export class LogListComponent implements OnInit {
	columns: CheckboxTableColumn[] = [
		{ title: 'ID', attr: 'id' },
		{ title: 'API', attr: 'api' },
		{ title: 'Level', attr: 'logLevel' },
		{ title: 'Message', attr: 'message', showTwoLines: true },
		{ title: 'Date', attr: 'createdDate' },
	];
	config: CheckboxTableConfig = {
		topButtons: [
			{ text:'archive', function:this.archive.bind(this) }
		],
	};
	showCalendar: boolean;
	showBackArrow: boolean;

	constructor(private dialog: MatDialog,
				public apilogsService: ApiLogsService) {}

	ngOnInit() {
		this.apilogsService.getLogs(moment().startOf('week'),moment().endOf('week'));
	}

	selectDate(newDate) {
		this.apilogsService.getLogs(newDate[0],newDate[1]);
	}

	view() { }

	archive() {	}
}
