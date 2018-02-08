import { Component, OnInit } from '@angular/core';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { ToolsInfoService } from '../../../shared';
import { MissionService } from '../../services/';
import { Router } from '@angular/router';

@Component({
	selector: 'app-mission-search',
	templateUrl: './mission-search.component.html',
	styleUrls: ['./mission-search.component.less']
})
export class MissionSearchComponent implements OnInit {

	columns: CheckboxTableColumn[] = [
		{ title: 'Mission', attr: 'name' },
		{ title: 'Unit #', attr: 'id' },
	];
	config: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Open All', function: this.openChecked.bind(this) }
		],
		placeholder: 'No missions match the filter'
	};
	filteredRows:any[] = [];
	rows:any[] = [];

	_filter = '';
	get missionFilter(){
		return this._filter;
	}
	set missionFilter(filter){
		this.filteredRows = this.rows.filter((m) => {
			return  m.name.toLowerCase().includes(filter.toLowerCase()) ||
					m.id.toLowerCase().includes(filter.toLowerCase());
		});
		this._filter = filter;
	}

	constructor(private toolsInfoService: ToolsInfoService,
				private missionsService: MissionService,
				private router: Router) { }

	ngOnInit() {
		this.toolsInfoService.isLoaded('missions').subscribe((missions) => {
			this.rows = missions;
			this.missionFilter = '';
		});
	}

	openChecked(selectedMissions){
		selectedMissions.forEach((row, index) => {
			row.selected = false;
			this.missionsService.addMission(row.id, index === 0);
		});
		this.router.navigate(['/missions/search/view']);
	}

}
