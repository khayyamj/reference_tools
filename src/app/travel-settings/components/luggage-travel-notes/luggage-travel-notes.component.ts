import { Component, OnInit } from '@angular/core';
import { AirlineSettingsService } from '../../services';
import { Subject } from 'rxjs/Subject';
import { MTCUser } from 'mtc-modules';

class Airline {
	airlineCode: string;
	airlineName: string;
}

class AirlineGroup {
	airlineGroupId = '';
	airlines = new Array<Airline>();
	weightLimitPerBag: number;
	weightLimitPerCarryOn: number;
	note = '';
	createdBy = '';
	createdDate: Date;
	createdName = '';
	modDate: Date;
	modBy = '';
	modName = '';
}

@Component({
	selector: 'travel-settings-luggage-notes',
	templateUrl: './luggage-travel-notes.component.html',
	styleUrls: ['./luggage-travel-notes.component.less']
})

export class LuggageTravelNotesComponent implements OnInit {

	public allAirlines: Array<Airline>;

	public airlineGroups: Array<AirlineGroup>;
	public subjectAirlineGroup: Subject<AirlineGroup> = new Subject();

	user;

	constructor(private userService: MTCUser,
				private airlineSettingsService: AirlineSettingsService) { }

	ngOnInit() {
		this.airlineSettingsService.getAirlines().subscribe((data) => {
			this.allAirlines = data;
		});
		this.airlineSettingsService.getAirlineGroups().subscribe((data) => {
			this.airlineGroups = data;
			this.removeAssignedAirlineFromList();
		});
		this.subjectAirlineGroup.asObservable().debounceTime(1000)
			.switchMap((airlineGroup) => this.airlineSettingsService.setAirlineGroup(airlineGroup)).subscribe((airlineGroupId:any) => {
				const updatedGroup = this.airlineGroups.find((group) => {
					return (group.airlineGroupId === airlineGroupId);
				});
				const timeStamp = new Date();
				updatedGroup.modDate = timeStamp;
			});
		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});
	}

	removeAssignedAirlineFromList() {
		this.airlineGroups.forEach((group) => {
			group.airlines.forEach((assignedAirline) => {
				const indexOfAirline = this.allAirlines.findIndex((airline) => {
					return assignedAirline.airlineName === airline.airlineName;
				});
				this.allAirlines.splice(indexOfAirline, 1);
			});
		});
	}

	updateAirlineGroup(form,airlineGroup,index) {
		if(form.valid && !this.hasNoAirlines(airlineGroup)) {
			airlineGroup.modName = this.user.name;
			airlineGroup.airlines = airlineGroup.airlines.filter((airline) => {
				return !airline.delete;
			});
			this.subjectAirlineGroup.next(airlineGroup);
		}
	}

	addAirlineToAirlineGroup(airlineGroup, airline) {
		if(airline.airlineCode) {
			airlineGroup.airlines.push(airline);
		}
	}

	addNewAirlineGroup() {
		const newAirlineGroup = new AirlineGroup();
		this.airlineSettingsService.setAirlineGroup(newAirlineGroup).subscribe((id:any) => {
			newAirlineGroup.airlineGroupId = id;
			const timeStamp = new Date();
			newAirlineGroup.modDate = timeStamp;
			this.airlineGroups.push(newAirlineGroup);
		});
	}

	deleteAirlineFromGroup(form,airline) {
		airline.delete = true;
	}

	hasNoAirlines(airlineGroup) {
		return !airlineGroup.airlines.some((airline) => {
			return !airline.delete;
		});
	}

	deleteAirlineGroup(airlineGroupIndex) {
		this.airlineSettingsService.deleteAirlineGroup(this.airlineGroups[airlineGroupIndex].airlineGroupId).subscribe(() => {
			this.airlineGroups.splice(airlineGroupIndex, 1);
		});
	}
}
