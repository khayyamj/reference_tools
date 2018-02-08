import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DashboardService {

	private _resizeSubject = new BehaviorSubject<any>(1200);

	get resizeSubject(){
		return this._resizeSubject.asObservable();
	}

	constructor() { }

	onResize(height) {
		this._resizeSubject.next(height);
	}

}
