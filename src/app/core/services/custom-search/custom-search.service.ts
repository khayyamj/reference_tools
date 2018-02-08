import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MTCToastService } from 'mtc-modules';
import { HostnameService, ToolsInfoService } from '../../../shared/services';
import { Subject } from 'rxjs/Subject';
import { CheckboxTableColumn } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { CustomSearchEditDatesComponent } from '../../components/custom-search/edit-dates';

@Injectable()
export class CustomSearchService {

	criteria:any = {
		preMTC:false,
		scheduled:false,
		inResidence:true,
		departed:false,
		all:false
	};

	savedSearch: any = {};

	columns: CheckboxTableColumn[] = [];

	get placeholder() {
		return this.hasSearched ? 'No results have been found' : 'There is no information to display';
	}

	missionaries = [];
	searches:any[] = [];
	isCriteriaExpanded = false;
	hasSearched = false;
	loading = false;
	isFirstVisit = true;

	constructor(private http: HttpClient,
				private hostname: HostnameService,
				private toolsInfoService: ToolsInfoService,
				private toastService: MTCToastService,
				private dialog: MatDialog){
		this.http.get(`${this.hostname.mtcToolsAPIUrl}defaultcolumns/custom-search`).subscribe((columnInfo:any) => {
						this.columns = columnInfo.fullColumns;
					});
				}

	getSearchList(){
		this.loading = true;
		this.http.get(`${this.hostname.mtcToolsAPIUrl}customsearch/criteria/user`).subscribe((response:any) => {
			this.searches = response;
			this.loading = false;
		});
	}

	clearCriteria(){
		this.criteria = {
			preMTC:false,
			scheduled:false,
			inResidence:true,
			departed:false,
			all:false
		};
		this.hasSearched = false;
		this.savedSearch = {};
		this.missionaries = [];
	}

	search(){
		const sub = new Subject();
		this.loading = true;
		this.http.post(`${this.hostname.mtcToolsAPIUrl}customsearch/${this.toolsInfoService.info.mtcId}/?limitTo=300`,this.criteria).subscribe((missionaries:any[]) => {
			this.loading = false;
			this.missionaries = missionaries;
			this.hasSearched = true;
			sub.next();
			sub.complete();
		});
		return sub.asObservable();
	}

	remove(){
		this.missionaries = this.missionaries.filter((missionary) => {
			return !missionary.selected;
		});
		if(this.missionaries.length === 0){
			this.hasSearched = false;
		}
	}

	saveSearch(isUpdate, router?){
		this.savedSearch.criteria = JSON.stringify(this.criteria);
		this.savedSearch.columns = JSON.stringify(this.columns);
		this.http[isUpdate ? 'put':'post'](`${this.hostname.mtcToolsAPIUrl}customsearch/criteria/`,this.savedSearch).subscribe(() => {
			this.toastService.success('Custom search criteria was <strong>successfully</strong> saved');
			if(isUpdate && router !== undefined) {
				router.navigate(['/custom-search/list']);
			}
		});
	}

	removeSearches(){
		const searchIds = this.searches.filter(s => s.selected).map(s => s.customSearchId).join(',');
		this.http.delete(`${this.hostname.mtcToolsAPIUrl}customsearch/criteria/${searchIds}`, {responseType: 'text'}).subscribe(() => {
			this.toastService.success('Custom searches were <strong>successfully</strong> deleted');
			this.searches = this.searches.filter(s => !s.selected);
		});
	}

	setSearch(searchId,isEdit){
		const sub = new Subject();
		if(searchId){
			this.loading = true;
			this.http.get(`${this.hostname.mtcToolsAPIUrl}customsearch/criteria/${searchId}`).subscribe((searchResponse) => {
				this.savedSearch = searchResponse;
				this.criteria = this.savedSearch.fullCriteria;
				this.columns = this.savedSearch.fullColumns;
				this.isCriteriaExpanded = ['birthPlace','birthdayStart','birthdayEnd','birthCountries','genders','subStatuses','secureSubStatuses','trainingWeeks','missionArrivalEnd','missionReleaseEnd'].some((value) => {
					return this.criteria[value];
				});
				if(!isEdit) {
					const reg = new RegExp('[Start|End]$');
					const dateReg = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}');
					if(Object.keys(this.savedSearch.fullCriteria).some((criteria) => reg.test(criteria) && dateReg.test(this.savedSearch.fullCriteria[criteria]))) {
						const dialogResult = this.dialog.open(CustomSearchEditDatesComponent, {
							data:this.savedSearch.fullCriteria,
							disableClose:true
						});
						dialogResult.afterClosed().subscribe((changedCriteria) => {
							if(Object.keys(changedCriteria).length !== 0) {
								Object.keys(changedCriteria).forEach((prop) => {
									this.savedSearch.fullCriteria[prop] = changedCriteria[prop];
								});
								this.saveSearch(true);
							}
							this.getRows(sub);
						});
					} else {
						this.getRows(sub);
					}
				}
			});
		} else {
			this.clearCriteria();
		}
		this.loading = false;
		return sub.asObservable();
	}

	getRows(sub) {
		this.search().subscribe(() => {
			sub.next();
			sub.complete();
		});
	}

	saveColumnInfo(newColumns){
		this.http.post(`${this.hostname.mtcToolsAPIUrl}defaultcolumns`, {
			columns:JSON.stringify(newColumns),
			tableGroup:'custom-search'
		}).subscribe();
	}

}
