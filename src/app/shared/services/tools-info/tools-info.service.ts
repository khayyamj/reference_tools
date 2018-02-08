import { Injectable } from '@angular/core';
import { HostnameService } from '../hostname';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ToolsInfoService {

	public info:any = {};
	private observables:any = {};
	constructor(private hostname: HostnameService,
				private http: HttpClient){}

	init(){
		['buildings','rooms','residences','classrooms','mailboxes','usage','subusage','categories','schedules','zones','branches','ecclgroups','traininglanguages','sublanguages']
			.forEach((type) => {
				this.http.get(`${this.hostname.mtcAPIUrl}mtcs/${type}`).subscribe((data) => {
					this.info[type] = data;
					this.setLoaded(type,data);
				});
			});

		this.http.get(`${this.hostname.mtcToolsAPIUrl}missions`).subscribe((data)=>{
			this.info.missions = data;
			this.setLoaded('missions', data);
		});

		['statuses','substatuses','types','traininggroups','securesubstatuses']
			.forEach((type) => {
				this.http.get(`${this.hostname.missionaryUrl}${type}`).subscribe((data) => {
					this.info[type] = data;
					this.setLoaded(type, data);
				});
			});

		['languages','countries']
			.forEach((type) => {
				this.http.get(`${this.hostname.standardsUrl}${type}`).subscribe((data) => {
					this.info[type] = data;
					this.setLoaded(type, data);
				});
			});

		this.http.get(`${this.hostname.missionaryUrl}change/actions`).subscribe((data) => {
			this.info.actions = data;
		});

		const nameMapper = (item) => ({name:item, id: item});
		this.info.roomStatuses = [{name:'ACTIVE', id: '1'}, {name:'OFFLINE', id: '2'}];
		this.info.booleanList = [{name:'Yes', id: '1'}, {name:'No', id: '0'}];
		this.info.genders = [{id:'M',name:'Male'},{id:'F',name:'Female'}];
		this.info.trainingWeeks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].map(nameMapper);
		this.info.mtcId = '2010852';
		this.info.districts = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(nameMapper);
		this.info.needs = [{name:'ADA', id:1}, {name:'Dietary', id:2}, {name:'Both', id:0}];

	}

	isLoaded(type){
		if(!this.observables.hasOwnProperty(type)){
			this.observables[type] = new Subject<any>();
		}else{
			setTimeout(() => {
				this.observables[type].next(this.info[type]);
			},10);
		}
		return this.observables[type].asObservable();
	}

	setLoaded(type,value){
		if(this.observables.hasOwnProperty(type)){
			this.observables[type].next(value);
		}else{
			this.observables[type] = new Subject<any>();
		}
	}
}
