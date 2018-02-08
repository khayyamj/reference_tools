import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChangeService } from '../../../services';
import { ToolsInfoService } from '../../../../shared';


@Component({
	selector: 'app-missionary-create-change',
	templateUrl: './create-change.component.html',
	styleUrls: ['./create-change.component.less']
})
export class CreateChangeComponent implements OnInit {

	title = 'Create Change';
	change:any = {};

	constructor(public dialogRef: MatDialogRef<any>,
				private changeService: ChangeService,
				public toolsInfoService: ToolsInfoService,
				@Inject(MAT_DIALOG_DATA) public data: any ) {}

	ngOnInit() {

	}

	create(){
		const change:any = {
			missionaryIds: [this.data.missionaryId],
			fields: this.change.action.fields,
			actionId: this.change.action.id,
			effectiveDt: this.change.effectiveDate,
			actionName: this.change.action.name
		};
		if(this.change.reason) {
			change.reasonId= this.change.reason.id;
		}
		this.change.missionaryIds = [this.data.missionaryId];
		this.changeService.createChange(change).subscribe((newChange) => {
			this.dialogRef.close(newChange);
		});
	}
}
