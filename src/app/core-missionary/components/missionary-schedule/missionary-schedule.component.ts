import { Component, Input } from '@angular/core';
import { MissionaryApiService } from '../../services';
import * as moment from 'moment';

@Component({
	selector: 'app-missionary-schedule',
	templateUrl: './missionary-schedule.component.html',
	styleUrls: ['./missionary-schedule.component.less']
})
export class MissionaryScheduleComponent {
	schedules;
	currentDate = moment();
	@Input() set missionary(missionary){
		this.missionaryId = missionary.missionaryId;
		this.arrival = moment(missionary.mtcInfo.mtcActualArrival);
		this.departure = moment(missionary.mtcInfo.mtcDeparture);
		this.getSchedule();
	}
	departure;
	arrival;
	missionaryId;
	constructor(private missionaryAPIService: MissionaryApiService) {}

	getSchedule() {
		this.missionaryAPIService.getMissionarySchedule(this.missionaryId ,this.currentDate.toDate()).subscribe((schedule) => {
			this.schedules = schedule;
		});
	}

}
