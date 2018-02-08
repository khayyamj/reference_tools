import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WindowRefService } from '../../services';
import * as _ from 'lodash';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.less']
})
export class TabsComponent implements OnInit {
	@Input() tabs;
	@Output() tabsChange: EventEmitter<any> = new EventEmitter<any>();
	@Input() titleAttr;
	@Input() uniqueId;
	@Input() set currentTab(value) {
		this._currentTab = value;
		setTimeout(() => {
			this.setSelectedTabIndex();
			this.scrollToActiveTab();
		}, 400);
	}
	@Output() currentTabChange: EventEmitter<any> = new EventEmitter<any>();
	@Output() onSearchBtnClick: EventEmitter<any> = new EventEmitter<any>();
	@Output() onRemoveTab: EventEmitter<number> = new EventEmitter<number>();
	@Output() onRemoveAllClick: EventEmitter<any> = new EventEmitter<any>();

	get currentTab() {
		return this._currentTab;
	}
	_currentTab;
	searchId = {};
	viewTabGroup = 1;
	selectedTabIndex = 0;
	maxTabs;

	constructor(private windowRefService: WindowRefService) { }

	ngOnInit() {
		this.searchId[this.uniqueId || this.titleAttr] = 'search';
	}

	isActiveTab(obj) {
		const attr = this.uniqueId || this.titleAttr;
		return this.currentTab && this.currentTab[attr] === obj[attr];
	}

	setActiveTab(obj) {
		this.currentTab = obj;
		this.currentTabChange.emit(this.currentTab);
		this.setSelectedTabIndex();
	}

	removeTab(index) {
		if (this.onRemoveTab) {
			this.onRemoveTab.emit(this.tabs[index]);
		} else {
			this.tabs.splice(index, 1);
			this.tabsChange.emit(this.tabs);
		}
		if (this.currentTab.id) {
			if (this.tabs.length) {
				this.currentTab = this.tabs[0];
				this.selectedTabIndex = 0;
			} else {
				this.currentTab = {};
			}
			this.currentTabChange.emit(this.currentTab);
		}
		setTimeout(() => {
			this.setSelectedTabIndex();
			this.scrollToActiveTab();
		}, 0);
	}

	removeAllTabs() {
		this.onRemoveAllClick.emit();
	}

	searchButtonClick() {
		this.onSearchBtnClick.emit();
		this.selectedTabIndex = -1;
	}

	setSelectedTabIndex() {
		this.selectedTabIndex = this.tabs.findIndex((tab) => {
			return tab[this.titleAttr] === this.currentTab[this.titleAttr];
		});
	}

	scrollToActiveTab() {
		const activeTabGroup = Math.ceil((this.selectedTabIndex + 1) / this.maxTabs);
		if (activeTabGroup > this.viewTabGroup) { this.tabViewChange('right'); }
		if (activeTabGroup < this.viewTabGroup) { this.tabViewChange('left'); }
		if (Math.abs(activeTabGroup - this.viewTabGroup) > 0 && this.selectedTabIndex >= 0) {
			this.scrollToActiveTab();
		}
	}

	showArrow() {
		return this.tabs.length > this.maxTabs || this.viewTabGroup > 1;
	}

	isArrowHighlighted(direction) {
		if (direction === 'left') {
			return this.selectedTabIndex - ((this.viewTabGroup - 1) * this.maxTabs) === 0;
		} else {
			return this.selectedTabIndex + 1 - ((this.viewTabGroup) * this.maxTabs) === 0;
		}
	}

	tabViewChange(direction) {
		if (direction === 'left' && this.viewTabGroup > 1) {
			this.viewTabGroup--;
		} else if (direction === 'right' && this.viewTabGroup < this.tabs.length / this.maxTabs) {
			this.viewTabGroup++;
		}
	}

	highlightArrow(arrow) {
		return arrow === 'right' ? this.viewTabGroup < Math.ceil(this.tabs.length / this.maxTabs) : this.viewTabGroup > 1;
	}

	getWidth() {
		const sideMenuWidth = 240;
		const closeAllButtonWidth = 92;
		const arrowWidth = 50;
		let width = this.windowRefService.getWindow().innerWidth - sideMenuWidth - closeAllButtonWidth;
		this.maxTabs = Math.floor(width / 132);
		if (this.onSearchBtnClick.observers.length > 0) {
			width -= 44;
		}
		if(this.tabs.length > this.maxTabs) {
			width -= arrowWidth;
			this.maxTabs = Math.floor(width/132);
			return width / this.maxTabs;
		}
		return _.clamp((width / this.maxTabs),132,240);
	}

	getTransform() {
		return 'translateX(' + (this.viewTabGroup - 1) * -(100 * this.maxTabs) + '%)';
	}
}
