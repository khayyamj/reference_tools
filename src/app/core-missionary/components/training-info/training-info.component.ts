import { Component, OnInit } from '@angular/core';
import { MissionaryService, MissionaryApiService } from '../../services';
import { RolesService, ToolsInfoService } from '../../../shared';
import { MtcDatePipe } from 'mtc-modules';
import * as _ from 'lodash';
@Component({
	selector: 'app-missionary-training-info',
	templateUrl: './training-info.component.html',
	styleUrls: ['./training-info.component.less']
})
export class TrainingInfoComponent implements OnInit {

	missionary: any;

	constructor(private missionaryService: MissionaryService,
				public rolesService: RolesService,
				public toolsInfoService: ToolsInfoService) { }

	ngOnInit() {
		this.missionaryService.selectedMissionary.subscribe((miss) => {
			this.missionary = miss;
		});
	}
}
