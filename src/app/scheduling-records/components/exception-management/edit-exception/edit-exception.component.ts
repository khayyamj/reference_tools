import { Component, OnInit, Inject } from '@angular/core';
import { EditExceptionService } from '../../../services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsInfoService } from '../../../../shared';
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
	selector: 'scheduling-edit-exception',
	templateUrl: './edit-exception.component.html',
	styleUrls: ['./edit-exception.component.less']
})
export class EditExceptionComponent implements OnInit {

	searchText;
	showConfirmation: boolean;
	dialogType;
	addValue = false;
	addingField = false;
	errorMessage = false;
	title: any;
	exception:any = {
		actions: [],
		fields: [],
	};
	exceptionName;
	exceptionAbbreviation;
	public exceptionsToEdit;
	fields = [];
	possibleFields = [];
	config = {
		cancelButtonText: 'No',
		confirmationButtonText: 'Yes',
		content: 'Are you sure you want to cancel?'
	};
	exceptionType = ''; // edit or new

	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
				private editExceptionService: EditExceptionService,
				public toolsInfoService: ToolsInfoService) { }

	ngOnInit() {
		this.exception.mtcId = this.toolsInfoService.info.mtcId;
		this.exceptionType = this.dialogData;
		this.fields = this.editExceptionService.possibleFields;
		if (this.exceptionType === 'create') {
			this.title = 'CREATE NEW EXCEPTION';
			this.exception.selectedActions = {};
		} else {
			this.title = 'EDIT EXCEPTION';
			this.exception = _.cloneDeep(this.exceptionType);
			this.exception.selectedActions = {};
			this.exceptionName = this.exception.name;
			this.exceptionAbbreviation = this.exception.abbreviation;
			this.exception.fields.forEach((element) => {
				if(element.name === 'Mission Arrival Date' || element.name === 'Scheduled Departure' || element.name === 'Scheduled Arrival' || element.name === 'Group Date'){
					element.isDate = true;
					if(!element.values[0]){
						element.values[0] = {name:''};
					}
					if(!element.values[1]){
						element.values[1] = {name:''};
					}
					element.values.forEach(data => {
						data.name = moment(data.name).toDate();
					});
				}
			});
		}
		this.possibleFields = this.fields.filter((field)=>{
			return this.exception.fields.every(item => item.name !== field.name);
		});
	}

	removeField(index) {
		if(this.exception.fields[index].id){
			this.exception.fields[index].delete = true;
		}else{
			this.exception.fields.splice(index,1);
		}
		this.possibleFields = this.fields.filter((field)=>{
			return this.exception.fields.every((item) => item.name !== field.name || item.delete);
		});
	}

	addField(newField) {
		if(!newField.input){
			if (this.exception.fields.every((field) => field.name !== newField.name)) {
				this.exception.fields.unshift(_.cloneDeep(newField));
				this.possibleFields = this.fields.filter((field)=>{
					return this.exception.fields.every(item => item.name !== field.name);
				});
			} else {
				const alreadyAddedField = this.exception.fields.find((field) => {
					return (field.name === newField.name);
				});
				alreadyAddedField.delete = false;
			}
			this.searchText = {};
		}
	}

	cancel(isDelete) {
		if(isDelete){
			this.config.content = 'Are you sure you want to delete this exception?';
			this.showConfirmation = true;
			this.dialogType = 'delete';
			return;
		}
		if(this.exceptionType === 'create'){
			this.config.content = 'Are you sure you want to cancel creating this exception?';
		} else {
			this.config.content = 'Are you sure you want to cancel your changes to this exception?';
		}
		this.showConfirmation = true;
		this.dialogType = 'cancel';
	}

	checkSave(form) {
		if(form.valid){
			if (this.exceptionType === 'new') {
				this.config.content = 'Are you sure you want to save this Exception?';
			} else {
				this.config.content = 'Are you sure you want to save your changes to this Exception?';
			}
			this.showConfirmation = true;
			this.dialogType = 'save';
		}
	}

	confirmation(confirm){
		if(confirm){
			if (this.dialogType === 'save') {
				this.editExceptionService.updateExceptions(this.exception, this.exceptionType).subscribe(([exception]) => {
					if(!this.exception.id){
						this.exception.id = exception.id;
					}
					this.dialogRef.close(this.exception);
				});
			} else if (this.dialogType === 'delete'){
				this.exception.delete = true;
				this.dialogRef.close(this.exception);
			} else {
				this.dialogRef.close();
			}
		} else {
			this.showConfirmation = false;
		}
	}

	setDate(fieldValue){
		if(fieldValue.id){
			delete fieldValue.id;
			delete fieldValue.fieldId;
		}
	}
}
