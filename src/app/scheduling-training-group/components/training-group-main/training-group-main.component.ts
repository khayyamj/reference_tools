import { Component, OnInit, HostBinding } from '@angular/core';
import { TrainingGroupService } from '../../services';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-training-group-main',
	templateUrl: './training-group-main.component.html',
	styleUrls: ['./training-group-main.component.less']
})
export class TrainingGroupMainComponent implements OnInit {

	trainingGroups:any;
	currentGroup;

	@HostBinding('attr.flex') flex = '';

	constructor(public trainingGroupService: TrainingGroupService,
				private router: Router,
				private route: ActivatedRoute) {
					this.route.queryParams
						.map((params) => {
							return params['training_group_id'] || '';
						}).subscribe((trainingGroupId) => {
							this.currentGroup={id:trainingGroupId};
							this.trainingGroupService.addTrainingGroup(trainingGroupId,true);
							if(!trainingGroupId){
								this.openSearchPage();
							}
						});
				}
	ngOnInit() {
		this.trainingGroupService.trainingGroups.subscribe((groups) => {
			this.trainingGroups = groups;
		});
	}

	onTabClicked(event) {
		if(event.id !== 'search' && event.id ){
			this.router.navigate(['/scheduling/training-groups/search/view'], { queryParams: { 'training_group_id': event.id } });
		}
	}

	openSearchPage(){
		this.router.navigate(['scheduling/training-groups/search']);
	}

}
