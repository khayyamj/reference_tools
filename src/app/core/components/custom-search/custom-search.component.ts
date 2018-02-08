import { Component, OnInit, ViewChild, ElementRef, HostListener, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CustomSearchService } from '../../services';
import { RolesService, ToolsInfoService } from '../../../shared/';
import { SaveCustomSearchComponent } from './save-search';
import { CheckboxTableConfig } from 'mtc-modules';
import { SimpleConfirmationComponent, MtcDatePipe } from 'mtc-modules';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
	selector: 'app-missionary-custom-search',
	templateUrl: './custom-search.component.html',
	styleUrls: ['./custom-search.component.less']
})
export class CustomSearchComponent implements OnInit {

	@ViewChild('downloadResults') downloadResults: ElementRef;
	@ViewChild('container') container: ElementRef;

	@ViewChild('results') set el(el: ElementRef) {
		this._el = el;
		this.scrollResultsIntoView();
	}

	get el(){
		return this._el;
	}

	_el: ElementRef;

	config: CheckboxTableConfig = {
		export:true,
		topButtons: [
			{ text: 'Remove', function: this.customSearchService.remove.bind(this.customSearchService) },
			{ text: 'Manage Columns', function: this.saveColumnInfo.bind(this), alwaysVisible: true }
		],
		resultsCountName: {singular: 'Missionary', plural: 'Missionaries'}
	};
	isEdit: boolean;
	searchId: String;

	constructor(public customSearchService: CustomSearchService,
				private rolesService: RolesService,
				public toolsInfoService: ToolsInfoService,
				private dialog: MatDialog,
				private route: ActivatedRoute,
				public router: Router,
				private datePipe:MtcDatePipe,
				@Inject(DOCUMENT) private document: any) {}

	ngOnInit() {
		if (this.customSearchService.isFirstVisit) {
			this.customSearchService.clearCriteria();
			this.customSearchService.isFirstVisit = false;
		}
		this.route.queryParams.map((params) => {
			this.isEdit = params['isEdit'] === 'true';
			this.searchId = params['searchId'] || '';
			return this.searchId;
		}).subscribe((searchId) => {
			this.customSearchService.setSearch(searchId,this.isEdit).subscribe(() => {
				this.scrollResultsIntoView();
			});
		});
	}

	@HostListener('document:keyup.enter')
	handleKeyboardEvent() {
		this.search();
	}

	checkAll(toggle) {
		this.customSearchService.criteria.preMTC = toggle;
		this.customSearchService.criteria.scheduled = toggle;
		this.customSearchService.criteria.inResidence = toggle;
		this.customSearchService.criteria.departed = toggle;
	}

	canViewSecureSubStatus() {
		return this.customSearchService.isCriteriaExpanded && (this.rolesService.isEcclUser || this.rolesService.isSchedulingUser);
	}

	search() {
		this.customSearchService.search().subscribe(() => {
			setTimeout(() => this.scrollResultsIntoView());
		});
	}

	scrollResultsIntoView() {
		if (this.el) {
			const scrollable = this.document.getElementById('main');
			scrollable.scrollTop = this.container.nativeElement.clientHeight - this.el.nativeElement.clientHeight;
		}
	}

	export(){
		const filteredColumns = this.customSearchService.columns.filter(c => c.visible);
		const csv = 'data:text/csv;charset=utf-8, ' +
		filteredColumns.map(c => c.title).join(',') + '\n' +
		this.customSearchService.missionaries.map((m) => {
			return filteredColumns.map((c) => {
				if(c.mtcDate){
					return this.datePipe.transform(m[c.attr]);
				}
				return m[c.attr] ? `"${m[c.attr]}"` : ``;
			}).join(',');
		}).join('\n');

		this.downloadResults.nativeElement.setAttribute('href', encodeURI(csv));
	}

	confirmSave() {
		if (this.searchId) {
			this.dialog.open(SimpleConfirmationComponent, {
				data: {
					cancelButtonText: 'No',
					confirmationButtonText: 'Yes',
					content: 'Do you want to edit the name and description of this saved search?'
				},
				height: '200px',
				width: '400px'
			}).afterClosed().subscribe((answer) => {
				answer ? this.saveSearch() : this.customSearchService.saveSearch(true, this.router);
			});
		} else {
			this.saveSearch();
		}
	}

	saveSearch() {
		this.dialog.open(SaveCustomSearchComponent, {
			data: this.customSearchService.savedSearch,
			width: '400px'
		}).afterClosed().subscribe((searchInfo) => {
			if (searchInfo) {
				this.customSearchService.saveSearch(this.searchId !== '', this.router);
				this.customSearchService.clearCriteria();
			}
		});
	}

	saveColumnInfo(columns) {
		this.customSearchService.saveColumnInfo(columns);
	}
}
