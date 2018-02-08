import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomSearchService } from '../../../services';
import { SimpleConfirmationComponent } from 'mtc-modules';
import { MatDialog } from '@angular/material';
import { CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';

@Component({
	selector: 'app-missionary-custom-search-list',
	templateUrl: './search-list.component.html',
	styleUrls: ['./search-list.component.less']
})
export class CustomSearchListComponent implements OnInit {

	columns: CheckboxTableColumn[] = [
		{title:'Search Name',attr:'name', width: 15, fixed: true},
		{title:'Description',attr:'description', width: 54, showTwoLines: true, fixed: true},
		{title:'Date Created',attr:'createDate', width: 15, mtcDate:true, fixed: true},
	];

	config: CheckboxTableConfig = {
		topButtons: [
			{text: 'Delete', function: this.removeSearches.bind(this)}
		],
		rowButtons: [
			{text: 'Run', function: this.run.bind(this)},
			{text: 'Edit', function: this.edit.bind(this)},
		]
	};

	constructor(public customSearchService: CustomSearchService,
				public router: Router,
				private dialog: MatDialog){}

	ngOnInit(){
		this.customSearchService.getSearchList();
	}

	run(row){
		this.router.navigate(['/custom-search/search'], { queryParams: { searchId: row.customSearchId } });
	}

	removeSearches(){
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: 'Are you sure you want to delete these searches?'
			},
			width: '500px'
		}).afterClosed().subscribe((response) => {
			if(response){
				this.customSearchService.removeSearches();
			}
		});
	}

	edit(row){
		this.router.navigate(['/custom-search/search'], { queryParams: { searchId: row.customSearchId, isEdit:true} });
	}

}
