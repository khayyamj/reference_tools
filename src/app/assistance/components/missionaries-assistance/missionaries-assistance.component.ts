import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssistanceService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { ConfigService } from '../../../shared';
import { MissionaryService } from '../../../core-missionary/services';

@Component({
	selector: 'app-missionaries-assistance',
	templateUrl: './missionaries-assistance.component.html',
	styleUrls: ['./missionaries-assistance.component.less']
})

export class MissionariesAssistanceComponent implements OnInit {
	missionaries = [];
	printMissionaries = [];
	searchText = '';
	filters = {};
	print;
	columns: CheckboxTableColumn[] = [
		{ title: 'ID', attr: 'missionaryId' },
		{ title: 'Type', attr: 'type' },
		{ title: 'Missionary', attr: 'fullName' },
		{ title: 'Status', attr: 'status'},
		{ title: 'Mission', attr: 'mission'},
		{ title: 'Special Category', attr: 'category'},
		{ title: 'Funding Unit Country', attr: 'fundCountry'},
		{ title: 'Scheduled Arrival Date', attr: 'scheduledArrival', mtcDate: true},
		{ title: 'Scheduled Departure Date', attr: 'scheduledDeparture', mtcDate: true}
	];

	config: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Print Evaluations', function: this.printEvaluations.bind(this) },
			{ text: 'Open All', function: this.openAll.bind(this) }
		],
		placeholder: 'No unequalized missionaries'
	};

	rows: any[] = [];
	filterAttributes:any = [
		{display:'Pre-MTC', filter:'preMTC', status:'Pre-MTC'},
		{display:'Scheduled', filter:'scheduled', status:'Scheduled'},
		{display:'In Residence',filter:'residence', status:'In-Residence'},
		{display:'Departed', filter:'departed', status:'In Field'}
	];
	constructor(public assistanceService: AssistanceService, private configService: ConfigService,
				private router: Router, private missionaryService: MissionaryService) { }

	ngOnInit() {
		this.assistanceService.loading++;
		this.configService.loaded.subscribe(()=>{
			this.assistanceService.getProjectionMissionaries().subscribe((missionaries:any) => {
				this.missionaries = missionaries.filter((missionary)=> missionary.status !== 'Canceled');
				this.filterRows();
				this.assistanceService.loading--;
			});
			this.filterAttributes.forEach((filterNames)=>{
				this.filters[filterNames.filter]= +this.configService.getConfig('Missionary Assistance',filterNames.filter).value;
			});
		});
	}
	filterRows(changeFilterName:any=false) {
		if(changeFilterName) {
			this.configService.setConfig('Missionary Assistance', changeFilterName, +this.filters[changeFilterName]).subscribe();
		}
		this.rows = this.missionaries.filter((missionary:any)=>{
			return this.filters[this.filterAttributes.find((filterNames)=>filterNames.status === missionary.status).filter]
			&& (missionary.missionaryId.includes(this.searchText) || (missionary.fullName && missionary.fullName.toLowerCase().includes(this.searchText.toLowerCase())));
		});
	}

	checkAll(toggle) {
		this.filterAttributes.forEach((filterNames) => this.filters[filterNames.filter] = toggle);
		this.filterRows();
	}

	openAll(selectedMissionaries){
		selectedMissionaries.forEach((missionary, index)=>{
			if(index) {
				setTimeout(() => this.missionaryService.setSelectedMissionary(missionary.missionaryId));
			}
		});
		this.router.navigate(['/missionary/assistance'], {queryParams:{missionaryId: selectedMissionaries[0].missionaryId}});
	}

	printEvaluations(selectedMissionaries){
		this.printMissionaries = selectedMissionaries;
		this.print = true;
		function afterPrintHandle () {
			this.print = false;
			this.printMissionaries = [];
			window.removeEventListener('afterprint',afterPrintHandle.bind(this));
		}
		window.addEventListener('afterprint', afterPrintHandle.bind(this));
	}
}
