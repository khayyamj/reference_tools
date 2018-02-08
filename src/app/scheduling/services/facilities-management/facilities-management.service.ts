import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FutureChangesService } from '../../../scheduling-records/services';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Injectable()
export class FacilitiesManagementService {

	rooms = new BehaviorSubject([]);
	date = new Date();
	public _results = new BehaviorSubject([]);
	public results = this._results.asObservable();
	public criteria:any = {
		buildings: [],
		rooms: [],
		usage: [],
		subusage: [],
		statuses: []
	};
	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient,
				private futureChangesService: FutureChangesService) {
	}

	createRoom(roomToEdit) {
		const newRoom: any = {
			buildingId: roomToEdit.building.id,
			room: roomToEdit.room.name,
			capacity: roomToEdit.capacity,
			floor: roomToEdit.floor,
			usageId: roomToEdit.usage ? roomToEdit.usage.id : '',
			subusageId: roomToEdit.subusage ? roomToEdit.subusage.id : '',
			branchId: roomToEdit.branch ? roomToEdit.branch.id : '',
			zoneId: roomToEdit.zone ?  roomToEdit.zone.id : '',
			statusId: roomToEdit.status ? roomToEdit.status.id : '',
			notes: roomToEdit.notes ? roomToEdit.notes.name : ''
		};
		if(roomToEdit.subusage && roomToEdit.subusage.id){
			if(roomToEdit.usage.name === 'Classroom'){
				newRoom.language = roomToEdit.subusage.id;
			} else {
				newRoom.usageId = roomToEdit.subusage.id;
			}
		}
		return this.http.post(`${this.hostname.mtcAPIUrl}mtcs/rooms`, newRoom);
	}

	formatRoom(allRooms) {
		let currentRoom: any = {};
		const newRooms = allRooms.filter(result => {
			return result.selected;
		});
		const roomsToEdit = newRooms.map((room) => ({ name: room.room, id: room.roomId }));
		if (roomsToEdit.length > 1) {
			currentRoom = {
				rooms: roomsToEdit,
			};
		} else if (roomsToEdit.length === 1) {
			const newRoom = newRooms[0];
			currentRoom = {
				building: { name: newRoom.building, id: newRoom.buildingId },
				room: { name: newRoom.room, id: newRoom.roomId },
				rooms: roomsToEdit,
				capacity: newRoom.capacity,
				floor: newRoom.floor,
				overflowStatus: {name: newRoom.overflowStatus},
				zone: {name: newRoom.zone, id: newRoom.zoneId},
				branch: {name: newRoom.branch, id: newRoom.branchId},
				notes: { name: newRoom.notes, id: newRoom.noteId },
				usage: { name: newRoom.usage, id: newRoom.usageId },
				subusage: { name: newRoom.subusage, id: newRoom.subusageId },
				status: { name: newRoom.status },
			};
		} else {
			currentRoom = {
				room:{},
				notes:{}
			};
		}
		currentRoom.effectiveDate = new Date();
		return currentRoom;
	}

	updateRoom(roomToEdit) {
		let editedRooms: any = {};
		const calls = [];
		if (roomToEdit.rooms.length > 1) {
			['usage','subusage','branch','zone','overflowStatus'].forEach((item)=>{
				if (roomToEdit[item] && roomToEdit[item].id) {
					editedRooms[item] = roomToEdit[item].id;
				}
			});
			if (roomToEdit.status && roomToEdit.status.id) {
				editedRooms.availability = roomToEdit.status.id;
			}
			if (roomToEdit.capacity) {
				editedRooms.capacity = roomToEdit.capacity;
			}
		} else {
			editedRooms = {
				room: roomToEdit.room.name,
				capacity: roomToEdit.capacity,
				usage: roomToEdit.usage ? roomToEdit.usage.id : '',
				notes: roomToEdit.notes ? roomToEdit.notes.name: '',
				branch: roomToEdit.branch ? roomToEdit.branch.id : '',
				zone: roomToEdit.zone ? roomToEdit.zone.id : '',
				availability: roomToEdit.status ? roomToEdit.status.id : '',
				overflowStatus: roomToEdit.overflowStatus? roomToEdit.overflowStatus.id: ''
			};
			if(roomToEdit.subusage && roomToEdit.subusage.id){
				if(roomToEdit.usage && roomToEdit.usage.name === 'Classroom'){
					editedRooms.language = roomToEdit.subusage.id;
				} else {
					editedRooms.usageId = roomToEdit.subusage.id;
				}
			}
		}
		roomToEdit.rooms.forEach((room) => {
			editedRooms.roomId = room.id;
			calls.push(this.futureChangesService.createRoomsFutureChanges([editedRooms], roomToEdit.effectiveDate));
		});
		return Observable.zip(...calls);
	}

	deleteRoom(roomToEdit) {
		const editedRooms: any = {
			futureValue: '9',
			id: roomToEdit.room.id,
			effectiveDate: moment(roomToEdit.effectiveDate).format('MM/DD/YYYY'),
			changeType: 'availability',
			mtcId: this.toolsInfoService.info.mtcId
		};
		return this.futureChangesService.createRoomsFutureChanges([editedRooms]);
	}

	public getRooms() {
		this.http.get(`${this.hostname.mtcAPIUrl}mtcs/rooms`)
			.subscribe((rooms:any[]) => {
				this.rooms.next(rooms);
			});
		return this.rooms.asObservable();
	}

	public getRoomHistory(roomid) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}room/changes/history/${roomid}`);
	}

	public searchRooms() {
		const roomList = this.rooms.getValue();
		const criteria= {
			building: this.criteria.buildings,
			room:this.criteria.rooms,
			usage:this.criteria.usage,
			subusage:this.criteria.subusage,
			status:this.criteria.statuses
		};
		this._results.next(roomList.filter(room => {
			return Object.keys(criteria).every((criterion) => { //need to match every criteria
				return criteria[criterion].length ? this.checkRoom(room, criterion, criteria[criterion]) : true;
			});
		}));
	}

	public clearCriteria() {
		this.criteria = {};
	}

	private checkRoom(room, attr, filterArray) {
		return filterArray.some((item) => { //when there are multiple criterion for a particular criteria the room only needs to match one
			return room[attr] === (item.name || item.room); // either room or the name will be checked, no item will have both
		});
	}

}
