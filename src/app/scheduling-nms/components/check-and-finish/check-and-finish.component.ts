import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SimpleConfirmationComponent } from 'mtc-modules';
import { NewMissionarySchedulingService } from './../../services';
import { EditMissionayExceptionComponent } from './edit-missionary-exception';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CheckboxTableColumn, CheckboxTableConfig} from 'mtc-modules';
import * as _ from 'lodash';

@Component({
	selector: 'app-new-missionary-check-and-finish',
	templateUrl: './check-and-finish.component.html',
	styleUrls: ['./check-and-finish.component.less']
	})
export class CheckAndFinishComponent implements OnInit {

	selectedTab = 'Complications';
	viewingTable = true;
	complicationsTab = true;
	scheduleDate;
	allMissionaries = [];
	loadingComplications = true;
	loadingMissionaries = true;
	showAllMissionaries: boolean;

	columns: CheckboxTableColumn[] = [
		{ title: 'ID', attr: 'missionaryId', width: 5, fixed: true },
		{ title: 'Type', attr: 'type', width: 5, fixed: true },
		{ title: 'Missionary', attr: 'fullName', width:30, fixed: true },
	];
	juniorColumns: CheckboxTableColumn[] = [
		{ title: 'Branch-District', attr: 'branchDistrict' },
		{ title: 'Residence Room', attr: 'residence' },
		{ title: 'Companion', attr: 'companionFullName1' },
		{ title: 'Companion 2', attr: 'companionFullName2' },
		{ title: 'Special Category', attr: 'specialCategory'},
		{ title: 'Training Schedule', attr: 'schedule'},
		{ title: 'Classroom', attr: 'classroom' },
		{ title: 'Mailbox', attr: 'mailbox'},
		{ title: 'Mission Language', attr: 'language'}
	];

	seniorColumns: CheckboxTableColumn[] = [
		{ title: 'Companion', attr: 'companion' },
		{ title: 'Curic.', attr: 'curriculum' },
		{ title: 'Mission.', attr: 'mission' },
		{ title: 'SP. CAT.', attr: 'specialCategory' },
		{ title: 'Sch. Dep.', attr: 'departure'},
		{ title: 'RES. ROOM', attr: 'residence' },
		{ title: 'Classroom', attr: 'classroom' },
		{ title: 'Trn. Sched.', attr: 'schedule'},
		{ title: 'BR-DST', attr: 'branchDistrict' },
		{ title: 'Mailbox', attr: 'mailbox'}
	];
	checkboxTableConfig: CheckboxTableConfig = {
		placeholder: 'There are no results for this table',
		rowButtons: [{text:'Edit', function: this.editResult.bind(this)}]
	};

	routeType:string;
	tables;
	type: String;

	constructor(private dialog: MatDialog,
				public newMissionarySchedulingService:NewMissionarySchedulingService,
				private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params.subscribe((params) => {
			this.type = params['type'];
			if(!this.newMissionarySchedulingService.groupDate){
				this.newMissionarySchedulingService.getScheduleDate(this.type);
			}
			if(this.type === 'Senior') {
				this.tables = [{ name: 'Residence Errors', viewing: false, results: [], editing: false }];
				this.columns = this.columns.concat(this.seniorColumns);
				this.setSeniorMissionaries();
			} else {
				this.tables = [{ name: 'Solo Missionaries', viewing: false, results: [], editing: false },
				{ name: 'Non-Branch Default Residence', viewing: false, results: [], editing: false },
				{ name: 'Non-Zone Classroom', viewing: false, results: [], editing: false },
				{ name: 'Multiple Training Groups Per Classroom', viewing: false, results: [], editing: false }];
				this.columns = this.columns.concat(this.juniorColumns);
				this.setYoungMissionaries(this.newMissionarySchedulingService.checkRunScheduling());
			}
		});
	}

	startLoading() {
		this.allMissionaries = [];
		this.loadingMissionaries = true;
		this.loadingComplications = true;
	}

	setSeniorMissionaries() {
		this.startLoading();
		this.newMissionarySchedulingService.getScheduledSeniorMissionaries('residence').subscribe((residenceErrors)=>{
			this.tables[0].results = residenceErrors;
			this.loadingComplications = false;
		});
		this.newMissionarySchedulingService.getScheduledSeniorMissionaries().subscribe((allMissionaries:any)=>{
			this.allMissionaries = allMissionaries;
			this.loadingMissionaries = false;
		});
	}

	setYoungMissionaries(date?) {
		this.startLoading();
		const calls = [];
		this.newMissionarySchedulingService.getScheduledMissionaries('', date).subscribe((allMissionaries: any) => {
			this.allMissionaries = allMissionaries;
			this.loadingMissionaries = false;
			if(!date && _.isEmpty(this.allMissionaries[0])){
				this.setYoungMissionaries(this.newMissionarySchedulingService.formattedGroupDate);
			} else {
				['solo','non-branch','non-zone','multipleTraining'].forEach((type)=>{
					calls.push(this.newMissionarySchedulingService.getScheduledMissionaries(type));
				});
				Observable.zip(...calls).subscribe((exceptionLists)=>{
					exceptionLists.forEach((exceptionList: any, index)=>{
						this.tables[index].results = exceptionList;
					});
					this.loadingComplications = false;
				});

			}
		});
	}

	openConfirmation(status: boolean, allMissionaries: any) {
		if(status){
			const config = {
				cancelButtonText: 'Restart',
				confirmationButtonText: 'Finish',
				content: 'There are unresolved complications. Are you sure you want to continue anyway?'
			};
			this.dialog.open(SimpleConfirmationComponent, {
				data: config,
				width:'400px'
			}).afterClosed().subscribe((response: boolean) => {
				if(response) {
					this.newMissionarySchedulingService[`saveScheduled${this.type}Missionaries`](allMissionaries).subscribe();
				}
			});

		} else {
			const config = {
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: `Are you sure you want to unschedule all ${this.type} missionaries and restart the scheduling process?`
			};
			this.dialog.open(SimpleConfirmationComponent, {
				data: config,
				width:'400px'
			}).afterClosed().subscribe((response: boolean) => {
				if (response) {
					this.type === 'Senior' ? this.setSeniorMissionaries() : this.setYoungMissionaries(this.newMissionarySchedulingService.formattedGroupDate);
				}
			});
		}
	}

	editResult(missionary, missionaries){
		this.dialog.open(EditMissionayExceptionComponent,{
				data: missionary,
			}).afterClosed().subscribe((response: any) => {
				if (response && this.type === 'Young') { // only save changes for young missionaries in db temp table
					this.newMissionarySchedulingService.saveScheduledYoungMissionary(response).subscribe();

					//missionaries[missionaries.indexOf(missionary)] = response;
					//TODO remove below 7 lines and use above line when changes to checkbox table row buttons takes affect
					this.allMissionaries[this.allMissionaries.indexOf(missionary)] = response;
					this.tables.forEach((table) => {
						const index = table.results.findIndex((m) => m.missionaryId === response.missionaryId);
						if(index !== -1){
							table.results[index] = response;
						}
					});
				}
			});
	}

	setSelectedTab(newTab){
		this.selectedTab = newTab;
		if(newTab === 'All Missionaries'){
			this.showAllMissionaries = true;
		}
	}

	showTable(table){
		table.viewing = !table.viewing;
		table.view = true;
	}
}
