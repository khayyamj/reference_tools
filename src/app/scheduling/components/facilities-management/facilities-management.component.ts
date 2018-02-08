import { Component, OnInit } from '@angular/core';
import { FacilitiesManagementService } from '../../services';
import { MatDialog } from '@angular/material';
import { RoomHistoryComponent } from '../room-history';
import { EditRoomComponent } from './edit-room';
import { EditFacilitiesFutureChangesComponent } from './edit-facilities-future-changes';
import { ToolsInfoService } from '../../../shared';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'scheduling-facilities-management',
	templateUrl: './facilities-management.component.html',
	styleUrls: ['./facilities-management.component.less']
})
export class FacilitiesManagementComponent implements OnInit {

	loading = false;
	criteria: any={};
	results: any;
	rooms;
	searchExecuted = false;
	tablePlaceholder = 'Enter your search criteria on the left';
	possibleRooms = [];
	inputList = [
		{
			placeholder:'Building',
			items:'buildings',
			itemChosenChange:this.onBuildingChosen.bind(this)
		},{
			placeholder:'Room Number',
			items:'rooms',
			displayBy:'room'
		},{
			placeholder:'Usage',
			items:'usage'
		},{
			placeholder:'Sub-Usage',
			items:'subusage'
		},{
			placeholder:'Room-Status',
			items:'roomStatuses'
		}
	];

	checkboxTableConfig: CheckboxTableConfig={
		buttonColumnWidth: 15,
		export: true,
		topButtons:[
			{text:'Edit', function: this.editRoom.bind(this)},
			{text: 'Remove', function: this.removeSelected.bind(this)}
		],
		rowButtons:[
			{text:'History', function: this.viewHistory.bind(this)},
			{text:'Future Changes', function: this.openFutureChangesViewEdit.bind(this)},
		]
	};
	columns: CheckboxTableColumn[] = [
		{ title: 'Building', attr: 'building' },
		{ title: 'Room Number', attr: 'room' },
		{ title: 'Usage', attr: 'usage' },
		{ title: 'Sub-Usage', attr: 'subusage' },
		{ title: 'Room Status', attr: 'status' },
		{ title: 'Capacity', attr: 'capacity' }
	];
	allSelected = false;
	constructor(private facilitiesManagementService: FacilitiesManagementService,
				public toolsInfoService: ToolsInfoService,
				private dialog: MatDialog) {}

	ngOnInit() {
		this.criteria = this.facilitiesManagementService.criteria;

		this.facilitiesManagementService.getRooms().subscribe((data) => {
			this.rooms = data;
			this.onBuildingChosen();
		});
		this.facilitiesManagementService.results.subscribe((newResults) => {
			this.results = newResults;
		});
	}

	getItems(type){
		if(type === 'rooms'){
			return this.possibleRooms;
		} else {
			return this.toolsInfoService.info[type];
		}
	}

	viewHistory(row) {
		this.dialog.open(RoomHistoryComponent, {
			data: row,
			width: '900px'
		});
	}

	removeSelected() {
		this.results = this.results.filter((result) => {
			return !result.selected;
		});
	}

	onBuildingChosen() {
		if(this.criteria.buildings[0] && this.criteria.buildings[this.criteria.buildings.length-1].id){
			if(this.criteria.buildings.length){
				this.possibleRooms = this.rooms.filter((room) => {
					return this.criteria.buildings.some((building)=>room.room && (building.name === room.building));
				});
				if(this.criteria.rooms){
					this.criteria.rooms = this.criteria.rooms.filter((room) =>{
						return this.criteria.buildings.some((building)=>building.name === room.building);
					});
				}
			}
		} else {
			this.possibleRooms = this.rooms;
		}
	}

	searchRooms() {
		this.searchExecuted = true;
		this.loading = true;
		setTimeout(()=>{
			this.facilitiesManagementService.searchRooms();
			this.loading = false;
			if (!this.results.length) {
				this.tablePlaceholder = 'No results have been found';
			}
		});
	}

	openFutureChangesViewEdit(row) {
		this.dialog.open(EditFacilitiesFutureChangesComponent, {
			data: row,
			width: '650px'
		});
	}

	clearCriteria() {
		this.searchExecuted = false;
		this.possibleRooms = this.rooms;
		this.facilitiesManagementService.clearCriteria();
		this.criteria = this.facilitiesManagementService.criteria;
		this.results = [];
	}

	editRoom(results) {
		const dialogResult = this.dialog.open(EditRoomComponent, {
				data: results,
				width: '500px',
				disableClose: true
			});

		this.getRoomsAfterModalClose(dialogResult);
	}

	createRoom() {
		const dialogResult = this.dialog.open(EditRoomComponent, {
			width: '355px',
			disableClose: true
		});

		this.getRoomsAfterModalClose(dialogResult);
	}

	getRoomsAfterModalClose(dialogResult) {
		dialogResult.afterClosed().subscribe((dialogData) => {
			if(dialogData && this.searchExecuted){
				this.facilitiesManagementService.getRooms().subscribe(() => {
					this.searchRooms();
				});
			}
		});
	}

}
