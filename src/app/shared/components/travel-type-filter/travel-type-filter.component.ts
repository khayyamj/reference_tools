import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfigService, } from '../../services';

@Component({
	selector: 'app-travel-type-filter',
	templateUrl: './travel-type-filter.component.html',
	styleUrls: ['./travel-type-filter.component.less']
})
export class TravelTypeFilterComponent implements OnInit {

	@Output() public filterChange = new EventEmitter();

	config = 'Travel Type Filter';
	filter;
	options: any[] = [{ name: 'Domestic', value: 'domestic' },
	{ name: 'International', value: 'international' },
	{ name: 'Senior Missionaries', value: 'senior' }];

	constructor(private configService: ConfigService) { }

	ngOnInit() {
		if (this.config) {
			this.configService.loaded.subscribe(() => {
				this.options.map((option) => {
					const config = this.configService.getConfig(this.config, option.value);
					if (config) {
						option.selected = config.value === '1';
					}
				});
				this.mapFilter();
			});
		}
	}
	changeFilter(option) {
		this.mapFilter();
		const v = option.selected ? '1' : '0';
		this.configService.setConfig(this.config, option.value, v).subscribe();
	}

	mapFilter() {
		const filters = {};
		this.options.map((option) => { filters[option.value] = option.selected; });
		this.filter = filters;
		this.filterChange.emit(filters);
	}

	isFilterButtonChecked(value) {
		return value === this.filter;
	}

}






