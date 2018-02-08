import { Component, OnInit } from '@angular/core';
import { ZoneManagementService } from '../../services';
import { ToolsInfoService } from '../../../shared';
import { MatDialog } from '@angular/material';
import { EditZoneComponent } from './edit-zone';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'scheduling-zone-management',
	templateUrl: './zone-management.component.html',
	styleUrls: ['./zone-management.component.less']
})
export class ZoneManagementComponent implements OnInit {
	allResults = {
		selected: false
	};
	loading = false;
	criteria: any;
	results: any;
	filteredZones = [];
	criteriaItems=[
		{items:'zones', placeholder:'Zone'},
		{items:'traininglanguages', placeholder:'Language'},
		{items:'schedules', placeholder:'Schedule'},
		{items:'branches', placeholder:'Branch'}
	];
	tablePlaceholder = 'Enter your search criteria on the left';
	columns: CheckboxTableColumn[] = [
		{ title: 'Zone', attr: 'zone' },
		{ title: 'Language', attr: 'language' },
		{ title: 'Schedule', attr: 'schedule' },
		{ title: 'Branch', attr: 'branch' }
	];
	checkboxTableConfig: CheckboxTableConfig = {
		topButtons: [{text: 'Remove', function: this.removeSelected.bind(this)}],
		rowButtons: [{text: 'Edit', function: this.editZone.bind(this)}]
	};
	allSelected = false;
	constructor(private zoneManagementService: ZoneManagementService,
				public toolsInfoService: ToolsInfoService,
				private dialog: MatDialog) {	}

	ngOnInit() {
		this.zoneManagementService.getZones().subscribe(() => {
			this.zoneManagementService.searchZones();
		});
		this.criteria = this.zoneManagementService.criteria;
		this.zoneManagementService.results.subscribe((newResults) => {
			this.results = newResults;
		});
	}

	removeSelected() {
		this.results = this.results.filter(result => !result.selected);
	}

	filterFunction(item, regex) {
		if (item.name || item.zone) {
			const displayName = item.name || item.zone;
			return displayName.toLowerCase().match(regex) !== null;
		}
	}

	searchZones() {
		this.loading = true;
		setTimeout(() => {
			this.zoneManagementService.searchZones();
			this.loading = false;
			if (!this.results.length) {
				this.tablePlaceholder = 'No results have been found.';
			}
		});
	}

	clearCriteria() {
		this.zoneManagementService.clearCriteria();
		this.criteria = this.zoneManagementService.criteria;
		this.results = [];
	}

	editZone(zone) {
		this.zoneManagementService.getZoneById(zone.zoneId).subscribe((zoneData:any) => {
			this.openDialog(zoneData);
		});
	}

	openDialog(initData) {
		const dialogResult = this.dialog.open(EditZoneComponent, {
				data:initData,
				disableClose:true
		});
		dialogResult.afterClosed().subscribe(() => {
			this.zoneManagementService.getZones();
		});
	}
}
