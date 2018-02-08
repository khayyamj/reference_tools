import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostnameService } from '../../shared/services';

@Injectable()
export class AssistanceService {
	public loading = 0;
	missionary: any = {missionaryId: 0};
	categories: any = [];

	constructor(
		private http: HttpClient,
		private hostName: HostnameService) {
			this.getAssistanceCategories();
		}

	//TODO these aren't assistance endpoints, why not use missionaryapi service?
	getMissionary(missionaryId: number) {
		return this.http.get(`${this.hostName.missionaryUrl}missionaries/${missionaryId}?includePersonalInfo=true&includeMTCInfo=true&includeMissionInfo=true`);
	}

	getMissionaryPicture(id: number): string {
		return id ? `https://apps.mtc.byu.edu/getphoto/getPhoto.jsp?keyId=${id}&keyType=missionary` : '';
	}

	getMissionaryData(missionaryId: number) {
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/mission/missionary/${missionaryId}`);
	}

	getAssistanceItems() {
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}assistance/inventory`);
	}

	getProjectionMissionaries() {
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}assistance/projection`);
	}

	getAssistanceCategories() {
		this.http.get(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/types`).subscribe((categories) => this.categories = categories);
	}

	createAssistanceCategory(category) {
		return this.http.post(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/types`, category);
	}

	updateAssistanceCategory(category) {
		return this.http.put(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/types`, category);
	}

	deleteAssistanceCategory(category) {
		return this.http.delete(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/types/${category.categoryId}`, { responseType: 'text' });
	}

	upsertItem(item,isCreate){
		if(isCreate){
			return this.http.post(`${this.hostName.mtcToolsAPIUrl}assistance/inventory`,item);
		}else{
			return this.http.put(`${this.hostName.mtcToolsAPIUrl}assistance/inventory`, item);
		}
	}

	deleteItems(items){
		//TODO a new endpoint will be made in the backend that accepts the whole array, change this to point at that one when it is implemented
		items.forEach((item) => {
			this.http.delete(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/${item.id}`,{responseType: 'text'}).subscribe();
		});
	}

	getMissionaryInventory(missionaryId: number) {
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/mission/missionary/${missionaryId}`);
	}

	getSpecialtyItems(missionaryId: number) {
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/specialtyitems/${missionaryId}`);
	}

	saveDonatedItems(selectedItem) {
		return this.http.post(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/missionary`, selectedItem).subscribe();
	}

	saveBroughtItems(selectedItem) {
		return this.http.post(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/incoming/missionary/`, selectedItem).subscribe();
	}

	getLoanedItems(missionaryId: number) {
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/loan/missionary/${missionaryId}`);
	}

	saveLoanedItems(selectedItem) {
		return this.http.put(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/loan/missionary`, selectedItem).subscribe();
	}

	createLoanedItem(selectedItem) {
		return this.http.post(`${this.hostName.mtcToolsAPIUrl}assistance/inventory/loan/missionary`, selectedItem).subscribe();
	}
}
