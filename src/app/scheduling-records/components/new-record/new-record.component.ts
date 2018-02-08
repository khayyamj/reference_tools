import { MatDialog } from '@angular/material';
import { SimpleConfirmationComponent, MTCToastService } from 'mtc-modules';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToolsInfoService } from '../../../shared';
import { FutureChangesService } from './../../services';
import { MissionaryApiService } from '../../../core-missionary/services';

@Component({
	selector: 'scheduling-records-new-record',
	templateUrl: './new-record.component.html',
	styleUrls: ['./new-record.component.less']
})
export class NewRecordComponent implements OnInit {

	public newRecord;
	public today = new Date;
	@ViewChild('f') newRecordForm: NgForm;
	types = ['Couple', 'Mission President'].map((type) => ({ name: type }));
	dateValid = true;
	constructor(private toastService: MTCToastService,
				private dialog: MatDialog,
				private futureChangesService: FutureChangesService,
				public toolsInfoService: ToolsInfoService,
				private missionaryApi: MissionaryApiService) {}

	ngOnInit() {
		this.newRecord = this.futureChangesService.newRecord;
	}

	assignValuesRecord(form){
		if(form.valid) {
			this.newRecord.type = this.newRecord.selectedType.name;
			this.newRecord.gender = this.newRecord.selectedGender.id;
			if(this.newRecord.selectedMission){
				this.newRecord.missionId = this.newRecord.selectedMission.id;
			}
			if(this.newRecord.selectedMissionLanguage){
				this.newRecord.missionLanguageId = this.newRecord.selectedMissionLanguage.id;
			}
			if(this.newRecord.selectedTrainingLanguage){
				this.newRecord.trainingLanguageId = this.newRecord.selectedTrainingLanguage.id;
			}
			if(this.newRecord.selectedSpecialCategory){
				this.newRecord.specialCategory = this.newRecord.selectedSpecialCategory.name;
			}
			this.newRecord.mtcId = this.toolsInfoService.info.mtcId;
			this.newRecord.firstName = form.value.firstName;
			this.newRecord.lastName = form.value.lastName;
			this.newRecord.middleName = form.value.middleName;
			this.newRecord.scheduledArrival = form.value.arrivalDate;
			this.newRecord.scheduledDeparture = form.value.departureDate;

			this.missionaryApi.createMissionaryRecord(this.newRecord).subscribe(()=>{
				this.toastService.success('New record <strong>successfully</strong> created');
			});
			this.futureChangesService.newRecord = {};
			this.newRecord = this.futureChangesService.newRecord;
			this.newRecordForm.resetForm();
		}
	}

	cancelRecord() {
		const config = {
			cancelButtonText: 'no',
			confirmationButtonText: 'yes',
			content: 'Are you sure you want to cancel this record?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width:'400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				this.futureChangesService.newRecord = {};
				this.newRecord = this.futureChangesService.newRecord;
				this.newRecordForm.resetForm();
			}
		});
	}

	importCsv(event) {
		let dataset = {};
		const newFile = event.target.files[0];
		Papa.parse(newFile, {
			header: true,
			skipEmptyLines: true,
			complete: results => {
				dataset = results.data;
				this.missionaryApi.createNewMissionary(dataset).subscribe();
			}
		});
	}
}
