import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelGroupService } from '../../services';
import * as _ from 'lodash';

@Component({
	selector: 'travel-itinerary-view',
	templateUrl: './itinerary-view.component.html',
	styleUrls: ['./itinerary-view.component.less']
})
export class ItineraryViewComponent implements OnInit {
	itineraryInfoClone: any;
	itineraryInfo: any;
	loading = false;

	constructor(private travelGroupService: TravelGroupService,
				private route: ActivatedRoute,
				private router: Router) {}

	ngOnInit() {
		this.loading = true;
		this.route.params.subscribe((params) => {
			const itineraryId = params['itineraryId'];
			this.travelGroupService.getTravelGroupById(itineraryId).subscribe((itinerary:any) => {
				this.itineraryInfo = itinerary;
				this.itineraryInfo.missionAbbreviation = params['missionAbbreviation'];
			this.itineraryInfoClone = _.cloneDeep(this.itineraryInfo);
				this.loading = false;
			});
		});
	}

	back() {
		this.router.navigate(['../../../'],{relativeTo: this.route});
	}
}
