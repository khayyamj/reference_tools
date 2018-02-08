import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesManagementService } from '../../../services';
import { ToolsInfoService } from '../../../../shared';

@Component({
	selector: 'app-edit-room',
	templateUrl: './edit-room.component.html',
	styleUrls: ['./edit-room.component.less']
})
export class EditRoomComponent implements OnInit {

	public roomForm: FormGroup;
	public currentRoom: any = {};
	public title = '';
	public config: any = {};
	public modalSaveButton: string;
	public saveRoomText: string;
	public deleteRoomsButton: boolean;
	public isEdit: boolean;
	public multiEdit: boolean;
	public date = new Date();
	public rooms: any[];
	public edits: any;
	public showConfirmation: boolean;
	public newData;
	private dialogType;
	private today = new Date();

	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
				private facilitiesManagementService: FacilitiesManagementService,
				public toolsInfoService: ToolsInfoService,
				private fb: FormBuilder) { }

	ngOnInit() {
		this.newData = this.dialogData;
		if (this.newData && this.newData.length > 0) {
			this.currentRoom = { room: '', notes: '' };
			this.currentRoom = this.facilitiesManagementService.formatRoom(this.newData);
			this.today = this.currentRoom.effectiveDate.setHours(0, 0, 0, 0);
		} else {
			this.currentRoom = this.facilitiesManagementService.formatRoom([this.currentRoom]);
		}

		//Configure confirmation modal text
		if (!this.currentRoom.rooms) {
			this.title = 'Create a New Room';
			this.modalSaveButton = 'create';
			this.saveRoomText = 'create this room';
			this.isEdit = false;
			this.multiEdit = false;
			//Initialize Form Group
			this.roomForm = this.fb.group({
				building: ['', Validators.required],
				room: ['', Validators.required],
				status: [''],
				usage: ['', Validators.required],
				capacity: ['', Validators.required],
				effectiveDate: [this.currentRoom.effectiveDate],
				zone: [''],
				branch: [''],
				subusage: [''],
				overflowStatus: [''],
				notes: ['']
			});
		} else if (this.currentRoom.rooms.length === 1) {
			this.title = 'Edit Room';
			this.modalSaveButton = 'save';
			this.saveRoomText = 'save changes to this room';
			this.deleteRoomsButton = true;
			this.isEdit = true;
			this.multiEdit = false;
			//Initialize Form Group
			this.currentRoom.overflowStatus = this.currentRoom.overflowStatus.name === '1' ? {name:'Yes', id: '1'} : {name:'No', id: '0'};
			this.roomForm = this.fb.group({
				building: [this.currentRoom.building],
				room: [this.currentRoom.room.name, Validators.required],
				status: [this.currentRoom.status],
				usage: [this.currentRoom.usage],
				capacity: [this.currentRoom.capacity, Validators.required],
				effectiveDate: [this.currentRoom.effectiveDate],
				zone: [this.currentRoom.zone.name],
				branch: [this.currentRoom.branch.name],
				subusage: [this.currentRoom.subusage.name],
				overflowStatus: [this.currentRoom.overflowStatus.name],
				notes: [this.currentRoom.notes.name]
			});
		} else {
			this.title = 'Edit Rooms';
			this.modalSaveButton = 'save';
			this.saveRoomText = 'save changes to these rooms';
			this.isEdit = true;
			this.multiEdit = true;
			//Initialize Form Group
			this.roomForm = this.fb.group({
				status: [''],
				usage: [''],
				capacity: [''],
				subusage:[''],
				zone:[''],
				branch:[''],
				overflowStatus:[''],
				effectiveDate: [this.currentRoom.effectiveDate],
			});
		}
	}

	delete() {
		this.dialogType = 'delete';
		this.config = {
			content: 'Are you sure want to delete this room?',
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete'
		};
		this.showConfirmation = true;
	}

	cancel() {
		this.dialogType = 'cancel';
		this.config = {
			cancelButtonText: 'No',
			confirmationButtonText: 'Yes',
			content: 'Are you sure you want to cancel changes?'
		};
		this.showConfirmation = true;
	}

	save(form) {
		if(form.valid) {
			this.dialogType = 'save';
			this.config = {
				cancelButtonText: 'no',
				confirmationButtonText: 'yes',
				content: 'Are you sure want to ' + this.saveRoomText
			};
			this.showConfirmation = true;
		}
	}

	confirmation(answer) {
		if (answer) {
			this.currentRoom.effectiveDate = this.roomForm.get('effectiveDate').value;
			if (this.dialogType === 'save') {
				if(this.title === 'Create a New Room') {
					this.facilitiesManagementService.createRoom(this.currentRoom).subscribe(() => {
						this.dialogRef.close(this.currentRoom);
					});
				} else {
					this.facilitiesManagementService.updateRoom(this.currentRoom).subscribe(() => {
						this.dialogRef.close(this.updateRooms());
					});
				}
			} else if (this.dialogType === 'cancel') {
				this.dialogRef.close();
			} else if (this.dialogType === 'delete') {
				this.facilitiesManagementService.deleteRoom(this.currentRoom).subscribe(() => {
					const undeletedRooms = this.newData.filter((result) => {
						return !result.selected;
					});
					this.dialogRef.close(undeletedRooms);
				});
			}
		}
		this.showConfirmation = false;
	}

	updateRooms() {
		const changedRooms = this.newData.filter((result) => {
			return result.selected;
		});
		const form = this.roomForm.controls;

		if (form.effectiveDate.value.valueOf() === this.today.valueOf() && this.currentRoom.rooms.length === 1) {
			changedRooms[0].building = this.currentRoom.building.name;
			changedRooms[0].buildingId = this.currentRoom.building.id;
			changedRooms[0].room = this.currentRoom.room.name;
			changedRooms[0].capacity = this.currentRoom.capacity;
			changedRooms[0].floor = this.currentRoom.floor;
			changedRooms[0].usage = this.currentRoom.usage.name;
			changedRooms[0].usageId = this.currentRoom.usage.id;
			changedRooms[0].subusage = this.currentRoom.subusage.name;
			changedRooms[0].subusageId = this.currentRoom.subusage.id;
			changedRooms[0].status = this.currentRoom.status.name;
			changedRooms[0].zone = this.currentRoom.zone.name;
			changedRooms[0].zoneId = this.currentRoom.zone.id;
			changedRooms[0].branch = this.currentRoom.branch.name;
			changedRooms[0].branchId = this.currentRoom.branch.id;
			changedRooms[0].notes = this.currentRoom.notes.name;
		} else if (form.effectiveDate.value.valueOf() === this.today.valueOf() && this.currentRoom.rooms.length > 1) {
			changedRooms.forEach((room) => {
				if (form.usage && form.usage.value) {
					room.usage = this.currentRoom.usage.name;
				}
				if (this.currentRoom.subusage) {
					room.subusage = this.currentRoom.subusage.name;
				}
				if (form.capacity && form.capacity.value) {
					room.capacity = form.capacity.value;
				}
				if (form.status && form.status.value) {
					room.status = form.status.value.name;
				}
				if (form.zone && form.zone.value) {
					room.zone = this.currentRoom.zone.name;
				}
				if (form.branch && form.branch.value) {
					room.branch = this.currentRoom.branch.name;
				}
				if (form.overflowStatus && form.overflowStatus.value) {
					room.overflowStatus = this.currentRoom.overflowStatus;
				}
			});
		}
		return this.newData;
	}

	getSubusages(usage){
		if(usage === 'Classroom'){
			return this.toolsInfoService.info.traininglanguages;
		} else {
			return this.toolsInfoService.info.subusage;
		}
	}
}
