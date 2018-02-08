import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
} from '@angular/router';
import { RolesService } from './roles.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RoleGuard implements CanActivate {

	constructor(public rolesService: RolesService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
		const rolesWithAccess = route.data.roles;

		const subject = new Subject<boolean>();
		this.rolesService.loaded.subscribe(() => {
			if (rolesWithAccess.some(role => this.rolesService.isUserInRole(role))) {
				subject.next(true);
			} else {
				this.router.navigate(['/unauthorized']);
				subject.next(false);
			}
		});
		return subject.first();
	}
}
