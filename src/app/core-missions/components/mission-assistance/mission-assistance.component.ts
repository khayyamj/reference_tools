import { Component, OnInit, Input } from '@angular/core';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { MissionApiService } from '../../services';

@Component({
	selector: 'app-mission-assistance',
	templateUrl: './mission-assistance.component.html',
	styleUrls: ['./mission-assistance.component.less']
})
export class MissionAssistanceComponent implements OnInit {

	columns: CheckboxTableColumn[] = [
		{ title: 'Category', attr: 'category' },
		{ title: 'Item', attr: 'name' },
		{ title: 'Mission Requirement', type: 'number', attr: 'quantity', editFunction: this.edit.bind(this)},
	];
	config: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Restore Default', function: this.restoreDefaults.bind(this),  },
			{ text: 'Open Call Packet', function: this.openUrl.bind(this), alwaysVisible: true }
		],
		placeholder: 'No items were found'
	};
	filteredRows: any[] = [];
	rows: any[] = [];

	@Input() set assistance(assistance){
		this.rows = assistance || [];
		this.itemType = this._itemType;
	}

	@Input() missionId = '';

	_itemType = 'E';
	set itemType(type) {
		this._itemType = type;
		this.filteredRows = this.rows.filter(r => type === r.missionaryType);
	}
	get itemType() {
		return this._itemType;
	}

	constructor(private missionApiService: MissionApiService) { }

	ngOnInit() {
	}

	openUrl(){
		window.open(`https://intra.mtc.byu.edu/reports
						?MISSIONARY=${this.itemType}
						&MISSIONID=${this.missionId}
						&hidden_run_parameters=mas
						&report=ClothingListMissionary
						&generate=Generate+the+Report`);
	}

	edit(newQuantity,assistanceItem){
		if(!newQuantity){
			assistanceItem.quantity = 0;
		}
		this.missionApiService.updateAssistance(this.missionId,[assistanceItem],false);
	}

	restoreDefaults(items){
		this.missionApiService.updateAssistance(this.missionId,items,true);
	}

}
