import { Component, OnInit, Input } from '@angular/core';
import { SimpleConfirmationComponent } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { ToolsInfoService } from '../../../../shared';
import { TrainingGroupService } from '../../../services';
import { EditGroupFutureChangeComponent } from './edit-group-future-change';
import { FutureChangesService } from '../../../../scheduling-records/services';
import { CheckboxTableConfig, CheckboxTableColumn } from 'mtc-modules';
import * as moment from 'moment';

@Component({
	selector: 'scheduling-training-group-future-changes',
	templateUrl: './training-group-future-changes.component.html',
	styleUrls: ['./training-group-future-changes.component.less']
})
export class TrainingGroupFutureChangesComponent implements OnInit {
	@Input() trainingGroupName;
	date = new Date();
	selectedDate = new Date();
	trainingChanges = [];
	trainingMembers = [];
	selectedChanges = [];

	columns: CheckboxTableColumn[] = [
		{ title: 'Change', attr: 'changeType' },
		{ title: 'Current Assignment', attr: 'currentValue' },
		{ title: 'Future Assignment', attr: 'futureValue' },
		{ title: 'Effective Date and Time', attr: 'effectiveDateString' },
		{ title: 'Change Made By', attr: 'updatedBy' },
		{ title: 'Change Date and Time', attr: 'updatedDateString' },
	];
	memberColumns: CheckboxTableColumn[] = [
		{ title: 'ID', attr: 'missionaryId' },
		{ title: 'Type', attr: 'type' },
		{ title: 'Missionary', attr: 'fullName' },
		{ title: 'Effective Date', attr: 'startDate' },
		{ title: 'Change Made By', attr: 'updatedBy' },
	];
	config: CheckboxTableConfig = {
		placeholder: 'Future changes are loading',
		topButtons: [
			{ text: 'Edit', function: this.edit.bind(this) },
			{ text: 'Delete', function: this.delete.bind(this) }
		]
	};
	memberConfig: CheckboxTableConfig = {
		placeholder: 'Future changes are loading',
	};

	constructor(public trainingGroupService: TrainingGroupService,
				private toolsInfoService: ToolsInfoService,
				private futureChangesService: FutureChangesService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.getData();
	}

	updateSelectedChanges() {
		this.selectedChanges = [];
		this.selectedChanges = this.trainingChanges.filter((change) => {
			return change.selected;
		}).concat(this.trainingMembers.filter((change) => {
			return change.selected;
		}));
	}

	delete() {
		this.updateSelectedChanges();
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete these future changes?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width: '450px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				const changes = [];
				this.selectedChanges.forEach((change) => {
					changes.push({
						fullName: this.trainingGroupName,
						effectiveDate: moment(new Date()).format('MM/DD/YYYY'),
						changeType: change.changeType.toLowerCase(),
						mtcId: this.toolsInfoService.info.mtcId,
						futureValue: change.currentValue
					});
				});

				this.futureChangesService.createTrainingGroupsFutureChanges(changes);
				this.trainingChanges = this.trainingChanges.filter((change) => {
					this.selectedChanges.forEach((selectedChange) => {
						if (selectedChange.id === change.id) {
							change.delete = true;
						}
					});
					return !change.delete;

				});
			}
		});
	}

	edit() {
		this.updateSelectedChanges();
		const selectedChange = this.selectedChanges[0];
		this.dialog.open(EditGroupFutureChangeComponent, {
			data:{ selectedChange: selectedChange, trainingGroupName: this.trainingGroupName },
			width: '400px'
		}).afterClosed().subscribe((data) => {
			if(data) {
				selectedChange.futureValue = data.futureValue;
				selectedChange.effectiveDate = data.effectiveDate;
				selectedChange.updatedDate = new Date();
				selectedChange.effectiveDateString = moment(selectedChange.effectiveDate).format('MM/DD/YY').toString();
				selectedChange.updatedDateString = moment(selectedChange.updatedDate).format('MM/DD/YYYY h:mm A').toString();
			}
		});
	}

	getData() {
		setTimeout(() => this.trainingGroupService.isSearching = true);
		let oneLoaded = false;
		function checkLoading(component) {
			oneLoaded ? component.trainingGroupService.isSearching = false : oneLoaded = true;
		}
		this.trainingGroupService.getTrainingGroupFutureChanges(this.trainingGroupName).takeWhile((data) => {
			if (data[0]) {
				return data[0].fullName === this.trainingGroupName;
			}
			checkLoading(this);
		}).subscribe((futureChanges:any) => {
			this.trainingChanges = futureChanges.map((change) => {
				change.effectiveDateString = moment(change.effectiveDate).format('MM/DD/YY').toString();
				change.updatedDateString = moment(change.updatedDate).format('MM/DD/YYYY h:mm A').toString();
				return change;
			});
			checkLoading(this);
		});

		this.trainingGroupService.getTrainingGroupFutureMissionaries(this.trainingGroupName).subscribe((trainingMembers:any)=>{
			checkLoading(this);
			this.trainingMembers = trainingMembers;
		});

	}

}
