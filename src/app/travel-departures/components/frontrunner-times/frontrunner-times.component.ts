import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl} from '@angular/forms';
import { DepartureGroupService } from '../../services';
import * as moment from 'moment';


@Component({
	selector: 'travel-frontrunner-times',
	templateUrl: './frontrunner-times.component.html',
	styleUrls: ['./frontrunner-times.component.less'],
	providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: FrontrunnerTimesComponent }]
})

export class FrontrunnerTimesComponent implements ControlValueAccessor {

	private _date: any;
	@Input() set date(d) {
		this._date = moment(d).clone();
		this.setDepartureSchedules();
	}
	get date() {
		return this._date;
	}
	@Output() timeChange = new EventEmitter();

	@Output() departureScheduleChange: EventEmitter<any> = new EventEmitter();

	@Input() set control(formControl) {
		if(formControl){
			//to do add custom validator for blackout date
			this.childControl.setErrors(formControl.errors);
		}
	}


	@Input() time: any = null;
	childControl = new FormControl();
	departureSchedules: Array<any> = null;
	departureSchedule: any = null;
	_onChange: (value: any) => void;

	constructor(private departureGroupService: DepartureGroupService) { }

	setDepartureSchedules() {
		if (this.date != null && this.date.isValid()) {
			this.departureGroupService.getTrainTimesForDate(this.date).subscribe((periodResponse:any[]) => {
				this.departureSchedules = periodResponse.map((period) => {
					period.trainTime = moment(period.trainDate);
					period.trainTimeDisplay = period.trainTime.format('h:mm a');
					return period;
				});
				if (this.time != null && this.time !== '') {
					this.departureSchedule = this.departureSchedules.find((period) => {
						return (this.time.hours() === period.trainTime.hours() && this.time.minutes() === period.trainTime.minutes());
					});
					this.changeTime();
				}
			});
		}
	}

	changeTime() {
		if (this.departureSchedule) {
			this.date.millisecond(this.departureSchedule.trainTime.millisecond());
			this.date.second(this.departureSchedule.trainTime.second());
			this.date.minute(this.departureSchedule.trainTime.minute());
			this.date.hour(this.departureSchedule.trainTime.hour());
			this.departureSchedule.departureTime = this.date.clone().subtract(this.departureSchedule.departureMinutes, 'minutes');
			this.timeChange.emit(this.date);
			this.departureScheduleChange.emit(this.departureSchedule);
			if (this._onChange) {
				this._onChange(this.date);
			}
		}
	}

	writeValue(value: any) {
		this.time = value;
	}

	registerOnChange(fn: (value: any) => void) {
		this._onChange = fn;
	}

	registerOnTouched() { }

}
