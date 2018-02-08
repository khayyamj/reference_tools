import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MissionaryService } from '../../services';
import { AssistanceService } from '../../../assistance';
import { RolesService } from '../../../shared';
import { SimpleConfirmationComponent, MTCToastService, CheckboxTableColumn, CheckboxTableConfig, MTCUser, MtcTimePipe, MtcDatePipe } from 'mtc-modules';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-assistance',
	templateUrl: './assistance.component.html',
	styleUrls: ['./assistance.component.less']
})
export class AssistanceComponent implements OnInit {
	user: any;
	print;
	loanedItems = [];
	donatedItems = [];
	inventory = [];
	missionary: any;
	printMissionaries =[];
	showPickup = false;
	itemTypes = ['donated', 'loaned'];
	selectedTab = 'donated';
	selectedItem = {};
	items;

	donatedColumns: CheckboxTableColumn[] = [
		{ title: 'CATEGORY', attr: 'category' },
		{ title: 'ITEM', attr: 'name' },
		{ title: 'MISS. REQ.', attr: 'quantityRequired', type: 'number' },
		{ title: 'BROUGHT', attr: 'quantityBroughtByMiss', type: 'number', editFunction: this.saveBrought.bind(this)  },
		{ title: 'DONATED', attr: 'quantity', type: 'number', editFunction: this.saveDonated.bind(this)  },
		{ title: 'STATUS', attr: 'status' }
	];
	loanedColumns: CheckboxTableColumn[] = [
		{ title: 'CATEGORY', attr: 'category' },
		{ title: 'ITEM', attr: 'name' },
		{ title: 'QUANTITY', attr: 'quantity', type: 'number', editFunction: this.saveLoanedEdits.bind(this) },
		{ title: 'STATUS', attr: 'status' },
	];

	donatedItemsTableConfig: CheckboxTableConfig = {
		topButtons: [{text: 'Delete', function: this.removeSelected.bind(this)}],
		rowButtons: [
			{ text: 'Needs Pickup', function: this.pickupItem.bind(this) },
			{ text: 'Unaccepted', function: this.unacceptItem.bind(this) },
			{ text: 'Accepted', function: this.acceptItem.bind(this) }
		],
		buttonColumnWidth: 12,
		placeholder: 'No items found for this missionary'
	};

	loanedItemsTableConfig: CheckboxTableConfig = {
		topButtons: [{text: 'Delete', function: this.removeSelected.bind(this)}],
		rowButtons: [
			{ text: 'Return', function: this.returnItem.bind(this) },
			{ text: 'Unreturn', function: this.unreturnItem.bind(this) }
		],
		buttonColumnWidth: 12,
		placeholder: 'No items found for this missionary'
	};

	constructor(private userService: MTCUser,
		private dialog: MatDialog,
		public missionaryService: MissionaryService,
		public assistanceService: AssistanceService,
		public mtcDatePipe: MtcDatePipe,
		public mtcTimePipe: MtcTimePipe,
		public rolesService: RolesService,
		private toastService: MTCToastService) { }

	ngOnInit() {
		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});
		this.assistanceService.getAssistanceItems().subscribe((data) => {
			this.items = data;
		});
		this.missionaryService.selectedMissionary.subscribe((missionary) => {
			if (!_.isEmpty(missionary)) {
				this.missionary = missionary;
				this.getLoanedItems();
				this.getInventory();
			}
		});
	}

	getLoanedItems() {
		this.assistanceService.getLoanedItems(this.missionary.missionaryId).subscribe((data: any[]) => {
			//TODO: use data as is when prop names are changed in AsstItem on the backend
			data.forEach((item) => {
				this.setStatus(item);
			});
			this.loanedItems = data;
		});
	}

	getInventory() {
		this.assistanceService.getMissionaryInventory(this.missionary.missionaryId).subscribe((data:any) => {
			this.donatedItems = data;
			if (this.donatedItems.some((item) => item.needsPickup > 0)) {
				this.showPickup = true;
			}
		});
	}

	returnItem(selectedItem) {
		selectedItem.returned = 1;
		this.assistanceService.saveLoanedItems(selectedItem);
	}

	unreturnItem(selectedItem) {
		selectedItem.returned = 0;
		this.assistanceService.saveLoanedItems(selectedItem);
	}

	pickupItem(selectedItem) {
		selectedItem.missionaryId = this.missionary.missionaryId;
		selectedItem.needsPickup = 1;
		selectedItem.notAccepted = 0;
		selectedItem.status = 'Needs Pick Up';
		this.showPickup = true;
		this.assistanceService.saveDonatedItems(selectedItem);
	}

	unacceptItem(selectedItem) {
		selectedItem.missionaryId = this.missionary.missionaryId;
		selectedItem.needsPickup = 0;
		selectedItem.notAccepted = 1;
		selectedItem.status = 'Not Accepted';
		this.showPickup = this.donatedItems.some((item) => item.needsPickup > 0) ? true : false;
		this.assistanceService.saveDonatedItems(selectedItem);
	}

	acceptItem(selectedItem) {
		selectedItem.missionaryId = this.missionary.missionaryId;
		selectedItem.needsPickup = 0;
		selectedItem.notAccepted = 0;
		selectedItem.status = 'Accepted';
		this.showPickup = this.donatedItems.some((item) => item.needsPickup > 0) ? true : false;
		this.assistanceService.saveDonatedItems(selectedItem);
	}

	saveBrought(newValue, row) {
		const rowClone = _.cloneDeep(row);
		rowClone.missionaryId = this.missionary.missionaryId;
		rowClone.quantity = newValue;
		this.assistanceService.saveBroughtItems(rowClone);
	}

	saveDonated(newValue, row) {
		row.missionaryId = this.missionary.missionaryId;
		this.assistanceService.saveDonatedItems(row);
	}

	saveLoanedEdits(newValue,selectedItem) {
		this.assistanceService.saveLoanedItems(selectedItem);
	}

	removeSelected() { }

	addItem(selectedItem) {
		selectedItem.missionaryId = this.missionary.missionaryId;
		this.assistanceService.createLoanedItem(selectedItem);
		this.setStatus(selectedItem);
		this.loanedItems.push(selectedItem);
		this.selectedItem = {};

	}

	setStatus(item){
		Object.defineProperty(item, 'status', { get: () => item.returned > 0 ? 'Returned' : 'Not Returned' });
	}

	printEvaluation(){
		this.printMissionaries.push(this.missionary);
		this.print = true;
		function afterPrintHandle () {
			this.print = false;
			this.printMissionaries = [];
			window.removeEventListener('afterprint',afterPrintHandle.bind(this));
		}
		window.addEventListener('afterprint', afterPrintHandle.bind(this));
	}
	printPickupForm() { }
}
