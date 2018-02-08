import { Component, OnInit } from '@angular/core';
import { MissionAbbreviationService } from '../../services';
import { MatDialog } from '@angular/material';
import { SimpleConfirmationComponent, MTCToastService } from 'mtc-modules';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolsInfoService } from '../../../shared';

@Component({
	selector: 'scheduling-records-mission-abbreviations',
	templateUrl: './mission-abbreviations.component.html',
	styleUrls: ['./mission-abbreviations.component.less']
})
export class MissionAbbreviationsComponent implements OnInit {

	mission;
	missionForm: FormGroup;

	constructor(private missionAbbreviationService: MissionAbbreviationService,
				public toolsInfoService: ToolsInfoService,
				private dialog: MatDialog,
				private toastService: MTCToastService,
				private fb: FormBuilder) { }

	ngOnInit() {
		this.mission = this.missionAbbreviationService.mission;
		if(this.mission.selectedMission){
			this.mission.abbreviation = this.mission.selectedMission.abbreviation;
		}
		this.missionForm = this.fb.group({
			name: ['', [Validators.required]],
			abbreviation: ['', [Validators.required, Validators.maxLength(10), this.isAbbreviationAlreadyInUse.bind(this)]],
		});

	}

	missionSelected(){
		if(this.mission.selectedMission.id){
			this.mission.abbreviation = this.mission.selectedMission.abbreviation;
		}
	}

	save(form){
		if(form.valid) {
			this.mission.selectedMission.abbreviation = this.mission.abbreviation;
			this.missionAbbreviationService.setMissionAbbreviation(this.mission.selectedMission).subscribe(() => {
				this.toastService.success(`The abbreviation for ${this.mission.selectedMission.name} has <strong>successfully</strong> changed to ${this.mission.selectedMission.abbreviation}`);
			});
		}
	}

	cancel() {
		const config = {
			cancelButtonText: 'No',
			confirmationButtonText: 'Yes',
			content:'You are about to lose all of your changes. Are you sure you want to cancel?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width:'400px'
		}).afterClosed().subscribe((data) => {
			if (data && this.mission.selectedMission) {
				this.mission.abbreviation = this.mission.selectedMission.abbreviation;
			}
		});
	}

	isAbbreviationAlreadyInUse(){
		if(this.toolsInfoService.info.missions && this.mission.abbreviation){
			const abbreviationInUse = this.toolsInfoService.info.missions.some((mission) => {
				if(this.mission.selectedMission.id && mission.abbreviation){
					return mission.abbreviation.toUpperCase() === this.mission.abbreviation.toUpperCase() &&
						mission.name !== this.mission.selectedMission.name;
				}
			});

			return abbreviationInUse ? {abbreviationAlreadyInUse:true} : null;
		}
	}
}
