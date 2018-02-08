import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSearchService } from '../../../services';
import { SimpleConfirmationComponent } from 'mtc-modules';

@Component({
	selector: 'app-missionary-custom-search-save',
	templateUrl: './save-search.component.html',
	styleUrls: ['./save-search.component.less']
})
export class SaveCustomSearchComponent implements OnInit {

	searchesForm: FormGroup;

	constructor(private dialogRef: MatDialogRef<SaveCustomSearchComponent>,
				@Inject(MAT_DIALOG_DATA) public dialogData: any,
				public customSearchService: CustomSearchService,
				private dialog: MatDialog,
				public fb: FormBuilder) {}

	ngOnInit(){
		this.customSearchService.getSearchList();
		this.searchesForm = this.fb.group({
			name: ['', [Validators.required, Validators.maxLength(30)]],
			description: ['', Validators.maxLength(140)],
		});
	}

	save(form){
		const matchingSearch = this.customSearchService.searches.find((search) => {
			return this.dialogData.name === search.name && this.dialogData.customSearchId !== search.customSearchId;
		});
		if(matchingSearch) {
			this.dialog.open(SimpleConfirmationComponent, {
				data: {
					content: 'There is already a saved search with this name. Do you want to replace it?',
					cancelButtonText: 'No',
					confirmationButtonText: 'Yes'
				},
				height: '195px',
				width: '480px',
				disableClose:true
			}).afterClosed().subscribe((response) => {
				if(response) {
					this.dialogData.customSearchId = matchingSearch.customSearchId;
					this.dialogData.createDate = matchingSearch.createDate;
					this.dialogData.createdBy = matchingSearch.createdBy;
					if(form.valid){
						this.dialogRef.close(this.dialogData);
					}
				}
			});
		} else {
			if(form.valid) {
				this.dialogRef.close(this.dialogData);
			}
		}
	}
}
