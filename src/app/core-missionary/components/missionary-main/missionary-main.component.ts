import { Component, OnInit, HostBinding } from '@angular/core';
import { MissionaryService } from '../../services';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';

@Component({
	selector: 'app-missionary-main',
	templateUrl: './missionary-main.component.html',
	styleUrls: ['./missionary-main.component.less']
})
export class MissionaryMainComponent implements OnInit {

	missionaries:any;

	//This will apply flex="" to the <app-missionary-main> tag
	@HostBinding('attr.flex') flex = '';

	currentMissionary;
	constructor(public missionaryService: MissionaryService,
				private route: ActivatedRoute,
				private router: Router) {
					this.route.queryParams.map((params) => {
						return params['missionaryId'] || '';
					}).subscribe((missionaryId) => {
						setTimeout(() => this.missionaryService.setSelectedMissionary(missionaryId));
					});

					this.router.events.subscribe((val) => {
						if(val instanceof NavigationEnd){
							if(this.router.url === '/missionary'){
								this.goToCorrectRoute();
							}
						}
					});
				}

	ngOnInit() {
		this.missionaryService.missionaries.subscribe((missionaries) => {
			this.missionaries = missionaries;
		});

		this.missionaryService.selectedMissionary.subscribe((missionary) => {
			this.currentMissionary = missionary;
			this.goToCorrectRoute();
		});
	}

	goToCorrectRoute(){
		if(_.isEmpty(this.currentMissionary) && !this.missionaryService.loadingCount){
			this.router.navigate(['/missionary/search-history']);
		}else if(this.router.url === '/missionary/search-history'){
			this.router.navigate(['/missionary']);
		}
	}

}
