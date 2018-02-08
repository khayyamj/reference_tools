import { Injectable } from '@angular/core';
import { HostnameService, ToolsInfoService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MTCToastService } from 'mtc-modules';

@Injectable()
export class ZoneManagementService {

	zones = new BehaviorSubject([]);
	public zoneToEdit;
	public _results = new BehaviorSubject([]);
	public results = this._results.asObservable();
	public criteria:any = {
		zones: [],
		traininglanguages: [],
		schedules: [],
		branches: []
	};
	constructor(private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private http: HttpClient,
				private toastService: MTCToastService) {
		this.clearZone();
	}

	clearZone() {
		this.zoneToEdit = {
			zone: { zone: '', id: '' },
			traininglanguages: [{ name: '', id: '' }],
			schedules: [{ name: '', id: '' }],
			branch: { name: '', id: '' }
		};
	}

	public getZones() {
		this.http.get(`${this.hostname.mtcAPIUrl}zones/${this.toolsInfoService.info.mtcId}`)
			.subscribe((zones:any[]) => {
				this.zones.next(zones);
			});
		return this.zones.asObservable();
	}

	public getZoneById(id) {
		return this.http.get(`${this.hostname.mtcAPIUrl}zones/${this.toolsInfoService.info.mtcId}/` + id);
	}

	public searchZones() {
		const zones = this.criteria.zones;
		const traininglanguages = this.criteria.traininglanguages;
		const schedules = this.criteria.schedules;
		const branches = this.criteria.branches;
		let zoneList = this.zones.getValue();
		const criteria = [];
		const attributes = [];
		//set up for the search
		if (zones.length) {
			criteria.push(zones);
			attributes.push('zone');
		}
		if (traininglanguages.length) {
			criteria.push(traininglanguages);
			attributes.push('language');
		}
		if (schedules.length) {
			criteria.push(schedules);
			attributes.push('schedule');
		}
		if (branches.length) {
			criteria.push(branches);
			attributes.push('branch');
		}
		if(!zoneList.length){
			zoneList = [zoneList];
		}
		this._results.next(zoneList.filter((zone) => {
			return criteria.every((criterion, index) => {
				return this.checkZone(zone, attributes[index], criterion);
			});
		}));
	}

	public clearCriteria() {
		this.criteria = {
			zones: [],
			traininglanguages: [],
			schedules: [],
			branches: []
		};
	}

	upsertZone(zoneToEdit) {
		zoneToEdit.mtcId = this.toolsInfoService.info.mtcId;
		return this.http.post(`${this.hostname.mtcAPIUrl}zones`, zoneToEdit);
	}

	deleteZone(zoneToEdit) {
		zoneToEdit.delete = true;
		return this.http.post(`${this.hostname.mtcAPIUrl}zones`, zoneToEdit);
	}

	public displayToast(action, plural) {
		const item = plural ? 'zones' : 'zone';
		this.toastService.success(`${item} <strong>successfully</strong> ${action}`);
	}

	public displayErrorToast(action, plural) {
		const item = plural ? 'zones' : 'zone';
		this.toastService.error(`${item} <strong>failed</strong> to ${action}`);
	}

	private checkZone(zone, attr, filterArray) {
		return filterArray.some(item => { //when there are multiple criterion for a particular criteria the zone only needs to match one
			return zone[attr] === item.name; // either zone or the name will be checked, no item will have both
		});
	}

}
