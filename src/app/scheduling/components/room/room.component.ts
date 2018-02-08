import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { RoomService } from '../../services';
import { MissionaryService } from '../../../core-missionary/services/missionary/missionary.service';
import { EditRoomComponent } from '../facilities-management';
import { CheckboxTableConfig } from 'mtc-modules';
import * as _ from 'lodash';

@Component({
	selector: 'scheduling-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.less']
})

export class RoomComponent implements OnInit {

	@Input() type:string;//This determines whether the current room is residence or classroom

	isSearchOpen = false;
	isSearching = false;
	searchQuery = '';
	searchResults:any = [];
	rooms:any = [];
	selectAll = false;
	currentOccupantsTablePlaceholder = 'No Current Occupants';
	futureOccupantsTablePlaceholder = 'No Future Occupants';
	columns = [
		{ title: 'ID', attr: 'missionaryId', width: 5 },
		{ title: 'TYPE', attr: 'type', width: 4 },
		{ title: 'NAME', attr: 'fullName', width: 10 },
		{ title: 'COMPANION', attr: 'companionship', width: 10 },
		{ title: 'STATUS', attr: 'status', width: 5 },
		{ title: 'SUB STATUS', attr: 'subStatus', width: 5 },
		{ title: 'ARRIVAL', attr: 'arrival', width: 10},
		{ title: 'DEPARTURE', attr: 'departure', width: 10},
		{ title: 'BR-DST', attr: 'branchDistrict', width: 5 },
		{ title: 'CLASSROOM', attr: 'classroom', width: 5 },
		{ title: 'RESIDENCE', attr: 'residence', width: 5 },
		{ title: 'SCHED.', attr: 'schedule' },
		{ title: 'MAIL', attr: 'mailbox' },
		{ title: 'MISS.', attr: 'missionAbbreviation', width: 5 },
		{ title: 'MISS. LANG.', attr: 'language', width: 5 },
		{ title: 'SP. CAT.', attr: 'specialCategory' },
		{ title: 'NOTES', attr: 'notes'},
	];
	config: CheckboxTableConfig = {
		buttonColumnWidth: 5
	};

	constructor(private dialog: MatDialog,
				private roomService: RoomService,
				private missionaryService: MissionaryService,
				private router: Router) { }

	ngOnInit() {
		this.rooms = this.roomService.roomsData[this.type];
	}

	searchRooms(query,event){
		this.isSearching = true;
		this.roomService.searchRooms(this.type, query).subscribe((rooms:any) => {
			if(rooms.length > 0 && rooms[0].room){
				this.searchResults = rooms;
			}else{
				this.searchResults = [];
			}
			this.isSearchOpen = true;
			this.isSearching = false;
		});
		if(event){
			event.stopPropagation();
		}
	}

	editSelection(selectedRoom?,index?){
		if(selectedRoom) {
			selectedRoom.viewNote = false;
			const clonedRoom = _.cloneDeep(selectedRoom);
			clonedRoom.selected = true;
			this.dialog.open(EditRoomComponent, {
				data: [clonedRoom],
				width: '540px'
			}).afterClosed().subscribe((dialogData) => {
				if(dialogData){
					this.rooms.splice(index, 1, dialogData[0]);
				}
			});
		} else if(this.rooms.some((room) => room.selected)){
			this.rooms.forEach((room) => {
				if(!room.branch) {
					room.branch = '';
				}
			});
			this.dialog.open(EditRoomComponent, {
				data: this.rooms,
				width: '540px'
			}).afterClosed().subscribe((dialogData) => {
				if(dialogData){
					this.rooms = dialogData;
				}
			});
		} else {
			const ids = [];
			this.rooms.forEach((room) => {
				room.currentOccupants.forEach((occupant) => {
					if(occupant.selected){
						ids.push(occupant.missionaryId);
					}
				});
				room.futureOccupants.forEach((occupant) => {
					if(occupant.selected){
						ids.push(occupant.missionaryId);
					}
				});
			});
			if(ids.length > 0){
				this.missionaryService.addAllMissionaries(ids);
				this.router.navigate(['/missionary'], {queryParams:{missionaryId:ids[0]}});
			}
		}
	}

	clearAll(){
		this.rooms = [];
	}

	roomChanged(room, event){
		let isTrue = true;
		room.currentOccupants.forEach((occupant) => {
			if(occupant.selected){
				room.selected = false;
				room.disabled = true;
				isTrue = false;
			}
		});
		room.futureOccupants.forEach((occupant) => {
			if(occupant.selected){
				room.selected = false;
				room.disabled = true;
				isTrue = false;
			}
		});
		if(isTrue){
			room.disabled = false;
		}
	}

	selectRoom(room,event){
		room.selected = event;
	}

	changeSelectAll(event){
		this.rooms.forEach((room) => {
			this.selectRoom(room, event);
		});
	}

	returnRooms(newRooms) {
		const addRooms = newRooms.filter((newRoom) => {
			return this.rooms.every((oldRoom) => oldRoom.roomId !== newRoom.roomId);
		});
		this.rooms = this.rooms.concat(addRooms);
		this.roomService.roomsData[this.type] = this.rooms;
		this.isSearching = false;
	}

	removeRoom(room) {
		this.rooms.splice(this.rooms.indexOf(room),1);
	}

	haveOccupants() {
		if (this.rooms.some((room) => room.selected)) {
			return true;
		}
		this.rooms.forEach((room) => {
			if(room.currentOccupants.some((occupant) => occupant.selected) ||
				room.futureOccupants.some((occupant) => occupant.selected)) {
				return true;
			}
		});
		return false;
	}

	hideNoteCard(room){
		setTimeout(() => {
			if(!room.stayOpen){
				this.hideNote(room, true);
			}
		},2000);
	}

	showNote(room,hoverOnCard) {
		room.viewNote = true;
		room.stayOpen = hoverOnCard;
	}

	hideNote(room, closeInstantly?){
		if(closeInstantly){
			room.viewNote = false;
		} else {
			setTimeout(() => {room.viewNote = false;}, 2000);
		}
	}
}
