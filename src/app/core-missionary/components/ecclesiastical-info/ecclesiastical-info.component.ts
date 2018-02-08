import { Component, OnInit } from '@angular/core';
import { MissionaryService } from '../../services';
import { RolesService } from '../../../shared';


@Component({
	selector: 'app-missionary-ecclesiastical-info',
	templateUrl: './ecclesiastical-info.component.html',
	styleUrls: ['./ecclesiastical-info.component.less']
})
export class EcclesiasticalInfoComponent implements OnInit {

	missionary:any;
	viewType = 'mtc';
	sameLabel = '';
	tabs=['MTC Ecclesiastical','Home Ecclesiastical','Submitting Ecclesiastical','Funding Ecclesiastical'];

	label = {
		home: {
			HFS: 'This information is the same as Submitting Unit and Funding Unit',
			HF: 'This information is the same as Funding Unit',
			HS: 'This information is the same as Submitting Uni'
		},
		funding: {
			HFS: 'This information is the same as Home Unit and Submitting Unit',
			HF: 'This information is the same as Home Unit',
			FS: 'This information is the same as Submitting Unit'
		},
		submitting: {
			HFS: 'This information is the same as Home Unit and Funding Unit',
			FS: 'This information is the same as Funding Unit',
			HS: 'This information is the same as Home Unit'
		},
		mtc:{}
	};

	constructor(public missionaryService: MissionaryService,
				public rolesService:RolesService) {
		this.missionaryService.selectedMissionary.subscribe((miss) => {
			this.missionary = miss;
		});
	}

	ngOnInit() {

	}

	setSameLabel(type){
		switch(type){
			case 'MTC Ecclesiastical':
				this.viewType = 'mtc';
				break;
			case 'Home Ecclesiastical':
				this.viewType = 'home';
				break;
			case 'Submitting Ecclesiastical':
				this.viewType = 'submitting';
				break;
			case 'Funding Ecclesiastical':
				this.viewType = 'funding';
				break;
			default:
				this.viewType = type;
		}
		const homeUnit = this.missionary.unitInfoList.find((unit) => {
			return unit.type === 'home';
		});
		const fundingUnit = this.missionary.unitInfoList.find((unit) => {
			return unit.type === 'funding';
		});
		const submittingUnit = this.missionary.unitInfoList.find((unit) => {
			return unit.type === 'submitting';
		});

		const idCheck = this.checkUnitIds(homeUnit, fundingUnit, submittingUnit);
		this.sameLabel = this.label[this.viewType][idCheck] || '';
	}

	checkUnitIds(homeUnit: any = {}, fundingUnit: any = {}, submittingUnit: any = {}){
		let combination = '';

		if(homeUnit.unitId === fundingUnit.unitId || homeUnit.unitId === submittingUnit.unitId){
			combination += 'H';
		}
		if(fundingUnit.unitId === homeUnit.unitId || fundingUnit.unitId === submittingUnit.unitId){
			combination += 'F';
		}
		if(submittingUnit.unitId === homeUnit.unitId || submittingUnit.unitId === fundingUnit.unitId){
			combination += 'S';
		}
		return combination;
	}

}
