import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
	UnauthorizedComponent,
	CustomSearchComponent,
	CustomSearchListComponent
} from './components/';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'unauthorized', component: UnauthorizedComponent },
			{ path: 'custom-search/search', component: CustomSearchComponent },
			{ path: 'custom-search/list', component: CustomSearchListComponent }
		])
	],
	exports: [
		RouterModule
	]
})
export class CoreRoutingModule { }
