import { Injectable } from '@angular/core';

@Injectable()
export class TravelTypeFilterService {

	constructor() { }

	checkFilter(filters, item) {
		return (filters.senior && item.numSeniorMissionaries > 0)
				|| (filters.domestic && item.domesticIntl === 'domestic' && item.numYoungMissionaries > 0)
				|| (filters.international && item.domesticIntl === 'international' && item.numYoungMissionaries > 0);
	}

	checkMissionaryFilter(filters, missionary){
		return (filters.senior && (missionary.type === 'Senior Sister' || missionary.type === 'Couple'))
				|| (filters.domestic && missionary.domesticIntl === 'domestic')
				|| (filters.international && missionary.domesticIntl === 'international');
	}

}
