import { Component, OnInit } from '@angular/core';
import { TravelWidgetService } from '../../services';
import { MTCToastService, CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { TravelTypeFilterService } from './../../../shared';
import { TravelPacketsService } from '../../../travel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'dashboard-missing-travel-packets-component',
	templateUrl: './missing-travel-packets.component.html',
	styleUrls: ['./missing-travel-packets.component.less']
})
export class MissingTravelPacketsComponent implements OnInit {

	missionaries = [];
	allMissionaries = [];

	columns: CheckboxTableColumn[] = [
		{ title: 'Missionary', attr: 'missionaryName', width: 23, fixed: true },
		{ title: 'Travel Group', attr: 'missionAbbreviation', fixed: true, width: 23 },
	];

	checkboxTableConfig: CheckboxTableConfig = {
		rowButtons: [{ text: 'Resolve', function: this.resolve.bind(this) }],
		placeholder: 'Travel Packets Loading...'
	};

	filters = [];
	loading = true;

	constructor(private travelWidgetService: TravelWidgetService,
				private typeFilter: TravelTypeFilterService,
				private toastService: MTCToastService,
				private travelPacketsService: TravelPacketsService,
				private route: ActivatedRoute,
				private router: Router
			) { }

	ngOnInit() {
		this.getMissingTravelPacketInformation();
	}

	getMissingTravelPacketInformation() {
		this.travelWidgetService.getMissingTravelPackets().subscribe((travelPacketsData: any) => {
			this.allMissionaries = travelPacketsData.filter((packet) => {
				return !packet.received && !packet.resolvedDate;
			});
			this.loading = false;
			this.filterMissionaries(this.filters);
		});
	}

	filterMissionaries(filters) {
		this.filters = filters;
		this.missionaries = this.allMissionaries.filter((missionary) => this.typeFilter.checkMissionaryFilter(filters, missionary));
	}

	back() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	resolve (traveler: any) {
		traveler.travelPacketStatus = {
			missionaryId: traveler.missionaryId,
			travelGroupId: traveler.travelGroupId,
			createdDate: new Date(),
			received: true
		};
		this.travelPacketsService.updateTravelPacketStatus(traveler.travelPacketStatus).subscribe(() => {
			this.missionaries = this.missionaries.filter((missionary) => missionary.missionaryId !== traveler.missionaryId);
			this.toastService.success(`Travel packet for ${traveler.missionaryName} resolved <strong>successfully</strong>`);
		});
	}
}
