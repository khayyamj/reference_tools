import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LeadTimesService } from '../../services';
import { SimpleConfirmationComponent, MTCToastService } from 'mtc-modules';
import { NewLeadTimeComponent } from './new-lead-time/';
import { Router } from '@angular/router';
import { ExceptionModalComponent } from './exception-modal/';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'travel-settings-lead-times',
	templateUrl: './lead-times.component.html',
	styleUrls: ['./lead-times.component.less']
})
export class LeadTimesComponent implements OnInit {
	public edit = false;
	public addNew = false;
	public scheduleType = 'regular';
	public currentPeriod:any = {};
	public currentYear;
	public newPeriod:any = {
		name: '',
		startDate: null
	};
	public departureSchedule:any = [];
	public periods:any = [];
	public yearlyExceptions:any = {};
	public currentYearExceptions:any = {};
	public exceptionList:any = [];
	public regularChange = false;
	public holidayChange = false;
	public showCalendar = false;
	public isRed = false;
	public hoverIndex = -1;

	constructor(private leadTimesService: LeadTimesService,
				private router: Router,
				private ref: ChangeDetectorRef,
				private dialog: MatDialog,
				private toastService: MTCToastService,
				private datePipe:DatePipe) {
		this.scheduleType = 'regular';
	}

	ngOnInit() {
		this.getAllPeriods();
		this.leadTimesService.getYearlyExceptions().subscribe((exceptions:any[]) => {
			exceptions.forEach((yearlyExceptionList) => {
				this.yearlyExceptions[yearlyExceptionList.year] = yearlyExceptionList;
			});
			this.currentYear = new Date().getFullYear();
			this.currentYearExceptions = this.yearlyExceptions[`${this.currentYear}`];
			this.changeRadio();
		});
	}

	getAllPeriods() {
		this.leadTimesService.getDeparturePeriods().subscribe((periods:any) => {
			this.periods = periods;
			this.ref.detectChanges();
			this.changeSelect(this.getCurrent(this.periods));
			this.cancel();
		});
	}

	getCurrent(periods){
		const d = new Date();
		for(let i = 0; i < periods.length; i++){
			if(new Date(periods[i].startDate) < d && (new Date(periods[i].endDate) > d || periods[i].endDate == null)){
				return periods[i];
			}
		}
		return periods[0];
	}

	setNewName(date){
		if(!this.isAfter3Weeks(date)){
			this.newPeriod.name = this.datePipe.transform(this.newPeriod.startDate,'d MMM yyyy') + (this.newPeriod.endDate ? ' - ' + this.datePipe.transform(this.newPeriod.endDate,'d MMM yyyy') : '');
		}else{
			this.toastService.error('<strong>Error!</strong> Start date must be at least 3 weeks in the future');
		}
	}

	isAfter3Weeks(date){
		if(moment(date).dayOfYear() > moment().dayOfYear() + 20 && moment(date).year() === moment().year() ||
			moment(date).dayOfYear() > moment().dayOfYear() - 352 && moment(date).year() > moment().year()){
			return false;
		}
		return true;
	}

	isEditable(period){
		return this.isCurrent(period) === 0 && !this.isAfter3Weeks(period.startDate);
	}

	previous(){
		this.currentYear -= 1;
		this.currentYearExceptions = this.yearlyExceptions[`${this.currentYear}`];
		this.changeRadio();
	}

	next(){
		this.currentYear += 1;
		this.currentYearExceptions = this.yearlyExceptions[`${this.currentYear}`];
		this.changeRadio();
	}

	display(a){
		if(!a){
			return '0:00';
		}
		const hours = Math.trunc(a/60);
		const minutes = a % 60;
		if(minutes === 0){
			return (hours +':00');
		}
		return (hours +':'+ minutes);
	}

	changeSelect(data){
		this.hoverIndex = -1;
		this.currentPeriod = data;
		this.changeRadio();
	}

	changeRadio(){
		this.hoverIndex = -1;
		this.departureSchedule = this.currentPeriod[this.scheduleType.toLowerCase()];
		this.exceptionList = this.filterExceptions(this.scheduleType);
		if(!this.edit && !this.addNew){
			this.plotGraph(this.edit);
		}else{
			this.plotGraph(true);
		}
	}

	filterExceptions(type){
		if (this.currentYearExceptions && this.currentYearExceptions.exceptions){
			return this.currentYearExceptions.exceptions.filter((exception)=>{
				if (type.toLowerCase() === ExceptionModalComponent.EXCEPTION.HOLIDAY.toLowerCase()){
					//show all of them EXCEPT weekdays, also display 'blackout' or 'exception' next to blackouts or exceptions.
					return exception.type.toLowerCase() !== ExceptionModalComponent.EXCEPTION.WEEKDAY.toLowerCase();
				}else{
					//show JUST weekdays. do not display if they are an exception or nah.
					return exception.type.toLowerCase() === ExceptionModalComponent.EXCEPTION.WEEKDAY.toLowerCase();
				}
			});
		}
		return [];
	}

	back() {
		this.cancel();
		this.router.navigate(['/travel/settings']);
	}

