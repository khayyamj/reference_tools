import { Injectable } from '@angular/core';

@Injectable()
export class WindowRefService {

	constructor() { }

	getWindow(){
		return window;
	}

}
