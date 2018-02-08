import { Injectable } from '@angular/core';
import { FutureChangesService } from '../../../../scheduling-records/services';
import { MtcDatePipe } from 'mtc-modules';

@Injectable()
export class EditFacilitiesFutureChangeService {

	public loading:boolean;
	public room:any;
	public currentChanges:any;
	public changes:any[]= [];
	constructor(private futureChangesService: FutureChangesService,
				private mtcDate: MtcDatePipe) { }

	getRoomChangesToEdit(room){
		this.room=room;
		const roomId = this.room.roomId; //TODO this will need to be room.id eventually
		return this.futureChangesService.getFacilitesFutureChanges(roomId);
	}

	saveFutureChanges(newChanges){
		this.currentChanges.forEach((oldChange,index)=>{
			const newChange=newChanges[index];
			if(newChange.futureValue){
				if(this.mtcDate.transform(oldChange.effectiveDate) !== this.mtcDate.transform(newChange.effectiveDate) || oldChange.futureValue !== newChange.futureValue.name){
					newChange.futureValue = newChange.futureValue.id || newChange.futureValue.name;
					newChange.id = this.room.roomId;
					this.deleteOldChange(oldChange);
					this.changes.push(newChange);
				}
			}
		});
		this.changes.map((change)=>{
			switch (change.changeType){
			case 'Status':
				if (change.futureValue === 'Active') {
					change.futureValue = '1';
					change.changeType = 'Availability';
				} else if (change.futureValue === 'Inactive') {
					change.futureValue = '2';
					change.changeType = 'Availability';
				}
				break;
			case 'Overflow':
				change.changeType='overflowStatus';
				change.futureValue = change.overflowStatus.name === 'Yes' ? '1' : '0';
				break;
			}
			change.changeType = change.changeType[0].toLowerCase() + change.changeType.substring(1);
			change.effectiveDate = this.mtcDate.transform(change.effectiveDate);
		});

		if(this.changes.length){
			this.futureChangesService.createRoomsFutureChanges(this.changes).subscribe();
		}
	}

	deleteChange(changes, index){
		this.deleteOldChange(changes[index]);
		this.currentChanges.splice(index, 1);
		changes.splice(index, 1);
	}

	deleteOldChange(oldChange){
		oldChange.futureValue=oldChange.currentValueId;
		oldChange.id = this.room.roomId;
		oldChange.effectiveDate=new Date();
		this.changes.push(oldChange);
	}
}
