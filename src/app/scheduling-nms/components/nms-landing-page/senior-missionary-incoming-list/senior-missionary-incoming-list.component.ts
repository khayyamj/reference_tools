import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditSeniorMissionaryModalComponent } from './../senior-missionary-edit-modal/senior-missionary-edit-modal.component';
import { NewMissionarySchedulingService } from '../../../services';
import { CheckboxTableConfig, CheckboxTableColumn } from 'mtc-modules';

@Component({
	selector: 'app-senior-missionary-incoming-list',
	templateUrl: './senior-missionary-incoming-list.component.html',
	styleUrls: ['./senior-missionary-incoming-list.component.less']
})
export class SeniorMissionaryListComponent {
	columns: CheckboxTableColumn[] = [
		{ title: 'ID', attr: 'missionaryId', fixed: true },
		{ title: 'Name', attr: 'fullName', showTooltip: true, fixed: true },
		{ title: 'Type', attr: 'type', fixed: true },
		{ title: 'Gender', attr: 'gender' },
		{ title: 'Home Phone', attr: 'homePhone', showTooltip: true, telephone: true},
		{ title: 'Cell Phone', attr: 'cellPhone', showTooltip: true, telephone: true},
		{ title: 'Email Address', attr: 'email', showTooltip: true},
		{ title: 'Email Sent', attr: 'emailDate' },
		{ title: 'Car', attr: 'bringingCar' },
		{ title: 'Housing', attr: 'accommodations' },
		{ title: 'Needs', attr: 'needs', isArray: {displayBy: 'name'}},
		{ title: 'Companion ID', attr: 'companionshipId'}
	];
	config: CheckboxTableConfig = {
		topButtons:[
			{text:'EDIT',function:this.openEditDialog.bind(this)},
			{text:'SEND SURVEY', function:this.onSendSurvey.bind(this)}
		],
		rowFunction:this.updateSearchResults.bind(this)
	};
	rows = [];
	loading: boolean;

	constructor(
		private newMissionarySchedulingService: NewMissionarySchedulingService,
		private dialog: MatDialog) {}

	changeSelected(newDates) {
		this.loading = true;
		this.newMissionarySchedulingService.getIncomingSeniorMissionaries(newDates[0].format('DD-MMM-YYYY')).subscribe((incomingSeniorMissionaries:any) => {
			this.rows = incomingSeniorMissionaries;
			this.loading = false;
		});
	}

	updateSearchResults(missionary):void {
		if (missionary.type === 'Couple') {
			const companion = this.rows.find((row)=>{
				return row.companionshipId === missionary.companionshipId && row !== missionary;
			});
			companion.selected = !missionary.selected;
		}
	}

	openEmail(recipient: String) {
		document.location.href = `mailto:${recipient}`;
	}

	onSendSurvey() {
		this.newMissionarySchedulingService.seniorIncomingSurvey(this.rows.filter((row)=>row.selected));
	}

	openEditDialog() {
		this.dialog.open(EditSeniorMissionaryModalComponent, {
			width: '530px',
			data:  this.rows.filter((row)=>row.selected)
		});
	}
}
