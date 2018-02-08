import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MtcDatePipe } from 'mtc-modules';
import * as moment from 'moment';

@Component({
	selector: 'travel-departure-print',
	templateUrl: './departure-print.component.html',
	styleUrls: ['./departure-print.component.less']
})
export class DeparturePrintComponent implements OnInit {
	option:string;
	sunday: any;
	printDay: any = '';
	days: any = [];
	weekDays = ['Sunday, ', 'Monday, ', 'Tuesday, ', 'Wednesday, ', 'Thursday, ', 'Friday, ', 'Saturday, '];
	weekPrintDate: number;
	dayPrintDate: number;

	constructor(private dialogRef:MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private data:any,
				private mtcDate: MtcDatePipe) { }

	ngOnInit(){
		const info = this.data;
		if (info) {
			this.sunday = info.sunday;
		}else{
			this.sunday = moment().startOf('week').clone();
		}
		this.createWeek();
		this.option = 'week';
	}

	createWeek(){
		let temp = this.sunday.clone();
		for(let i = 0; i < 7; i++){
			temp = temp.clone().day(i);
			this.days.push({date:new Date(temp), name: this.weekDays[i] + this.mtcDate.transform(temp)});
		}
	}

	getViewDateSunday() {
		return this.mtcDate.transform(this.sunday);
	}

	getViewDateSaturday() {
		return this.mtcDate.transform(this.sunday.clone().day(6));
	}

	print(form) {
		if(form.valid) {
			let printDays = [];
			if(this.option === 'week'){
				printDays = this.days;
			}else{
				printDays.push(this.printDay);
			}
			printDays = printDays.map((day) => day.date);
			this.dialogRef.close(printDays);
		}
	}
}
