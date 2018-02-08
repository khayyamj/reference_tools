import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ZoneManagementService } from '../../../services';
import { ToolsInfoService } from '../../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
	selector: 'app-edit-zone',
	templateUrl: './edit-zone.component.html',
	styleUrls: ['./edit-zone.component.less']
})
export class EditZoneComponent implements OnInit {

	public currentZone: any;
	private originalZone: any;
	public title = '';
	public config: any = {};
	public modalSaveButton: string;
	public showConfirmation: boolean;
	private dialogType;
	public zoneForm: FormGroup;
	public allZones = [];
	public savedZone: any = {id:null};

	constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
				private zoneManagementService: ZoneManagementService,
				public toolsInfoService: ToolsInfoService,
				private builder: FormBuilder) { }

	ngOnInit() {
		this.zoneManagementService.zones.subscribe((allZones) => {
			this.allZones = allZones;
		});
		this.currentZone = this.dialogData;
		this.originalZone = _.cloneDeep(this.currentZone);
		if (this.currentZone.zone) {
			this.title = 'EDIT ZONE';
			this.modalSaveButton = 'save';
		} else {
			this.title = 'CREATE A NEW ZONE';
			this.modalSaveButton = 'create';
			this.currentZone = {
				zone: '',
				languages: [{language:'', schedule:''}],
				branch: '',
			};
		}
		this.zoneForm = this.builder.group({
			zone: [false, [Validators.required, this.isNameUnique.bind(this)]]
		});
	}

	isNameUnique() {
		return this.allZones.some((zone) => {
				return this.currentZone.zone.toLowerCase() === zone.zone.toLowerCase() && this.currentZone.zoneId !== zone.zoneId;
		}) ? { nameNotUnique: true } : null;
	}

	delete() {
		this.dialogType = 'delete';
		this.config = {
			content: 'Are you sure you want to delete this zone?',
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete'
		};
		this.showConfirmation = true;
	}

	cancel() {
		this.dialogType = 'cancel';
		this.config = {
			cancelButtonText: 'No',
			confirmationButtonText: 'Yes',
			content: 'Are you sure you want to cancel your changes?'
		};
		this.showConfirmation = true;
	}

	save(form) {
		if(form.valid){
			this.dialogType = 'save';
			this.config = {
				cancelButtonText: 'no',
				confirmationButtonText: 'yes',
				content: 'Are you sure you want to ' + (this.modalSaveButton === 'create'? 'create this zone?': 'save changes to this zone?')
			};
			this.showConfirmation = true;
		}
	}

	confirmation(answer) {
		if (answer) {
			if (this.dialogType === 'save') {
				this.checkChanges();
				delete this.currentZone.branch;
				this.zoneManagementService.upsertZone(this.currentZone).subscribe((savedZone) => {
					this.savedZone = savedZone;
					if(this.savedZone.id != null){
						this.zoneManagementService.displayToast(this.modalSaveButton + 'd', false);
						this.dialogRef.close(this.currentZone);
					} else {
						this.zoneManagementService.displayErrorToast(this.modalSaveButton, false);
						this.dialogRef.close();
					}
				});
			} else if (this.dialogType === 'cancel') {
				this.dialogRef.close();
			} else if (this.dialogType === 'delete') {
				delete this.currentZone.branch;
				this.currentZone.branchId = null;
				this.zoneManagementService.deleteZone(this.currentZone).subscribe(() => {
					this.zoneManagementService.displayToast('deleted', false);
					this.dialogRef.close(this.currentZone);
				});
			}
		} else {
			this.showConfirmation = false;
		}
	}

	oneLanguage(){
		return this.currentZone.languages.filter((language) => {
			return !language.delete;
		}).length <= 1;
	}

	checkChanges() {
		if(!this.originalZone.zoneId) {
			return;
		}
		this.currentZone.branchId === this.originalZone.branchId ? this.currentZone.branchId = null : this.currentZone.deleteBranch = true;
		this.originalZone.languages.forEach((language) =>{
			const editedlanguagedIndex = this.currentZone.languages.findIndex((lang) => {
				return (lang.language === language.language && lang.scheduleId === language.scheduleId);
			});
			if(editedlanguagedIndex === -1){
				language.delete = true;
				this.currentZone.languages.push(language);
			} else {
				this.currentZone.languages[editedlanguagedIndex] = language;
			}
		});
	}

	addLanguage() {
		this.currentZone.languages.push({language:'',schedule:''});
	}

	removeLanguage(language, index) {
		if(language.zoneLanguageId){
			language.delete = true;
		}
		this.currentZone.languages.splice(index,1);
	}

	updateLanguages(newValue,language) {
		language.zoneLanguageId = '';
		language.languageId = newValue.id;
		language.language = newValue.name;
	}
	updateSchedules(newValue,language) {
		language.zoneLanguageId = '';
		language.scheduleId = newValue.id;
		language.schedule = newValue.name;
	}
	updateBranch(newValue) {
		this.currentZone.branchId = newValue.id;
	}

	filterLanguages(currentIndex) {
		return this.toolsInfoService.info.traininglanguages.filter((language) => {
			return this.currentZone.languages.every((zoneLanguage, index) => {
				return zoneLanguage.delete || language.name !== zoneLanguage.language || currentIndex === index;
			});
		});
	}
}
