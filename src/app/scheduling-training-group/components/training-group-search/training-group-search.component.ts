/* tslint:disable:no-unused-variable */

import { Component } from '@angular/core';
import { TrainingGroupService } from '../../services';
import { MatDialog } from '@angular/material';
import { TrainingGroupNewComponent } from '../training-group-new';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CheckboxTableConfig, CheckboxTableColumn, MtcDatePipe } from 'mtc-modules';

@Component({
	selector: 'scheduling-training-group-search',
	templateUrl: './training-group-search.component.html',
	styleUrls: ['./training-group-search.component.less']
})
export class TrainingGroupSearchComponent {

	rows = [];
	searchText = '';
	type={
		schedule:false,
		residence:true,
		departed:false
	};
	noResults = false;
	startDate = moment(new Date()).subtract(1, 'years');
	endDate = moment(new Date());
	tablePlaceholder = 'Search for a group by ID, training schedule, language, classroom, member name or member ID';
	columns: CheckboxTableColumn[] = [
		{ title: 'Name', attr: 'trainingGroup' },
		{ title: 'Training Schedule', attr: 'schedule' },
		{ title: 'Language', attr: 'language' },
		{ title: 'Training Week', attr: 'week' },
		{ title: 'Classroom', attr: 'classroom' },
		{ title: 'Zone', attr: 'zone' },
		{ title: 'Number of Members', attr: 'memberCount' }
	];
	config: CheckboxTableConfig = {
			placeholder: this.tablePlaceholder,
			topButtons: [
				{ text: 'Open All', function: this.openChecked.bind(this) }
			]
	};

	constructor(private trainingGroupService: TrainingGroupService,
				private mtcDate: MtcDatePipe,
				private dialog: MatDialog,
				private router: Router) {
	}

	search() {
		this.trainingGroupService.isSearching = true;
		const calls=[];
		if (this.type.departed) {
			calls.push(this.trainingGroupService.getTrainingGroupsDateFilter('Departed', this.searchText, this.mtcDate.transform(this.startDate), this.mtcDate.transform(this.endDate)));
		}
		if(this.type.residence){
			calls.push(this.trainingGroupService.getTrainingGroups('In-Residence', this.searchText));
		}
		if(this.type.schedule){
			calls.push(this.trainingGroupService.getTrainingGroups('Scheduled', this.searchText));
		}
		Observable.zip(...calls).subscribe((dataList)=>{
			this.rows=[];
			dataList.forEach((data:any)=>{
				this.rows = this.rows.concat(data);
				if(!this.rows[0] || !this.rows[0].id) {
					this.tablePlaceholder = 'No results have been found';
				}
				this.trainingGroupService.isSearching = false;
			});
		});
	}

	createNew() {
		this.dialog.open(TrainingGroupNewComponent, {
			width: '425px'
		});
	}

	openChecked(selectedRows) {
		selectedRows.forEach((row,index) => {
			//TODO when would index ever be falsey here???  Seems impossible
			if(index){
				this.trainingGroupService.addTrainingGroup(row.id, false);
			} else {
				this.router.navigate(['scheduling/training-groups/search/view'], { queryParams: { 'training_group_id': row.id } });
			}
		});
	}
}
