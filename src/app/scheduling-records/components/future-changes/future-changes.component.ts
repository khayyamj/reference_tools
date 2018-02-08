import { Component, OnInit } from '@angular/core';
import { FutureChangesService } from '../../services';
import { MatDialog } from '@angular/material';
import { SimpleConfirmationComponent, MTCToastService, CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { EditFutureChangesMissionaryComponent } from './edit-future-changes-missionary';
import { EditFutureChangesRoomsComponent } from './edit-future-changes-rooms';
import { EditFutureChangesTrainingGroupComponent } from './edit-future-changes-training-group';
import * as moment from 'moment';

@Component({
	selector: 'scheduling-records-future-changes',
	templateUrl: './future-changes.component.html',
	styleUrls: ['./future-changes.component.less']
})
export class FutureChangesComponent implements OnInit {

	isMissionaryLoading = true;
	isTrainingGroupLoading = true;
	isRoomsLoading = true;
	tabs = ['Missionary', 'Training Group', 'Rooms'];
	selectedTab='Missionary';
	missionaries = [];
	trainingGroups = [];
	rooms = [];
	date:any;
	missionariesPlaceholder = '';
	trainingGroupsPlaceholder = '';
	roomsPlaceholder = '';
	startDay: any;
	endDay: any;
	missionaryColumns: CheckboxTableColumn [] = [
		{title:'DATE EFFECTIVE',attr:'effectiveDate', mtcDate: true },
		{title:'ID',attr:'id'},
		{title:'TYPE',attr:'type'},
		{title:'NAME',attr:'fullName'},
		{title:'FIELD',attr:'changeType'},
		{title:'CURRENT VALUE',attr:'currentValue'},
		{title:'FUTURE VALUE',attr:'futureValue'}
	];
	trainingGroupColumns: CheckboxTableColumn [] = [
		{title:'DATE EFFECTIVE',attr:'effectiveDate', mtcDate: true },
		{title:'ID',attr:'id'},
		{title:'FIELD',attr:'changeType'},
		{title:'CURRENT VALUE',attr:'currentValue'},
		{title:'FUTURE VALUE',attr:'futureValue'}
	];
	roomColumns: CheckboxTableColumn [] = [
		{title:'DATE EFFECTIVE',attr:'effectiveDate', mtcDate: true },
		{title:'ROOM #',attr:'fullName'},
		{title:'FIELD',attr:'changeType'},
		{title:'CURRENT VALUE',attr:'currentValue'},
		{title:'FUTURE VALUE',attr:'futureValue'}
	];

	checkboxTableConfig: CheckboxTableConfig = {
		topButtons: [
			{text: 'Edit', function: this.openFutureChangesEditor.bind(this)},
			{text: 'Delete', function: this.deleteFutureChanges.bind(this)}
		]
	};

	constructor(private dialog: MatDialog,
				private mtcToastService: MTCToastService,
				private futureChangesService: FutureChangesService) {
	}

	ngOnInit() {
		this.date=this.futureChangesService.date;
		if(this.date.start){
			this.startDay = this.date.start;
		} else {
			this.startDay = new Date();
		}
		if(this.date.end){
			this.endDay = this.date.end;
		} else {
			this.endDay = null;
		}
		this.getMissionaries(this.formatDate(this.startDay), this.formatDate(this.endDay));
		this.getTrainingGroups(this.formatDate(this.startDay), this.formatDate(this.endDay));
		this.getRooms(this.formatDate(this.startDay), this.formatDate(this.endDay));
	}

	deleteFutureChanges() {
		let futureChanges: any[];
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete this future change?'
		};
		switch(this.selectedTab){
			case 'Missionary':
				futureChanges = this.formatFutureChanges(this.missionaries);
				this.dialog.open(SimpleConfirmationComponent, {
					data: config,
					width:'400px'
				}).afterClosed().subscribe((data) => {
					if(data){
						this.futureChangesService.createMissionariesFutureChanges(futureChanges).subscribe(() => {
							this.mtcToastService.success('Future change <strong>successfully</strong> deleted');
						});
						this.missionaries = [];
						this.getMissionaries(this.formatDate(this.startDay), this.formatDate(this.endDay));
					}
				});
				break;

			case 'Training Group':
				futureChanges = this.formatFutureChanges(this.trainingGroups);
				this.dialog.open(SimpleConfirmationComponent, {
					data: config,
					width:'400px'
				}).afterClosed().subscribe((data) => {
					if(data){
							this.futureChangesService.createTrainingGroupsFutureChanges(futureChanges).subscribe(() => {
								this.mtcToastService.success('Future change <strong>successfully</strong> deleted');
							});
							this.trainingGroups = [];
							this.getTrainingGroups(this.formatDate(this.startDay), this.formatDate(this.endDay));
						}
				});
				break;

			case 'Rooms':
				futureChanges = this.formatFutureChanges(this.rooms);
				this.dialog.open(SimpleConfirmationComponent, {
					data: config,
					width:'400px'
				}).afterClosed().subscribe((data) => {
					if(data){
						this.futureChangesService.createRoomsFutureChanges(futureChanges).subscribe(() => {
							this.mtcToastService.success('Future change <strong>successfully</strong> deleted');
						});
						this.rooms = [];
						this.getRooms(this.formatDate(this.startDay), this.formatDate(this.endDay));
					}
				});
				break;
		}
	}

	formatFutureChanges(list){
		const output = [];
		list.forEach(item => {
			if (item.selected) {
				const newChange = Object.assign({},item);
				newChange.id = item.id;
				newChange.changeType = item.changeType;
				newChange.futureValue = item.currentValue;
				newChange.effectiveDate =this.formatDate(new Date());
				output.push(newChange);
			}
		});
		return output;
	}

	getSelected(list){
		return list.filter(item => item.selected);
	}

	openFutureChangesEditor() {
		let selected;
		switch(this.selectedTab) {
			case 'Missionary':
				selected = this.getSelected(this.missionaries);
				if (selected.length) {
					this.dialog.open(EditFutureChangesMissionaryComponent, {
						data: selected,
						width: '1050px',
						disableClose: true
					});
				}
				break;
			case 'Training Group':
				selected = this.getSelected(this.trainingGroups);
				if (selected.length) {
					this.dialog.open(EditFutureChangesTrainingGroupComponent, {
						data: selected,
						width: '550px',
						disableClose: true
					});
				}
				break;
			case 'Rooms':
				selected = this.getSelected(this.rooms);
				if (selected.length) {
					this.dialog.open(EditFutureChangesRoomsComponent, {
						data: selected,
						width: '660px',
						disableClose: true
					});
				}
				break;
		}
	}

	getMissionaries(start, end){
		this.isMissionaryLoading = true;
		this.futureChangesService.getMissionariesFutureChanges(start, end).subscribe((missionaries:any[]) => {
			this.missionaries = missionaries;
			if (!this.missionaries.length) {
				this.missionariesPlaceholder = 'There is no information to display';
			}
			this.isMissionaryLoading = false;
		});
	}

	getTrainingGroups(start, end){
		this.isTrainingGroupLoading = true;
		this.futureChangesService.getTrainingGroupsFutureChanges(start, end).subscribe((trainingGroups:any[]) => {
			this.trainingGroups = trainingGroups;
			if (!this.trainingGroups.length) {
				this.trainingGroupsPlaceholder = 'There is no information to display';
			}
			this.isTrainingGroupLoading = false;
		});
	}

	getRooms(start, end){
		this.isRoomsLoading = true;
		this.futureChangesService.getRoomsFutureChanges(start, end).subscribe((rooms:any[]) => {
			this.rooms = rooms;
			if(!this.rooms.length) {
				this.roomsPlaceholder = 'There is no information to display';
			}
			this.isRoomsLoading = false;
		});
	}

	changeSelectedDate() {
		this.getMissionaries(this.formatDate(this.startDay), this.formatDate(this.endDay));
		this.getTrainingGroups(this.formatDate(this.startDay), this.formatDate(this.endDay));
		this.getRooms(this.formatDate(this.startDay), this.formatDate(this.endDay));
	}

	formatDate(day){
		return day ? moment(day).format('l') : null;
	}

}
