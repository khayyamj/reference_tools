import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MTCUser } from 'mtc-modules';
import { RolesService, ConfigService } from '../../../shared';
import { Router } from '@angular/router';
import { MissionaryApiService } from '../../services';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
	@Output() openSideMenu = new EventEmitter();
	searching = false;
	isSearchOpen:boolean;
	searchOptions = {
		preMTC:false,
		scheduled:false,
		inResidence:true,
		departed:false,
	};
	hideMobile;
	title = '';
	searchQuery = '';
	searchResults:any = [];
	isMenuOpen = false;
	username: string;

	constructor(private router: Router,
				private userService: MTCUser,
				public rolesService: RolesService,
				private missionaryApi: MissionaryApiService,
				public configService: ConfigService,) {

				}

	ngOnInit() {
		this.isSearchOpen = false;
		this.isMenuOpen = false;
		this.hideMobile = window.innerWidth >1200;
		this.title = 'Search History';
		this.userService.getUser().subscribe((user) => {
			this.username = user.name;
		});
		this.configService.loaded.subscribe(() => {
			Object.keys(this.searchOptions).forEach((option) => {
				if(this.configService.getConfig('Missionary Search',option)){
					this.searchOptions[option] = this.configService.getConfig('Missionary Search',option).value === '1';
				}
			});
		});
	}

	logout() {
		MTCAuth.logout();
	}

	openSearch(event){
		this.isSearchOpen = true;
		this.addMissionary(this.searchQuery,event);
	}

	onKeyPress(event){
		//If user presses enter, add or search for the missionary
		if(event.keyCode === 13){
			this.addMissionary(this.searchQuery,event);
		}
		//If user deletes the current search query change the results back to search history
		if(this.searchQuery === '') {
			this.missionaryApi.getMissionarySearchHistory().subscribe((searchHistory) => {
				this.searchResults = searchHistory;
				this.title = 'Search History';
			});
		}
	}

	addMissionary(query,event){
		this.searching = true;
		//TODO should this be in the service?
		if(!query){
			this.missionaryApi.getMissionarySearchHistory().subscribe((searchHistory) => {
				this.searchResults = searchHistory;
				this.title = 'Search History';
			});
			this.searching = false;
		}else{
			this.missionaryApi.getMissionaries(this.searchOptions, query).subscribe((results) => {
				this.searchResults = results;
				this.title = 'Search Results';
				if(this.searchResults.length === 1){
					const missionaryId = this.searchResults[0].missionaryId;
					this.isSearchOpen = false;
					this.searchResults = [];
					this.searchQuery = '';
					this.router.navigate(['/missionary'], {queryParams:{missionaryId:missionaryId}});
				}
				this.searching = false;
			});
		}
		if(event){
			event.stopPropagation();
		}
	}

	updateOptions(searchOptions){
		Object.keys(searchOptions).forEach((option) => {
			const v = searchOptions[option] ? '1' : '0';
			this.configService.setConfig('Missionary Search',option,v).subscribe();
		});
		this.searchOptions = searchOptions;
		this.addMissionary(this.searchQuery, null);
	}

	selectedMissionary(missionaryId,event){
		this.router.navigate(['/missionary'], {queryParams:{missionaryId:missionaryId}});
		event.stopPropagation();
		this.isSearchOpen = false;
	}
}
