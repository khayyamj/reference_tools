import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UnauthorizedComponent } from '../../unauthorized';
import { MTCUser } from 'mtc-modules';
import { RolesService } from '../../../../shared';

@Component({
	selector: 'app-mobile-sidebar',
	templateUrl: './mobile-sidebar.component.html',
	styleUrls: ['./mobile-sidebar.component.less']
})
export class MobileSidebarComponent implements OnInit, OnChanges {

	userFullName;
	missionaryId;
	url;
	userType;
	@Input() open;
	@Output() openChange:EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('sidenav') sidenav;
	routes = [{url: 'missionary', name: 'Missionary Information'},{url: 'missionary/schedule', name: 'Schedule'},{url: 'missionary/notes', name: 'Notes'}];

	constructor(private userService: MTCUser,
				public route: ActivatedRoute,
				private router: Router,
				private rolesService: RolesService) { }

	ngOnInit() {
		this.router.events.filter((event) => event instanceof NavigationEnd).subscribe(() => {
			this.url = this.router.url.substring(1,this.router.url.indexOf('?'));
			if(this.router.url !=='/') {
				this.userService.getUser().subscribe((user) => {
					this.userFullName = user.name;
				});
				this.route.queryParams.subscribe((params)=>{
					if(params) {
						this.missionaryId = params['missionaryId'];
					}
				});
				this.rolesService.loaded.subscribe(() => {
					if(this.rolesService.isTravelUser) {
						this.userType = 'Travel';
					} else if(this.rolesService.isSchedulingUser) {
						this.userType = 'Scheduling';
					} else if(this.rolesService.isAuthorizedUser) {
						this.userType = 'Ecclesiastical';
					} else {
						this.router.resetConfig([
							{ path: '', redirectTo: 'unauthorized', pathMatch: 'full'},
							{ path: 'unauthorized', component: UnauthorizedComponent }
						]);
						this.router.navigate(['/unauthorized']);
					}
				});
			}
		});
	}
	ngOnChanges(){
		this.open ? this.sidenav.open() : this.sidenav.close();
	}

	close(){
		this.sidenav.close();
		this.open = false;
		this.openChange.emit(false);
	}

	logout() {
		MTCAuth.logout();
	}
}
