import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MissionaryApiService } from '../../../core-missionary/services/missionary-api/missionary-api.service';
import { TravelSearchService } from '../../services';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MTCToastService, CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';


@Component({
	selector: 'app-travel-missionary-search',
	templateUrl: './travel-missionary-search.component.html',
	styleUrls: ['./travel-missionary-search.component.less'],
	providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: TravelMissionarySearchComponent }]
})

export class TravelMissionarySearchComponent implements OnInit, TravelMissionarySearchComponent {

	private formChange: (value: any) => void;
	private _missionaries: any;
	@Input() set missionaries(m) {
		this._missionaries = m;
		if (!this.missionaries) {
			this.missionaries = [];
		}
	}
	get missionaries() {
		return this._missionaries;
	}

	@Output() missionariesChange: EventEmitter<any> = new EventEmitter<any>();
	@Input() isFormControl: boolean;

	@Input() disabled: boolean;

	private childControl = new FormControl();

	isSearching = false;
	noResults = false;
	searchQuery = '';
	searchedMissionaries: any;

	columnHeaders: CheckboxTableColumn [] = [
		{ title: 'Missionary Name', attr: 'fullName' },
		{ title: 'ID', attr: 'missionaryId' },
		{ title: 'Mission', attr: 'missionAbbreviation' }
		];
	checkboxTableConfig: CheckboxTableConfig = {
		buttonColumnWidth: 25,
		rowButtons: [
			{text: 'REMOVE', function: this.removeMissionary.bind(this)}
		]
	};

	constructor(private missionaryService: MissionaryApiService,
				private travelSearchService: TravelSearchService,
				private toastService: MTCToastService) {
	}

	ngOnInit() {
		this.searchedMissionaries = [];
	}

	search() {
		this.isSearching = true;
		this.noResults = false;
		if (this.searchQuery.search(/[0-9]{5}/) !== -1) {
			this.travelSearchService.getMissionaryById(this.searchQuery).subscribe((missionary:any) => {
				if (this.addMissionaryToList(missionary)) {
					this.searchQuery = '';
					this.searchedMissionaries = [];
					this.isSearching = false;
				}
			});
		} else {
			this.missionaryService.getMissionaries({ preMTC: false, scheduled: false, inResidence: true, departed: false }, this.searchQuery, true).subscribe((missionaries:any[]) => {
				this.searchedMissionaries = missionaries;
				this.isSearching = false;
				this.noResults = this.searchedMissionaries.length === 0;
			});

		}
		if (!this.searchQuery) {
			this.searchedMissionaries = [];
		}
	}

	addMissionaryToList(missionary) {
		if (!this.checkMissionaryInList(missionary.missionaryId)) {
			this.putMissionaryInList(missionary);
			if ('Couple' === missionary.missionaryType) {
				this.travelSearchService.getSeniorCoupleSpouse(missionary.missionaryId).subscribe((msny:any) => {
					this.putMissionaryInList(msny);
				});
			}
			return true;
		}
		return false;
	}

	checkMissionaryInList(missionaryId) {
		return this.missionaries.some((missionary) => {
			return missionary.missionaryId === missionaryId;
		});
	}

	putMissionaryInList(missionary) {
		this.missionaries = this.missionaries.concat(missionary);
		if (this.isFormControl) {
			this.formChange(this.missionaries);
		}
		this.outputMissionaries();
	}

	isSenior(type: string) {
		return type.match(/senior|couple/ig) !== null;
	}

	addMissionaryFromRow(missionary) {
		if (this.addMissionaryToList(missionary)) {
			this.searchQuery = '';
			this.searchedMissionaries = [];
		}
		this.closeSearchedMissionaries();
	}

	addMissionaryFromIcon(missionary, e) {
		e.preventDefault();
		e.stopPropagation();
		this.travelSearchService.getMissionaryById(missionary.missionaryId).subscribe((msny:any) => {
			this.addMissionaryToList(msny);
		});
		this.outputMissionaries();
		this.toastService.success(`${missionary.fullName} was <strong>successfully</strong> added`);
	}

	closeSearchedMissionaries() {
		this.searchedMissionaries = [];
		this.outputMissionaries();
	}

	removeMissionary(missionary) {
		this.missionaries = this.missionaries.filter((m) => {
			return m.missionaryId !== missionary.missionaryId;
		});
		if (this.isFormControl) {
			this.formChange(this.missionaries);
		}
		this.outputMissionaries();
	}

	outputMissionaries() {
		this.missionariesChange.emit(this.missionaries);
	}

	writeValue(value: any) {
		this.childControl.setValue(value);
	}

	registerOnChange(formChange: (value: any) => void) {
		this.formChange = formChange;
		window.setTimeout(() => {
			this.formChange(this.missionaries);
		}, 0);
	}

	registerOnTouched() { }

}
