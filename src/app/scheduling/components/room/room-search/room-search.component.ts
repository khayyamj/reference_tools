import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MissionaryInfoService } from '../../../../scheduling-records/services';
import { ToolsInfoService } from '../../../../shared';
import { CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'scheduling-room-search',
	templateUrl: './room-search.component.html',
	styleUrls: ['./room-search.component.less']
})
export class RoomSearchComponent {
	@Input() type:string;//This determines whether the current room is residence or classroom
	@Input() open;
	@Output() openChange = new EventEmitter();
	@Output() loading = new EventEmitter();
	@Input() rooms;
	@Input() filteredRooms;
	@Output() returnRooms = new EventEmitter();
	public possibleDistricts = [];
	public buildingTypeString: string;
	showFilter = false;
	filters:any = {
		building: {name:''},
		room: {room:''},
		branch: {name:''},
		district: {name:''},
		missionaryType: {name:''},
		language: {name:''}
	};
	columns = [
		{ title: 'Building', attr: 'building'},
		{ title: 'Room #', attr: 'room'},
		{ title: 'Zone', attr: 'zone'},
		{ title: 'Branch', attr: 'branch'},
		{ title: 'Sub-Usage', attr: 'subusage'},
		{ title: 'Capacity', attr: 'capacity'},
		{ title: 'Current Occ.', attr: 'currentOccupants'},
		{ title: 'Future Occ.', attr: 'futureOccupants'}
	];
	config:CheckboxTableConfig ={
		topButtons:[{text:'OPEN CHECKED', function:this.close.bind(this)}]
	};
	tablePlaceholder: 'No results have been found';

	constructor(private missionaryInfoService: MissionaryInfoService,
				public toolsInfoService: ToolsInfoService) {}

	close(chosenRooms){
		let roomList = '';
		chosenRooms.forEach((room) => {
			roomList += room.room + ', ';
		});
		roomList = roomList.slice(0, -2);
		this.loading.emit();
		this.missionaryInfoService.getOccupantsByRoom(roomList).subscribe((occupants:any) => {
			chosenRooms.forEach((room,i) => {
				room.arrivalDepartureDate = room.arrival + '-' + room.departure;
				room.selected = false;
				room.disabled = false;
				room.added = false;
				room.currentOccupants = occupants[i].currentOccupants || [];
				room.futureOccupants = occupants[i].futureOccupants || [];
			});
			this.returnRooms.emit(chosenRooms);
			this.openChange.emit(false);
		});
	}

	getRooms(building){
		if(building && this.toolsInfoService.info.rooms){
			return this.toolsInfoService.info.rooms.filter((room) => {
				return room.building === this.filters.building.name;
			});
		}else{
			return this.toolsInfoService.info.rooms;
		}
	}

	filterBranches(){
		if(this.filters.branch){
			this.missionaryInfoService.getDistricts(this.filters.branch.id).subscribe((districts:any) => {
				this.possibleDistricts = districts;
				this.filterRooms();
			});
		}else{
			this.possibleDistricts = [];
			this.filterRooms();
		}
	}

	filterRooms(){
		this.filteredRooms = this.rooms.filter((room) => {
			if(room.building && !room.building.includes(this.filters.building.name)){
				return false;
			}
			if(room.room && !room.room.includes(this.filters.room.room)){
				return false;
			}
			if(room.branch && !room.branch.includes(this.filters.branch.name)){
				return false;
			}
			if(this.type!=='classroom'){
				if(room.missionaryType && !room.missionaryType.includes(this.filters.missionaryType.name)){
					return false;
				}
				if(room.fmissionaryType && !room.fmissionaryType.includes(this.filters.missionaryType.name)){
					return false;
				}
			}
			if(room.language && !room.language.includes(this.filters.language.name)){
				return false;
			}
			if(room.flanguage && !room.flanguage.includes(this.filters.language.name)){
				return false;
			}
			if(room.district && !room.district.includes(this.filters.district) && room.branch && !room.branch.includes(this.filters.branch.name)){
				return false;
			}
			if(room.fdistrict && !room.fdistrict.includes(this.filters.district) && room.branch && !room.branch.includes(this.filters.branch.name)){
				return false;
			}
			return true;
		});
	}

	clearFilters(){
		this.filters = {
			building: {name:''},
			room: {room:''},
			branch: {name:''},
			district: {name:''},
			missionaryType: {name:''},
			language: {name:''}
		};
		this.filteredRooms = this.rooms;
	}
}
