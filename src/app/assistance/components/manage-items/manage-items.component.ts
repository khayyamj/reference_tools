import { Component, OnInit } from '@angular/core';
import { AssistanceService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { EditItemComponent } from './edit-item';
import { ManageCategoriesComponent } from '../manage-categories';
import { SimpleConfirmationComponent } from 'mtc-modules/src/app/dialog/simple-confirmation';
import * as _ from 'lodash';

@Component({
	selector: 'app-manage-items',
	templateUrl: './manage-items.component.html',
	styleUrls: ['./manage-items.component.less']
})
export class ManageItemsComponent implements OnInit {

	columns: CheckboxTableColumn[] = [
		{ title: 'Item', attr: 'name' },
		{ title: 'Category', attr: 'category' },
		{ title: 'Elder Default', attr: 'elderQuantity' },
		{ title: 'Sister Default', attr: 'sisterQuantity'}
	];
	config: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Add Item', function: this.upsertItem.bind(this), alwaysVisible: true },
			{ text: 'Delete', function: this.deleteItems.bind(this) }
		],
		rowButtons: [
			{ text: 'Edit', function: this.upsertItem.bind(this) }
		],
		placeholder: 'No items were found'
	};
	rows: any[] = [];
	loading = true;

	constructor(private assistanceService: AssistanceService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.loadAssistanceItems();
	}

	loadAssistanceItems() {
		this.loading = true;
		this.assistanceService.getAssistanceCategories();
		this.assistanceService.getAssistanceItems().subscribe((items: any) => {
			this.loading = false;
			this.rows = items;
		});
	}

	upsertItem(item){
		this.dialog.open(EditItemComponent, {
			height: '300px',
			width: '400px',
			data: item
		}).afterClosed().subscribe((newItem) => {
			if(newItem){
				this.assistanceService.upsertItem(newItem,_.isEmpty(item)).subscribe((i) => {
					const index = this.rows.indexOf(item);
					if(index === -1){
						this.rows.unshift(i);
					}else{
						this.rows.splice(index,1,i);
					}
				});
			}
		});
	}

	deleteItems(items){
		const titleText = items.length === 1 ? 'Item' : 'Items';
		const itemText = items.length === 1 ? 'this item' : 'these items';
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				cancelButtonText: 'Cancel',
				confirmationButtonText: 'Yes',
				title:`Delete ${titleText}`,
				content: `Are you sure you want to delete ${itemText}?`
			},
			width: '500px',
			height: '175px'
		}).afterClosed().subscribe((response) => {
			if(response){
				this.rows = this.rows.filter(r => !r.selected);
				this.assistanceService.deleteItems(items);
			}
		});
	}

	openManageCategoriesDialog() {
		this.dialog.open(ManageCategoriesComponent, {
			width: '450px'
		}).afterClosed().subscribe((categories) => {
			if (categories) {
				let categoriesUpdated = 0;
				let refresh = true;
				categories.forEach((category, index) => {
					if (category.categoryId && !this.assistanceService.categories.find((serviceCategory => serviceCategory.category === category.category))) {
						refresh = false;
						categoriesUpdated++;
						this.assistanceService.updateAssistanceCategory(category).subscribe(() => {
							categoriesUpdated--;
							if (categoriesUpdated === 0) {
								this.loadAssistanceItems();
							}
						});
					}
				});
				if (refresh) {
					this.loadAssistanceItems();
				}
			}
		});
	}

}