	onHolidayExceptionClick(){
		if (!this.edit && !this.addNew){
			return;
		}
		this.dialog.open(ExceptionModalComponent, {
			data:this.yearlyExceptions,
			width:'700px',
		});
	}

	addNewTravelTime(event:any){
		this.dialog.open(NewLeadTimeComponent, {
			width:'450px',
		}).afterClosed().subscribe((data) => {
			if(data){
			const arr = this.currentPeriod[data.scheduleType];
				if(arr.length > 0){
					const flightDate = new Date(arr[0].flightDate);
					flightDate.setHours(data.flightTime.hours());
					flightDate.setMinutes(data.flightTime.minutes());
					const travelDate = new Date(data.travelType === 'bus' ? arr[0].busDate : arr[0].trainDate);
					travelDate.setHours(data.travelTime.hours());
					travelDate.setMinutes(data.travelTime.minutes());
					let index = 0;
					for(let i = 0; i < arr.length; i++){
						if(arr[i].flightDate < flightDate){
							index = i+1;
						}
					}
					arr.splice(index,0,{
						maxMissionaries: data.maxMissionaries,
						busDate: data.travelType === 'bus' ? travelDate.getTime() : null,
						trainDate: data.travelType === 'train' ? travelDate.getTime() : null,
						flightDate: flightDate.getTime(),
						departureSchedulePeriodId: arr[0].departureSchedulePeriodId,
						departureScheduleId: arr.length,
						type: data.scheduleType === 'regular' ? 'regular' : 'holiday',
						maxChange: true,
						busChange: true,
						trainChange: true,
						flightChange: true
					});
				}else{
					const flightDate = new Date();
					flightDate.setHours(data.flightTime.hours());
					flightDate.setMinutes(data.flightTime.minutes());
					const travelDate = new Date();
					travelDate.setHours(data.travelTime.hours());
					travelDate.setMinutes(data.travelTime.minutes());
					arr.push({
						maxMissionaries: data.maxMissionaries,
						busDate: data.travelType === 'bus' ? travelDate.getTime() : null,
						trainDate: data.travelType === 'train' ? travelDate.getTime() : null,
						flightDate: flightDate.getTime(),
						departureSchedulePeriodId: this.currentPeriod.departureSchedulePeriodId,
						type: data.scheduleType === 'regular' ? 'regular' : 'holiday',
						maxChange: true,
						busChange: true,
						trainChange: true,
						flightChange: true
					});
				}
				this[data.scheduleType + 'Change'] = true;
				this.departureSchedule = arr;
				this.plotGraph(true);
			}
		});
		event.stopPropagation();
	}

	addNewFuture(){
		this.isRed = false;
		this.addNew = true;
		this.newPeriod = _.cloneDeep(this.currentPeriod);
		this.newPeriod.name = '';
		this.newPeriod.startDate = null;
		this.plotGraph(this.addNew);
	}

	canSave() {
		return (this.newPeriod.startDate && this.addNew && !this.isAfter3Weeks(this.newPeriod.startDate))
				|| (this.currentPeriod.startDate && this.edit && !this.isAfter3Weeks(this.currentPeriod.startDate));
	}

	save() {
		if(this.addNew){
			this.newPeriod.regular = this.currentPeriod.regular;
			this.newPeriod.holiday = this.currentPeriod.holiday;
			delete this.newPeriod.departureSchedulePeriodId;
			this.leadTimesService.createPeriod(this.newPeriod).subscribe((data) => {
				this.getAllPeriods();
			});
		}else{
			this.leadTimesService.updatePeriod(this.currentPeriod).subscribe((data) => {
				this.getAllPeriods();
			});
		}
	}

	isCurrent(period){
		const d = new Date();
		if(new Date(period.startDate) < d){
			if(new Date(period.endDate) > d){
				return 1;
			}else if(period.endDate == null){
				return 2;
			}
		}
		return 0;
	}

