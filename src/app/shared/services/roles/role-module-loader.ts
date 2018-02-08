import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { RolesService } from './roles.service';

@Injectable()
export class RoleModuleLoader implements PreloadingStrategy {

	constructor(private rolesService: RolesService){}

	preload(route: Route, load: Function): Observable<any> {
		const subject:Subject<boolean> = new Subject<boolean>();
		this.rolesService.loaded.subscribe(() => {
			return ((route.path.includes('travel') && this.rolesService.isTravelUser) ||
					(route.path.includes('scheduling') && this.rolesService.isSchedulingUser) ||
					(route.path.includes('general-services') && this.rolesService.isGeneralServicesUser) ||
					(route.path.includes('assistance') && this.rolesService.isAssistanceUser))
			? load() : Observable.of(null);
		});
		return subject.asObservable();
	}
}
