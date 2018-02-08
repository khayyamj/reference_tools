import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { MTCToastService } from 'mtc-modules';
import * as moment from 'moment';

@Injectable()
export class FutureChangesService{

	attributes = {room:['room','branch','langauge','zone','schedule','overflowStatus','usage','subusages','availability','notes','capacity']};
	public date:any = {};
	newRecord = {};

	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient,
				private toastService: MTCToastService) {}

	private formatFutureChanges(array, type, date) {
		if (!date){
			date = new Date();
		}
		const futureChanges = [];
		array.forEach(object => {
			this.attributes[type].forEach(prop => {
				if(object[prop]){
					const newChange:any = {};
					newChange.id = object.roomId;
					newChange.changeType = prop;
					newChange.futureValue = object[prop];
					newChange.effectiveDate = moment(date).format('MM/DD/YYYY');
					newChange.mtcid = this.toolsInfoService.info.mtcId;
					futureChanges.push(newChange);
				}
			});
		});
		return futureChanges;
	}

	public getMissionariesFutureChanges(start: string, end: string){
		if(end){
			return this.http.get(`${this.hostname.mtcToolsAPIUrl}missionary/changes/${this.toolsInfoService.info.mtcId}?startdate=${start}&enddate=${end}`);
		}else{
			return this.http.get(`${this.hostname.mtcToolsAPIUrl}missionary/changes/${this.toolsInfoService.info.mtcId}?startdate=${start}`);
		}
	}

	public getTrainingGroupsFutureChanges(start: string, end: string){
		if(end){
			return this.http.get(`${this.hostname.mtcToolsAPIUrl}training/changes/${this.toolsInfoService.info.mtcId}?startdate=${start}&enddate=${end}`);
		}else{
			return this.http.get(`${this.hostname.mtcToolsAPIUrl}training/changes/${this.toolsInfoService.info.mtcId}?startdate=${start}`);
		}
	}

	public getRoomsFutureChanges(start: string, end: string){
		if(end){
			return this.http.get(`${this.hostname.mtcToolsAPIUrl}room/changes/${this.toolsInfoService.info.mtcId}?startdate=${start}&enddate=${end}`);
		}else{
			return this.http.get(`${this.hostname.mtcToolsAPIUrl}room/changes/${this.toolsInfoService.info.mtcId}?startdate=${start}`);
		}
	}

	public getFacilitesFutureChanges(roomId: string){
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}room/changes/${this.toolsInfoService.info.mtcId}?roomid=${roomId}`);
	}

	public createMissionariesFutureChanges(list){
		const subscription = this.http.post(`${this.hostname.mtcToolsAPIUrl}missionary/changes`, list);
		subscription.subscribe(()=>{
			this.futureChangesDisplayToast(list);
		});
		return subscription;
	}

	public createTrainingGroupsFutureChanges(list){
		const subscription = this.http.post(`${this.hostname.mtcToolsAPIUrl}training/changes`, list);
		subscription.subscribe(()=>{
			this.futureChangesDisplayToast(list);
		});
		return subscription;
	}

	public createRoomsFutureChanges(list, date?){
		let changes;
		if(date) {
			changes = this.formatFutureChanges(list, 'room', date);
		} else {
			changes = list;
		}
		const subscription = this.http.post(`${this.hostname.mtcToolsAPIUrl}room/changes`, changes);
		subscription.subscribe(()=>{
			if(changes.length === 1 && changes[0].futureValue === '9' && changes[0].mtcId) {
				this.deleteRoomDisplayToast();
			} else {
				this.futureChangesDisplayToast(changes);
			}
		});
		return subscription;
	}

	public futureChangesDisplayToast(futureChanges){
		let changePlurality = 'changes';
		if (futureChanges.length === 1){
			changePlurality = 'change';
		}
		this.toastService.success(`future ${changePlurality} <strong>successfully</strong> saved`);
	}

	public deleteRoomDisplayToast(){
		this.toastService.success(`room <strong>successfully</strong> deleted`);
	}
}
