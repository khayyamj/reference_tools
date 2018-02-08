import { Injectable } from '@angular/core';
import { HostnameService } from '../../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EditExceptionService {

	public possibleFields:any = [
		{name:'Type'},//types
		{name: 'Citizenship'},//countries
		{name: 'Home Country'},//countries
		{name: 'Native Language'},//languages
		{name: 'Mission'},//missions
		{name: 'Sub Mission'},//missions
		{name: 'Special Category'},//categories
		{name: 'Mission Language'},//languages
		{name: 'Mission Arrival Date', values: [{},{}], isDate: true},
		{name: 'Scheduled Arrival', values: [{},{}],  isDate: true},
		{name: 'Scheduled Departure', values: [{},{}], isDate: true},
		{name: 'Status'},//statuses
		{name: 'Sub Status'},//substatuses
		{name: 'Training Language'},//languages
		{name: 'Sub-Training Language'},//languages
		{name: 'Group Date', values: [{},{}], isDate: true}
	];

	fieldNames = {
		'Type': 'types',
		'Citizenship': 'countries',
		'Home Country': 'countries',
		'Native Language': 'languages',
		'Mission': 'missions',
		'Sub Mission': 'missions',
		'Special Category': 'categories',
		'Mission Language': 'languages',
		'Status': 'statuses',
		'Sub Status': 'substatuses',
		'Training Language': 'traininglanguages',
		'Sub-Training Language': 'traininglanguages',
	};

	constructor(private hostname: HostnameService,
				private http: HttpClient) { }

	public updateExceptions(exception, originalException) {
		if(originalException !== 'create'){
			originalException.fields.forEach((field) => {
				const updatedField = exception.fields.find((newField) => field.id === newField.id);
				if(!updatedField.delete){
					field.values.forEach((value) => {
						const updatedValueIndex = updatedField.values.findIndex((newValue) => value.name === newValue.name);
						if(updatedValueIndex !== -1){
							updatedField.values[updatedValueIndex] = value;
						} else {
							value.delete = true;
							updatedField.values.push(value);
						}
					});
				}
			});
		}
		exception.fields.forEach((field, index) => {
			if(!field.isDate){
				field.values = field.values.map((value) => {
					if(!value.fieldId){
						value = {name: value.name};
					}
					return value;
				});
			} else if (!field.values[0].name && !field.values[0].name){
				exception.fields.splice(index,1);
			}
		});

		exception.actions.forEach((action)=>{
			const changedAction=Object.keys(exception.selectedActions).find(item=>item===action.name);
			if(changedAction){
				if(changedAction!=='trainingGroup' && changedAction !== 'district'){
					switch(changedAction){
						case 'room':
							if(exception.selectedActions.room.room){
								action.value=exception.selectedActions.room.room.roomId;
							} else {
								action.delete = true;
							}
							break;
						case 'roomRange':
							if(exception.selectedActions.roomRange.roomId){
								action.value=exception.selectedActions.roomRange.roomId;
							} else {
								action.delete = true;
							}
							break;
						case 'residenceRoom':
							if(exception.selectedActions.residenceRoom.room){
								action.value=exception.selectedActions.residenceRoom.room.roomId;
							} else {
								action.delete = true;
							}
							break;
						case 'residenceRoomRange':
							if(exception.selectedActions.residenceRoomRange.roomId){
								action.value=exception.selectedActions.residenceRoomRange.roomId;
							} else {
								action.delete = true;
							}
							break;
						default:
							if(exception.selectedActions[changedAction].length){
								action.values.forEach((value) =>{
									if(exception.selectedActions[changedAction].every(newValue => newValue.id !== value.value)){
										value.delete = true;
									}
								});
							} else {
								action.delete = true;
							}
					}
				}
			} else {
				action.delete=true;
			}
		});

		Object.keys(exception.selectedActions).forEach((item:any)=>{
			if(exception.actions.every(action=>action.name!==item) || !exception.actions.length){
				if(item ==='room'){
					if(exception.selectedActions.room.room){
						exception.actions.push({
							value:exception.selectedActions.room.room.roomId,
							name:item
						});
					} else{
						delete exception.selectedActions[item];
					}
				} else if(item ==='roomRange'){
					if(exception.selectedActions.roomRange.roomId){
						exception.actions.push({
							value:exception.selectedActions.roomRange.roomId,
							name:item,
						});
					} else{
						delete exception.selectedActions[item];
					}
				} else if(item ==='residenceRoom'){
					if(exception.selectedActions.residenceRoom.room){
						exception.actions.push({
							value:exception.selectedActions.residenceRoom.room.roomId,
							name:item,
						});
					} else{
						delete exception.selectedActions[item];
					}
				} else if(item ==='residenceRoomRange'){
					if(exception.selectedActions.residenceRoomRange.roomId){
						exception.actions.push({
							value:exception.selectedActions.residenceRoomRange.roomId,
							name:item,
						});
					} else{
						delete exception.selectedActions[item];
					}
				} else if(item ==='zone' || item ==='branch'){
					if(exception.selectedActions[item].length){
						exception.actions.push({
							name:item,
							values: exception.selectedActions[item].map((action)=>{
									return {value:action.id};
								})
						});
					}
				} else {
					exception.actions.push({
						value:'1',
						name:item,
					});
				}
			} else if(item === 'zone' || item === 'branch') {
				const values = exception.actions.find(action=>action.name === item).values;
				exception.actions.find(action=>action.name === item).values = values.concat(
					exception.selectedActions[item].filter((newAction) => {
						return values.every(v=>v.value !== newAction.id);
					}).map((newAction) => {
						return {value:newAction.id};
					})
				);
			}
		});

		const list = [exception];
		return this.http.post<any[]>(`${this.hostname.mtcToolsAPIUrl}exceptions`, list);
	}

}
