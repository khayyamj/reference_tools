import { Component, Input, OnInit } from '@angular/core';
import { NewMissionarySchedulingService } from '../../../services';
import { CheckboxTableColumn } from 'mtc-modules';
@Component({
	selector: 'scheduling-senior-missionary-component',
	templateUrl: './senior-missionary.component.html',
	styleUrls: ['./senior-missionary.component.less']
})
export class SeniorMissionaryComponent implements OnInit {
	@Input() set date(value){
		this.loading = true;
		this.newMissionarySchedulingService.getCurriculumSeniorMissionaries(value).subscribe((curriculums) => {
			this.curriculums = curriculums;
			this.setTotals();
			this.loading = false;
		});
	}
	selectedTab = 'Senior Incoming List';
	curriculums: any = [];
	loading = false;
	visited = false;
	columns: CheckboxTableColumn[] = [
		{ title: 'CURRIC.', attr:'curriculum',  width:65},
		{ title: 'TOTAL', attr:'total' },
		{ title: 'C.ELDER', attr:'elders' },
		{ title: 'C.SISTER', attr:'sisters' },
		{ title: 'S.SISTER', attr:'seniorSisters' },
	];

	ngOnInit() {
		this.newMissionarySchedulingService.showGroupDate = false;
	}

	constructor(private newMissionarySchedulingService: NewMissionarySchedulingService) { }

	setTotals(){
		let coupleElderSum = 0;
		let coupleSisterSum = 0;
		let seniorSisterSum = 0;
		let totalSum = 0;

		this.curriculums.forEach((curriculum) => {
			if (curriculum.elders != null) {
				coupleElderSum += Number(curriculum.elders);
			}
			if (curriculum.sisters != null) {
				coupleSisterSum += Number(curriculum.sisters);
			}
			if (curriculum.seniorSisters != null) {
				seniorSisterSum += Number(curriculum.seniorSisters);
			}
			if (curriculum.total != null) {
				totalSum += Number(curriculum.total);
			}
		});

		this.curriculums.totals = ({
			curriculum: 'TOTAL',
			elders: coupleElderSum,
			sisters: coupleSisterSum,
			seniorSisters: seniorSisterSum,
			total: totalSum
		});
	}

	setSelectedTab(selectedTab){
		this.selectedTab = selectedTab;
		this.newMissionarySchedulingService.showGroupDate = selectedTab !== 'Senior Incoming List';
		this.visited = true;
	}
}
