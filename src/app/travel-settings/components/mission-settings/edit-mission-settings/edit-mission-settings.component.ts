import { Component, OnInit, Inject } from '@angular/core';
import { MTCUser } from 'mtc-modules';
import { MissionSettingsService } from '../../../services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'travel-settings-edit-mission',
	templateUrl: './edit-mission-settings.component.html',
	styleUrls: ['./edit-mission-settings.component.less']
})
export class EditMissionSettingsComponent implements OnInit {
	mission: any;
	username: string;
	form:FormGroup;
	showError = false;

	constructor(private missionSettingsService: MissionSettingsService,
				public dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private data:any,
				private userService:MTCUser,
				private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.mission = this.data;
		this.userService.getUser().subscribe((user) => {
			this.username = user.name;
		});
		this.form = this.formBuilder.group(({
			medSched: [this.mission.medSched, Validators.required],
			passportCheck: [this.mission.passportCheck, Validators.required],
			travelLeaderNotes: [this.mission.travelLeaderNotes],
			missionTravelNotes: [this.mission.missionTravelNotes]
		}));
	}

	get missionTravelNotes(){
		return this.form.get('missionTravelNotes');
	}

	get travelLeaderNotes(){
		return this.form.get('travelLeaderNotes');
	}

	get passportCheck(){
		return this.form.get('passportCheck');
	}

	get medSched(){
		return this.form.get('medSched');
	}

	save(form) {
		if(form.valid) {
			this.showError = false;
			this.mission.missionTravelNotes = this.missionTravelNotes.value;
			this.mission.travelLeaderNotes = this.travelLeaderNotes.value;
			this.mission.passportCheck = this.passportCheck.value;
			this.mission.medSched = this.medSched.value;
			this.missionSettingsService.setMissionSetting(this.mission).subscribe(() => {
				this.mission.modDt = new Date();
				this.mission.modNm = this.username;
				this.dialogRef.close(this.mission);
			});
		} else {
			this.showError = true;
		}
	}

}



