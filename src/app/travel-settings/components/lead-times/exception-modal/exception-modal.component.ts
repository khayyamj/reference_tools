import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LeadTimesService } from '../../../services';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
	selector: 'app-exception-modal',
	templateUrl: './exception-modal.component.html',
	styleUrls: ['./exception-modal.component.less']
})
export class ExceptionModalComponent implements OnInit {
	static EXCEPTION = {
		HOLIDAY: 'Holiday',
		WEEKDAY: 'Weekday',
		BLACKOUT: 'Blackout'
	};
	static TYPES = {
		WEEKDAY: 0,
		HOLIDAY: 1,
		BLACKOUT: 2
	};
	newException: {
		myDate: number,
		name: string,
		isException: boolean,
		type: string,
		typeId: number,
		isRed: boolean
	} = {myDate: null, name: '', isException: null, type: '', typeId: null, isRed: false};
	exceptions: any;
	exceptionsMaster: any;
	years: string[];
	year: string;
	dropdownOpen = false;
	addNew = false;
	isNewYear = false;
	error: {
		text: string,
		inSave: boolean,
		inName: boolean,
		inDate: boolean,
		inType: boolean
	} = {text: null, inSave: false, inName: false, inDate: false, inType: false};

	constructor(private dialogRef:MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private data:any,
				private leadTimesService: LeadTimesService) { }

	ngOnInit() {
		this.exceptions = _.cloneDeep(this.data);
		this.exceptionsMaster = this.data;
		this.years = Object.keys(this.exceptions);
		this.year = new Date().getFullYear().toString();
		this.newException.myDate = (new Date()).setFullYear(parseInt(this.year,10));
	}

	itemClick(year){
		this.year = year;
		this.dropdownOpen = false;
	}

	newItemClick(){
		const year = this.years[this.years.length-1];
		this.dropdownOpen = false;
		const newYear = (parseInt(year,10)+1).toString();
		this.exceptions[newYear] = {};
		this.exceptions[newYear].year = newYear;
		this.exceptions[newYear].exceptions = this.exceptions[this.year].exceptions.map( (exception) => {
			return{
				myDate: new Date(exception.myDate).setFullYear(parseInt(newYear,10)),
				name: exception.name,
				isException: exception.isException,
				type: exception.type,
				typeId: exception.typeId,
				isRed: false
			};
		});
		this.years.push(newYear);
		this.year = newYear;
		this.newException = {
			myDate: new Date().setFullYear(parseInt(this.year,10)),
			name: '',
			isException: null,
			type: '',
			typeId: null,
			isRed: false
		};
		this.isNewYear = true;
	}

	typeChange(exception, type){
		exception.type = type;
	}

	isAnException(exception){
		if (exception.type === ExceptionModalComponent.EXCEPTION.WEEKDAY){
			exception.isException = true;
			return true;
		}else{
			return false;
		}
	}

	remove(exceptions, index){
		exceptions.splice(index, 1);
	}

	cancelAdd(){
		this.addNew = false;
		this.error = {text: null, inSave: false, inName: false, inDate: false, inType: false};
		this.newException = {
			myDate: new Date().setFullYear(parseInt(this.year,10)),
			name: '',
			typeId: null,
			isException: null,
			type: '',
			isRed: false
		};
	}

	checkDate(date, exceptions){
		return exceptions.some((exception) => {
			const newDay = moment(date).dayOfYear();
			const compareDay = moment(exception.myDate).dayOfYear();
			return newDay === compareDay;
		});
	}

	add(exceptions) {
		this.error = {text: null, inSave: false, inName: false, inDate: false, inType: false};
		if (!this.newException.typeId) {
			this.error.inType = true;
			this.error.text = 'Please fill in all fields';
		}
		if (!this.newException.myDate) {
			this.error.inDate = true;
			this.error.text = 'Please fill in all fields';
		}
		if (!this.newException.name) {
			this.error.inName = true;
			this.error.text = 'Please fill in all fields';
		}
		if (this.checkDate(this.newException.myDate, exceptions)) {
			this.error.inDate = true;
			this.error.text = 'The selected date already has an exception. Please choose a date that is not a duplicate.';
		}
		if (moment(this.newException.myDate).year().toString() !== this.year) {
			this.error.inDate = true;
			this.error.text = 'The selected date is not in the current year. Please choose a date within the current year.';
		}
		if (this.error.text) {
			return;
		}

		const index = exceptions.findIndex((item) => {
			return item.myDate > this.newException.myDate;
		});
		if(index !== -1){
			exceptions.splice(index, 0, this.newException);
		} else {
			exceptions.push(this.newException);
		}
		this.cancelAdd();
	}

	isDisabled(){
		return this.addNew || this.exceptions[this.year].exceptions.some((exception) => {
			return exception.isRed;
		});
	}

	cancel() {
		this.exceptions = Object.assign({}, this.exceptionsMaster);
		this.years = Object.keys(this.exceptions);
		if (this.years.indexOf(this.year) === -1) {
			this.year = this.years[0];
		}
		this.close();
	}

	close() {
		this.dialogRef.close(this.exceptionsMaster);
	}

	save() {
		this.leadTimesService.updateExceptionsForYear(this.exceptions[this.year].year, this.exceptions[this.year].exceptions).subscribe(() => {
			this.exceptionsMaster[this.year] = Object.assign({}, this.exceptions[this.year]);
			this.close();
		});
	}

	selectDate(date, exception) {
		if(date.getFullYear().toString() === this.year){
			exception.isRed = false;
		} else {
			exception.isRed = true;
		}
		exception.myDate = date.getTime();
	}

}
