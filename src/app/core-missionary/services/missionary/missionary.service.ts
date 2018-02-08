import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MissionaryApiService } from '../missionary-api';
import { HostnameService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class MissionaryService {
	private missionaryArray = [];
	private activeMissionarySubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
	private missionariesSubject:BehaviorSubject<any> = new BehaviorSubject<any>(this.missionaryArray);

	public loadingCount = 0;

	constructor(private missionaryApi: MissionaryApiService,
				private router: Router,
				private activatedRoute: ActivatedRoute,
				private hostname: HostnameService,
				private http: HttpClient){}

	get selectedMissionary() {
		return this.activeMissionarySubject.asObservable();
	}

	get missionaries() {
		return this.missionariesSubject.asObservable();
	}

	getMissionaryCount() {
		return this.missionaryArray.length;
	}

	setActiveMissionary(missionary) {
		this.router.navigate([], {
			queryParams: { missionaryId: missionary.missionaryId },
			relativeTo: this.activatedRoute
		});
	}

	isActiveMissionary(missionary) {
		return this.activeMissionarySubject.getValue() && this.activeMissionarySubject.getValue().missionaryId === missionary.missionaryId;
	}

	removeAllMissionaries() {
		this.missionaryArray = [];
		this.missionariesSubject.next(this.missionaryArray);
		this.activeMissionarySubject.next({});
	}

	getPicture(person){
		let missionaryId = '';
		if(person && person.missionaryId){
			missionaryId = person.missionaryId;
		}
		return `https://apps.mtc.byu.edu/getphoto/getPhoto.jsp?keyId=${missionaryId}&keyType=missionary`;
	}

	removeMissionary(missionary) {
		this.missionaryArray.splice(this.missionaryArray.indexOf(missionary),1);
		this.missionariesSubject.next(this.missionaryArray);
		if(this.isActiveMissionary(missionary) && this.missionaryArray.length > 0){
			this.activeMissionarySubject.next(this.missionaryArray[0]);
			this.router.navigate(['/missionary'], {queryParams: {missionaryId: this.missionaryArray[0].missionaryId}});
		}else if(this.missionaryArray.length === 0){
			this.activeMissionarySubject.next([]);
		}
	}

	addAllMissionaries(ids){
		ids.forEach((id) => {
			setTimeout(() => this.setSelectedMissionary(id));
		});
	}

	getMissionary(missionaryId){
		return this.missionaryArray.find((miss) => {
			return miss.missionaryId === missionaryId;
		});
	}

	setSelectedMissionary(missionaryId){
		if(missionaryId){
			const missionary = this.getMissionary(missionaryId);
			if(missionary){
				this.activeMissionarySubject.next(missionary);
			}else{
				this.loadingCount++;
				this.missionaryArray.push({missionaryId: missionaryId, fullName: 'Loading...'});
				this.missionaryApi.getMissionaryById(missionaryId).subscribe((miss: any) => {
					this.loadingCount--;
					if(!_.isEmpty(miss)){
						const index = this.missionaryArray.findIndex((tab) => tab.missionaryId === miss.missionaryId);
						this.missionaryArray.splice(index, 1, miss);
						this.missionariesSubject.next(this.missionaryArray);
						this.activeMissionarySubject.next(miss);
					}
				});
			}
		}
	}

	formatAddress(addressString: string) {
		let addressHTML = '';
		const addressArray = addressString.split('\r\n');
		addressArray.slice(0, addressArray.length - 1).forEach((line) => addressHTML += `<span>${line}</span><br>`);
		return addressHTML;
	}

	getTeacherComments(missionaryId) {
		return this.http.get(`${this.hostname.mtcToolsAPIUrl}/teacher/comments/${missionaryId}/`);
	}
}
