import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditFacilitiesFutureChangeService } from '../../../services';
import { MTCUser } from 'mtc-modules';
import * as _ from 'lodash';
import { ToolsInfoService } from '../../../../shared';

@Component({
	selector: 'app-edit-facilities-future-changes',
	templateUrl: './edit-facilities-future-changes.component.html',
	styleUrls: ['./edit-facilities-future-changes.component.less']
})
export class EditFacilitiesFutureChangesComponent implements OnInit {

	public loading=true;
	config:any={};
	room;
	dialogType:string;
	showConfirmation=false;
	changes: any[] = [];
	public possibleItems:any = {};
	public columns = ['CHANGE', 'CURRENT VALUE', 'FUTURE VALUE', 'EFFECTIVE DATE', 'CHANGE MADE BY', ''];
	private possibleAttributes = [
		{item: 'Zone', info:'zones'},
		{item:'classrooms', info:'Classroom'},
		{item:'Branch', info:'branches'},
		{item:'Usage', info:'usage'},
		{item:'Status', info:'roomStatuses'},
		{item:'Overflow',info:'booleanList'}
	];

	constructor(private userService: MTCUser,
		public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any,
		private toolsInfoService: ToolsInfoService,
		private editFacilitiesFutureChangeService: EditFacilitiesFutureChangeService) { }

	ngOnInit() {
		this.room = this.dialogData;
		this.editFacilitiesFutureChangeService.changes=[];
		this.editFacilitiesFutureChangeService.getRoomChangesToEdit(this.room).subscribe((roomChanges:any) => {
			this.editFacilitiesFutureChangeService.currentChanges = roomChanges;
			this.changes = roomChanges;
			this.loading=false;
		});
		this.possibleAttributes.forEach((type)=>{
			this.possibleItems[type.item] = this.toolsInfoService.info[type.info];
		});
		this.mapChanges();
		this.setSubusage();
	}

	mapChanges() {
		this.changes.map((change)=>{
			change.effectiveDate=new Date(change.effectiveDate);
			change.updatedDate=new Date(change.updatedDate);
			change.currentValue=this.room[change.changeType.toLowerCase()];
			if(change.changeType==='Overflow'){
				change.futureValue= change.futureValue?'Yes':'No';
			}
			change.futureValue = { name: change.futureValue };
		});
	}

	delete(index) {
		this.editFacilitiesFutureChangeService.deleteChange(this.changes,index);
		if(this.changes.length===0){
			this.changes=[{}];
		}
	}

	updateChange(change) {
		this.userService.getUser().subscribe((user) => {
			change.updatedBy = user.name;
		});
		if (change.changeType === 'Usage') {
			this.setSubusage(change);
		}
	}

	setSubusage(usageChange?) {
		const usage = usageChange ? usageChange : this.changes.find(change => change.changeType === 'Usage');
		const subusage = this.changes.find(change => change.changeType === 'Subusage');
		if (this.compareSubusageUsage(usage,subusage) || (!usage && this.room.usage === 'Classroom')) {
			this.possibleItems.Subusage = this.toolsInfoService.info.traininglanguages;
		} else {
			this.possibleItems.Subusage = this.toolsInfoService.info.subusage;
		}
	}

	compareSubusageUsage(usage,subusage) {
		return usage && subusage &&
				(usage.futureValue.name === 'Classroom' && subusage.effectiveDate >= usage.effectiveDate ||
				usage.currentValue === 'Classroom' && subusage.effectiveDate <= usage.effectiveDate);
	}

	cancel() {
		if (this.changes.length === 0){
			this.dialogRef.close();
		} else {
			this.config = {
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: 'Are you sure you want to cancel these future changes?'
			};
			this.dialogType = 'cancel';
			this.showConfirmation = true;
		}
	}

	save() {
		this.config = {
			cancelButtonText: 'no',
			confirmationButtonText: 'yes',
			content: `Are you sure want to make these changes?`
		};
		this.dialogType='save';
		this.showConfirmation=true;
	}

	confirmation(answer){
		this.showConfirmation=false;
		if(answer){
			if(this.dialogType==='save'){
				this.editFacilitiesFutureChangeService.saveFutureChanges(this.changes);
			}
			this.dialogRef.close();
		}
	}
}
