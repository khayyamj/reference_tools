import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { Router } from '@angular/router';
import { MTCToastService } from 'mtc-modules';
import { MissionaryService } from '../../services';

@Component({
	selector: 'app-missionary-search',
	templateUrl: './missionary-search.component.html',
	styleUrls: ['./missionary-search.component.less']
})
export class MissionarySearchComponent implements OnInit {
	@Input() open;
	@Output() openChange = new EventEmitter();
	@Input() options;
	@Output() optionsChange = new EventEmitter();
	@Input() missionaries;
	@Input() titleText;
	title = 'Search History';

	columns: CheckboxTableColumn[] = [
		{title: 'MISSIONARY', attr: 'fullName', fixed: true},
		{title: 'ID', attr: 'missionaryId', fixed: true},
		{title: 'MISSION', attr: 'missionName', fixed: true},
		{title: 'LANGUAGE', attr: 'trainingLanguage', fixed: true},
		{title: 'STATUS', attr: 'status', fixed: true},
		{title: 'ARRIVAL', attr: 'mtcArrival', fixed: true, mtcDate: true}
	];

	config: CheckboxTableConfig = {
		rowButtons: [
			{text: 'Open', function: this.openMissionary.bind(this) },
		],
		rowFunction: this.openRow.bind(this)
	};

	constructor(private toastService: MTCToastService,
				public router: Router,
				public missionaryTabs: MissionaryService) { }

	ngOnInit() {
	}

	close(){
		this.open = false;
		this.openChange.emit(this.open);
		this.optionsChange.emit(this.options);
	}

	openMissionary(missionary){
		if(!this.missionaryTabs.getMissionary(missionary.missionaryId)){
			this.router.navigate(['/missionary'], {queryParams: {missionaryId: missionary.missionaryId}});
			this.toastService.success(`${missionary.fullName} was <strong>successfully</strong> opened`);
		}
	}

	openRow(missionary){
		this.openMissionary(missionary);
		this.close();
	}
}
