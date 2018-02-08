import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { AssistanceService } from '../../../services';

@Component({
	selector: 'app-edit-item',
	templateUrl: './edit-item.component.html',
	styleUrls: ['./edit-item.component.less']
})
export class EditItemComponent implements OnInit {

	type = 'Create';
	item: any = {};

	constructor(public assistanceService: AssistanceService,
				public dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) private dialogData: any) { }

	ngOnInit() {
		if(!_.isArray(this.dialogData)){
			this.type = 'Edit';
			this.item = _.cloneDeep(this.dialogData);
			this.item.category = this.assistanceService.categories.find(c => c.categoryId === this.item.categoryId);
		}
	}

	save(form) {
		if(form.valid){
			this.item.categoryId = this.item.category.categoryId;
			this.item.category = this.item.category.category;
			this.item.elderQuantity = this.item.elderQuantity || 0;
			this.item.sisterQuantity = this.item.sisterQuantity || 0;
			this.dialogRef.close(this.item);
		}
	}

}
