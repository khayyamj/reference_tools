import { Component, OnInit, Input } from '@angular/core';
import { ToolsInfoService } from '../../../../shared';
import * as _ from 'lodash';

@Component({
	selector: 'scheduling-exception-action',
	templateUrl: './exception-action.component.html',
	styleUrls: ['./exception-action.component.less']
})
export class ExceptionActionComponent implements OnInit {

	@Input() exception;
	possibleAction = [];
	possibleActions = [];
	possibleRooms = [];
	possibleResidenceRooms = [];
	public actions=[{
		name:'Group in Districts',
		value:'district'
	},{
		name:'Group in Training Groups',
		value:'trainingGroup'
	},{
		name:'Assign to Zone(s)',
		value:'zone'
	},{
		name:'Assign to Classroom(s)',
		value:'room'
	},{
		name:'Assign to Residence Room(s)',
		value:'residenceRoom'
	},{
		name:'Assign Branch(es)',
		value:'branch'
	},{
		name:'Assign Schedule',
		value:'schedule'
	}];

	constructor(public toolsInfoService: ToolsInfoService) { }

	ngOnInit() {
		this.possibleAction=this.possibleActions=_.cloneDeep(this.actions);

		this.filterActions(this.exception);
	}

	filterActions(exception){
		exception.actions.forEach((action)=>{
			exception.selectedActions[action.name]={};
			if(action.name!=='roomRange' && action.name!=='residenceRoomRange'){
				this.possibleActions.find(item=>item.value===action.name).inUse=true;
			}
			if(action.name==='room'){
				exception.selectedActions.room.room = this.toolsInfoService.info.rooms.find(item=>item.roomId===action.value) || {};
				if(exception.selectedActions.room.room.roomId){
					exception.selectedActions.room.building = this.toolsInfoService.info.buildings.find(item=>item.name===exception.selectedActions.room.room.building);
					this.filterRooms(exception.selectedActions.room.building);
				} else {
					exception.selectedActions.room.building = {};
				}
			} else if(action.name==='residenceRoom'){
				exception.selectedActions.residenceRoom.room = this.toolsInfoService.info.rooms.find(item=>item.roomId===action.value) || {};
				if(exception.selectedActions.residenceRoom.room.roomId){
					exception.selectedActions.residenceRoom.building = this.toolsInfoService.info.buildings.find(item=>item.name===exception.selectedActions.residenceRoom.room.building);
					this.filterResidenceRooms(exception.selectedActions.residenceRoom.building);
				} else {
					exception.selectedActions.residenceRoom.building = {};
				}
			} else if(action.name==='roomRange'){
				exception.selectedActions.roomRange = this.toolsInfoService.info.rooms.find(item=>item.roomId===action.value) || {};
			} else if(action.name==='residenceRoomRange'){
				exception.selectedActions.residenceRoomRange = this.toolsInfoService.info.rooms.find(item=>item.roomId===action.value) || {};
			} else if(action.name==='branch'){
				exception.selectedActions.branch = this.toolsInfoService.info.branches.filter((item)=>action.values.some(v => item.id===v.value)) || {};
			}else if(action.name==='zone'){
				exception.selectedActions.zone = this.toolsInfoService.info.zones.filter((item)=>action.values.some(v => item.id===v.value)) || {};
			} else if (action.name!=='trainingGroup' && action.name!=='district'){
				exception.selectedActions[action.name] = this.toolsInfoService.info[`${action.name}s`].find(item=>item.id===action.value) || {};
			}
		});
		this.filterPossibleActions();
	}

	actionSelected(action){
		if(action.value){
			if(action.value === 'branch' || action.value === 'zone'){
				this.exception.selectedActions[action.value]=[];
			} else {
				this.exception.selectedActions[action.value]={};
			}
			this.possibleActions.find(item=>item.value===action.value).inUse=true;
			this.filterPossibleActions();
			this.exception.selectedAction={};
			if(action.value === 'room'){
				this.possibleRooms = this.toolsInfoService.info.rooms;
			} else if(action.value === 'residenceRoom'){
				this.possibleResidenceRooms = this.toolsInfoService.info.rooms;
			}
		}
	}

	filterPossibleActions(){
		this.possibleAction = this.possibleActions.filter(item => !item.inUse);
	}

	removeAction(exception,action){
		if(action === 'roomRange'){
			delete exception.selectedActions.roomRange;
		} else if(action === 'residenceRoomRange'){
			delete exception.selectedActions.residenceRoomRange;
		} else {
			this.possibleActions.find(item => item.value === action).inUse = false;
			this.filterPossibleActions();
			delete exception.selectedActions[action];
			if(action === 'room' && exception.selectedActions.roomRange){
				delete exception.selectedActions.roomRange;
			} else if(action === 'residenceRoom' && exception.selectedActions.residenceRoomRange){
				delete exception.selectedActions.residenceRoomRange;
			}
		}
	}

	addRange(exception,type){
		exception.selectedActions[type] = {};
	}

	filterRooms(building){
		if(building.name){
			this.possibleRooms = this.toolsInfoService.info.rooms.filter(room => room.building === building.name);
		} else {
			this.possibleRooms = this.toolsInfoService.info.rooms;
		}
	}

	filterResidenceRooms(building){
		if(building.name){
			this.possibleResidenceRooms = this.toolsInfoService.info.rooms.filter(room => room.building === building.name);
		} else {
			this.possibleResidenceRooms = this.toolsInfoService.info.rooms;
		}
	}
}
