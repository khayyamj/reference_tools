import { Component, OnInit, Input } from '@angular/core';
import { AssistanceService } from '../../services';
import * as _ from 'lodash';

@Component({
	selector: 'app-print-assistance-page',
	templateUrl: './print-evaluation.component.html',
	styleUrls: ['./print-evaluation.component.less']
})
export class PrintEvaluationComponent implements OnInit {
	@Input() missionaries = [];
	printMissionaries = [];
	leftColumn = [];
	rightColumn = [];
	tableHeaderRow = [
		{ col: 'Item', width: 150 },
		{ col: 'Req', width: 50 },
		{ col: 'Brt', width: 50 },
		{ col: 'Nds', width: 50 },
		{ col: 'Rec', width: 50 },
		{ col: 'Comments:', width: 150 }
	];

	constructor(private assistanceService: AssistanceService) { }

	ngOnInit() {
		this.missionaries.forEach((missionary)=>{
			this.assistanceService.loading++;
			this.assistanceService.getMissionary(missionary.missionaryId).subscribe((fullMissionary:any) => {
				fullMissionary.photo = this.assistanceService.getMissionaryPicture(missionary.missionaryId);
				this.getMissionaryInventory(fullMissionary);
			});
		});
	}

	getMissionaryInventory(fullMissionary) {
		fullMissionary.missionaryItems = [];
		this.assistanceService.getMissionaryData(fullMissionary.missionaryId).subscribe((inventory: any[]) => {
			//TODO this method for creating missionaryItems object should be moved to the backend
			inventory.forEach(oneItem => {
				const index = _.findIndex(fullMissionary.missionaryItems, { category: oneItem.category });
				if (index === -1) {
					fullMissionary.missionaryItems.push({category: oneItem.category, items: [{item: oneItem.name, req: oneItem.qtyRequired}]});
				} else {
					fullMissionary.missionaryItems[index].items.push({ item: oneItem.name, req: oneItem.qtyRequired });
				}
			});
			this.sortCategories(fullMissionary);
			this.assistanceService.loading--;
			this.printMissionaries.push(fullMissionary);
			if(this.missionaries.length === this.printMissionaries.length){
				setTimeout(()=>window.print());
			}
		});
	}

	sortCategories(fullMissionary) {
		const leftCategories = ['Clothing', 'Winter Items', 'Additional Items'];
		const rightCategories = ['Miscellaneous', 'Toiletries', 'Luggages'];
		const allCategories = _.sortBy(fullMissionary.missionaryItems, 'category');
		this.leftColumn = allCategories.filter((cat:any, i) => {
			if (leftCategories.indexOf(cat.category) > -1) { return true; }
			if (rightCategories.indexOf(cat.category) === -1 && i % 2 === 0) { return true; }
		});
		this.rightColumn = allCategories.filter((cat:any, i) => {
			if (rightCategories.indexOf(cat.category) > -1) { return true; }
			if (leftCategories.indexOf(cat.category) === -1 && i % 2 !== 0) { return true; }
		});

		//TODO remove this pseudo-sort function once the data comes formatted
		//	Left column order: Clothing, Winter Items, Additional Items
		if (this.leftColumn) {
			leftCategories.forEach((cat, i) => {
				if (_.findIndex(this.leftColumn, { category: cat }) !== i && _.findIndex(this.leftColumn, { category: cat }) !== -1) {
					const index = _.findIndex(this.leftColumn, { category: cat });
					this.leftColumn.splice(i, 0, this.leftColumn[index]);
					this.leftColumn.splice(index + 1, 1);
				}
			});
		}

		// Right column order Miscellaneous, Toiletries, Luggages
		if (this.rightColumn) {
			rightCategories.forEach((cat, i) => {
				if (_.findIndex(this.rightColumn, { category: cat }) !== i && _.findIndex(this.rightColumn, { category: cat }) !== -1) {
					const index = _.findIndex(this.rightColumn, { category: cat });
					this.rightColumn.splice(i, 0, this.rightColumn[index]);
					this.rightColumn.splice(index + 1, 1);
				}
			});
		}
	}
}
