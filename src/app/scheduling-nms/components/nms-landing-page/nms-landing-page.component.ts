import { Component, OnInit } from '@angular/core';
import { NewMissionarySchedulingService,} from '../../services';
import { ActivatedRoute } from '@angular/router';
import { CheckboxTableColumn, MtcDatePipe } from 'mtc-modules';
import { ConfigService } from '../../../shared';
import * as moment from 'moment';
@Component({
	selector: 'scheduling-nms-landing-page',
	templateUrl: './nms-landing-page.component.html',
	styleUrls: ['./nms-landing-page.component.less']
})
export class NewMissionarySchedulingLandingPageComponent implements OnInit {
	scheduleDate;
	incomingMissionaries:any = [];
	exceptionMissionaries:any = [];
	type='';
	title;
	isLanguageLoading = false;
	isExceptionLoading = false;
	languageColumns: CheckboxTableColumn[] = [
		{ title: 'LANGUAGE', attr: 'language' },
		{ title: 'ELDERS', attr: 'elders' },
		{ title: 'SISTERS', attr: 'sisters' },
		{ title: 'TOTAL', attr: 'total' }
	];
	exceptionColumns: CheckboxTableColumn[] = [
		{ title: 'EXCEPTION', attr: 'language' },
		{ title: 'ELDERS', attr: 'elders' },
		{ title: 'SISTERS', attr: 'sisters' },
		{ title: 'TOTAL', attr: 'total' }
	];

	constructor(public newMissionarySchedulingService: NewMissionarySchedulingService,
				private route: ActivatedRoute,
				public mtcDate: MtcDatePipe,
				private configService:ConfigService) { }
	ngOnInit() {
		this.configService.loaded.subscribe(()=>{
			this.route.params.subscribe((params) => {
				this.type=params['type'];
				this.newMissionarySchedulingService.getScheduleDate(this.type,
				this.configService.getConfig('New Missionary Scheduling', this.type[0].toUpperCase() + this.type.slice(1) + ' Group Date').value || moment());
				if(this.type === 'Young') {
					this.isLanguageLoading = true;
					this.isExceptionLoading = true;
					this.newMissionarySchedulingService.showGroupDate = true;
					this.title = 'young adult missionaries';
					this.getData();
				} else {
					this.title = 'senior missionaries';
					this.newMissionarySchedulingService.showGroupDate = false;
				}
			});
		});
	}

	getData() {
		this.isExceptionLoading = this.isLanguageLoading = true;
		this.newMissionarySchedulingService.getIncomingMissionaries().subscribe((incoming) => {
			this.incomingMissionaries = incoming;
			this.getSums(this.incomingMissionaries);
			this.isLanguageLoading = false;
		});

		this.newMissionarySchedulingService.getExceptionMissionaries().subscribe((exceptions) => {
			this.exceptionMissionaries = exceptions;
			this.getSums(this.exceptionMissionaries);
			this.isExceptionLoading = false;
		});
	}

	getSums(missionaries){
		let elderSum=0;
		let sisterSum=0;
		let totalSum=0;

		missionaries.forEach((missionaryGroup) => {
			if(missionaryGroup.elders != null){
				elderSum += Number(missionaryGroup.elders);
			}

			if(missionaryGroup.sisters != null){
				sisterSum += Number(missionaryGroup.sisters);
			}

			if(missionaryGroup.total != null){
				totalSum += Number(missionaryGroup.total);
			}
		});

		missionaries.totals = {
			language: 'TOTAL',
			elders: elderSum,
			sisters: sisterSum,
			total: totalSum
		};
	}

	changeDate(date) {
		this.newMissionarySchedulingService.groupDate = date;
		this.configService.setConfig('New Missionary Scheduling',this.type[0].toUpperCase() + this.type.slice(1) + ' Group Date',this.newMissionarySchedulingService.formattedGroupDate).subscribe();
		this.getData();
	}
}
