import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AssistanceService } from '../../services';
import { CheckboxTableColumn, CheckboxTableConfig, SimpleConfirmationComponent, MTCToastService } from 'mtc-modules';
import * as _ from 'lodash';

@Component({
	selector: 'app-manage-categories',
	templateUrl: './manage-categories.component.html',
	styleUrls: ['./manage-categories.component.less']
})
export class ManageCategoriesComponent implements OnInit {

	categories: any[];

	tableColumns: CheckboxTableColumn[] = [
		{ title: 'Category', attr: 'category', editFunction: true }
	];

	tableConfig: CheckboxTableConfig = {
		topButtons: [
			{ text: 'Delete', function: this.deleteCategories.bind(this) }
		]
	};

	constructor(public assistanceService: AssistanceService,
		public dialogRef: MatDialogRef<any>,
		public dialog: MatDialog,
		public toastService: MTCToastService) { }

	ngOnInit() {
		this.categories = _.cloneDeep(this.assistanceService.categories);
	}

	deleteCategories(categoriesToDelete) {
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				cancelButtonText: 'Cancel',
				confirmationButtonText: 'Yes',
				title: `Delete Categories`,
				content: `Are you sure you want to delete selected categories? All of its associated items will be deleted`
			},
			width: '500px'
		}).afterClosed().subscribe((response) => {
			if (response) {
				categoriesToDelete.forEach((category) => {
					this.categories.splice(this.categories.indexOf(category), 1);
					this.assistanceService.deleteAssistanceCategory(category).subscribe();
				});
				this.toastService.success(`${categoriesToDelete.length} categor${categoriesToDelete.length > 1 ? 'ies' : 'y'} <strong>successfully</strong> deleted.`);
			}
		});
	}

	addCategory(form) {
		if (form.valid) {
			this.assistanceService.createAssistanceCategory({ category: form.value.category }).subscribe((response: any) => {
				this.categories.unshift(response);
			});
		}
	}

	save() {
		this.dialogRef.close(this.categories);
	}
}
