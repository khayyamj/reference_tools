import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../../../shared';
import { UnauthorizedComponent } from '../unauthorized';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {

	public routes: any[];
	defined = false;

	constructor(private rolesService: RolesService,
				public router: Router
	) {}

	ngOnInit(){
		const travelRoutes = [
			{ url: 'travel/travel-groups/packets', name:'Travel Packets' },
			{ url: 'travel/travel-groups/week-view', name:'Itineraries' },
			{ url: 'travel/departure-schedule', name:'Departure Schedule' },
			{ url: 'travel/groups', name:'Travel Groups' },
			{ url: 'travel/manual-appointments', name:'Manual Appointments' },
			{ url: 'travel/consulate-appointments', name:'Consulate Appointments' },
			{ url: 'travel/temp-assignments', name:'Temp Assignments' },
			{ url: 'travel/settings', name:'Travel Settings' },
		];

		const schedulingRoutes = [
			{ url: 'scheduling/records', name: 'Records',
				showChildren: false,
				children: [
					{ url: 'scheduling/records/napi', name: 'NAPI Data' },
					{ url: 'scheduling/records/new-record', name: 'Create a New Record' },
					{ url: 'scheduling/records/exception-management', name: 'Manage Exceptions' },
					{ url: 'scheduling/records/future-changes', name: 'Manage Future Changes' },
					{ url: 'scheduling/records/mission-abbreviations', name: 'Mission Abbreviations' },
				]},
			{ url: 'scheduling/residence', name: 'Residence Rooms' },
			{ url: 'scheduling/classroom', name: 'Classrooms' },
			{ url: 'scheduling/facilities', name: 'Facilities Management' },
			{ url: 'scheduling/training-groups/search', name: 'Training Groups' },
			{ url: 'scheduling/zones', name: 'Zone Management' },
			{ url: 'scheduling/missionaries', name: 'New Missionary Scheduling',
				showChildren: false,
				children: [
					{ url: 'scheduling/missionaries/classroom-management', name: 'Classroom Size Mgmt' },
					{ url: 'scheduling/missionaries/Young', name: 'Young Adult Missionaries' },
					{ url: 'scheduling/missionaries/Senior', name: 'Senior Missionaries' }
				]}
		];

		const generalServicesRoutes = [
			{ url: 'general-services/mailboxes', name: 'Mailboxes' },
			{ url: 'general-services/service-assignments', name: 'Service Assignments' },
		];

		const assistanceRoutes = [
			{
				url: 'assistance', name: 'Missionary Assistance', showChildren: false,
				children: [
					{ url: 'assistance/items', name: 'Inventory Items' },
					{ url: 'assistance/missionaries', name: 'Missionaries Req. Asst.' },
				]
			}
		];

		const generalRoutes = [
			{ url: 'dashboard', name: 'Dashboard' },
			{ url: 'missionary', name: 'Missionary View' },
			{
				url: 'custom-search', name: 'Custom Search/Reports',
				showChildren: false,
				children: [
					{ url: 'custom-search/search', name: 'Search' },
					{ url: 'custom-search/list', name: 'Saved Searches' }
				]
			},
			{ url: 'missions', name: 'Missions' },
			{
				url: 'useful-links', name: 'Useful Links', showChildren: false,
				children: [
					{ url: 'https://cdol.lds.org/cdol/index.jsf', name: 'CDOL', external: true },
					{ url: 'https://missionarymanagement.ldschurch.org/inquiry', name: 'Missionary Inquiry', external: true },
					{ url: 'https://www.dmba.com/sc/MissionaryMedical', name: 'Missionary Medical', external: true }
				]
			}
		];

		this.routes = [];

		this.rolesService.loaded.subscribe(() => {
			this.routes = [];
			if(this.rolesService.isAuthorizedUser){
				this.routes = this.routes.concat(generalRoutes);
			}else{
				this.router.resetConfig([
					{ path: '', redirectTo: 'unauthorized', pathMatch: 'full'},
					{ path: 'unauthorized', component: UnauthorizedComponent }
				]);
				this.router.navigate(['/unauthorized']);
			}

			if(this.rolesService.isTravelUser){
				this.routes = this.routes.concat(travelRoutes);
			}

			if(this.rolesService.isSchedulingUser){
				this.routes = this.routes.concat(schedulingRoutes);
			}

			if(this.rolesService.isGeneralServicesUser){
				this.routes = this.routes.concat(generalServicesRoutes);
			}

			if(this.rolesService.isAssistanceUser){
				this.routes = this.routes.concat(assistanceRoutes);
			}
		});
		this.defined = true;
	}

	showChildren(parentRoute){
		return parentRoute.showChildren || this.router.url.includes(parentRoute.url);
	}
}