	cancelPopup(event){
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'remove',
			content: 'Are you sure you want to delete this future period?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data:config,
			width:'400px'
		}).afterClosed().subscribe((isClosing) => {
			if(isClosing){
				this.cancel();
			}
		});
		event.stopPropagation();
	}

	cancel() {
		if(this.edit || this.addNew){
			this.edit = false;
			this.addNew = false;
			this.regularChange = false;
			this.holidayChange = false;
			this.newPeriod = {
				name: '',
				startDate: null
			};
			this.plotGraph(this.edit);
		}
	}

	editMode(){
		this.edit = true;
		this.hoverIndex = -1;
		this.plotGraph(this.edit);
	}

	removeTime(index,event){
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'remove',
			content: 'Are you sure you want to delete this travel time?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data:config,
			width:'400px'
		}).afterClosed().subscribe((data) => {
			if(data){
				this.departureSchedule.splice(index,1);
				this[this.scheduleType + 'Change'] = true;
				this.plotGraph(true);
			}
		});
		event.stopPropagation();
	}

	delete(event){
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete this future period?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data:config,
			width:'400px'
		}).afterClosed().subscribe(() => {
			if(!this.addNew){
				this.leadTimesService.deletePeriod(this.currentPeriod.departureSchedulePeriodId).subscribe(() => {
					this.getAllPeriods();
				});
			}else{
				this.cancel();
			}
		});
		event.stopPropagation();
	}

	changeTime(time,event){
		const passInData = {
			scheduleType: this.scheduleType,
			travelType: time.busDate == null ? 'train' : 'bus',
			maxMissionaries: time.maxMissionaries,
			travelTime: time.busDate == null ? time.trainDate : time.busDate,
			flightTime: time.flightDate
		};
		this.dialog.open(NewLeadTimeComponent, {
			data:passInData,
			width:'450px'
		}).afterClosed().subscribe((data) => {
			if(data) {
				const flightDate = new Date(time.flightDate);
				flightDate.setHours(data.flightTime.hours());
				flightDate.setMinutes(data.flightTime.minutes());
				const travelDate = new Date(time.busDate == null ? time.trainDate : time.busDate);
				travelDate.setHours(data.travelTime.hours());
				travelDate.setMinutes(data.travelTime.minutes());
				const updatedTime = {
					maxMissionaries: data.maxMissionaries,
					busDate: data.travelType === 'bus' ? travelDate.getTime() : null,
					trainDate: data.travelType === 'train' ? travelDate.getTime() : null,
					flightDate: flightDate.getTime(),
					departureSchedulePeriodId: this.currentPeriod.departureSchedulePeriodId,
					type: data.scheduleType,
					maxChange: false,
					busChange: false,
					trainChange: false,
					flightChange: false
				};
				if(time.maxMissionaries !== updatedTime.maxMissionaries){
					updatedTime.maxChange = true;
					this[this.scheduleType + 'Change'] = true;
				}
				if(time.busDate !== updatedTime.busDate){
					updatedTime.busChange = true;
					this[this.scheduleType + 'Change'] = true;
				}
				if(time.trainDate !== updatedTime.trainDate){
					updatedTime.trainChange = true;
					this[this.scheduleType + 'Change'] = true;
				}
				if(time.flightDate !== updatedTime.flightDate){
					updatedTime.flightChange = true;
					this[this.scheduleType + 'Change'] = true;
				}
				let index = this.currentPeriod[data.scheduleType].indexOf(time);
				if(index === -1){
					index = 0;
					for(let i = 0; i < this.currentPeriod[data.scheduleType].length; i++){
						if(this.currentPeriod[data.scheduleType][i].flightDate < updatedTime.flightDate){
							index = i+1;
						}
					}
				}
				this.currentPeriod[data.scheduleType].splice(index,1,updatedTime);
				this.plotGraph(true);
			}
		});
		event.stopPropagation();
	}

	setValue(type){
		this.scheduleType = type;
		this.changeRadio();
	}

	getMax(sched){
		let max = 0;
		for(let i = 0; i < sched.length; i++){
			if(sched[i].maxMissionaries > max){
				max = sched[i].maxMissionaries;
			}
		}
		return max;
	}

	getColor(max,colorMax,editMode){
		if(editMode){
			if(max * .61 > colorMax){
				return 'rgba(239,84,88,.25)';
			}else if(max * .8 > colorMax){
				return 'rgba(255,198,0,1)';
			}else{
				return 'rgba(81,188,149,.25)';
			}
		}else{
			if(max * .61 > colorMax){
				return 'rgba(239,84,88,1)';
			}else if(max * .8 > colorMax){
				return 'rgba(255,198,0,1)';
			}else{
				return 'rgba(81,188,149,1)';
			}
		}
	}

	plotGraph(editMode:boolean) {
		if(!this.departureSchedule){
			return;
		}
		const trace = {
			x: [],
			y: [],
			marker:{
				color: []
			},
			type: 'bar',
			hoverinfo:'none'
		};
		const max = this.getMax(this.departureSchedule);
		for(let i = 0; i < this.departureSchedule.length; i++){
			trace.x.push(i);
			trace.y.push(this.departureSchedule[i].maxMissionaries);
			trace.marker.color.push(this.getColor(max,this.departureSchedule[i].maxMissionaries,editMode));
		}

		const data = [trace];
		const layout = {
			bargap: 0.6,
			width: 52 * this.departureSchedule.length,
			xaxis: {
				autorange: true,
				showgrid: false,
				zeroline: false,
				showline: true,
				autotick: true,
				ticks: '',
				linecolor: '#a6a6a6',
				showticklabels: false,
				fixedrange: true
			},
			yaxis: {
				autorange: true,
				showgrid: false,
				zeroline: false,
				showline: false,
				autotick: true,
				ticks: '',
				showticklabels: false,
				fixedrange: true
			},
			margin: {
				l: 0,
				r: 0,
				b: 1,
				t: 20,
				pad: 0
			},
			annotations: [],
			barmode: 'group'
		};

		if(!editMode){
			for(let i = 0; i < trace.x.length; i++){
				layout.annotations.push({
					x: trace.x[i],
					y: trace.y[i],
					xref: 'x',
					yref: 'y',
					showarrow: true,
					text: trace.y[i],
					ax: 0,
					ay: -9
				});
			}
		}

		Plotly.newPlot('departure_times', data, layout, {staticPlot: true});
	}
}
