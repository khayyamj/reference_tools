import { Component, OnInit } from '@angular/core';
import { ExceptionsManagementService } from '../../services';
import { MatDialog } from '@angular/material';
import { SimpleConfirmationComponent, MTCToastService, CheckboxTableColumn, CheckboxTableConfig } from 'mtc-modules';
import { EditExceptionComponent } from './edit-exception';

@Component({
	selector: 'scheduling-records-exception-management',
	templateUrl: './exception-management.component.html',
	styleUrls: ['./exception-management.component.less']
})
export class ExceptionManagementComponent implements OnInit {

	isActiveLoading = true;
	isInactiveLoading = true;
	public columns: CheckboxTableColumn [] = [
		{ title: 'Name', attr: 'name' },
		{ title: 'Abbreviation', attr: 'abbreviation' },
		{ title: 'Fields', attr: 'concatFields' }
	];

	active = {
		list:[],
		editException:false,
		deleteException:false,
		deactivateException:false,
		selected:[]
	};
	activeExceptionCheckboxTableConfig: CheckboxTableConfig = {
		topButtons: [
			{text: 'Deactivate', function: this.deactivate.bind(this)},
			{text: 'Delete', function: this.deleteException.bind(this)}
		],

		rowButtons: [
			{text: 'Edit', function: this.editActiveException.bind(this)}
		]
	};

	inactive = {
		list:[],
		editException:false,
		deleteException:false,
		deactivateException:false,
		selected:[]
	};
	inactiveExceptionCheckboxTableConfig = {
		topButtons: [
			{text: 'Reactivate', function: this.activate.bind(this)},
			{text: 'Delete', function: this.deleteException.bind(this)}
		],

		rowButtons: [
			{text: 'Edit', function: this.editInactiveException.bind(this)}
		]
	};

	constructor(private exceptionsManagementService: ExceptionsManagementService,
		private mtcToastService: MTCToastService,
		private dialog: MatDialog) { }

	ngOnInit() {
		this.refreshData();
	}
	editActiveException(exception) {
		this.editException('active', exception);

	}

	editInactiveException(exception) {
		this.editException('inactive', exception);

	}

	editException(table, exception?) {
		let dialogResult;
		if(table === 'create'){
			dialogResult = this.dialog.open(EditExceptionComponent, {
				data: 'create',
				disableClose: true
			});
		} else {
			dialogResult = this.dialog.open(EditExceptionComponent, {
				data: exception,
				disableClose: true
			});
		}

		dialogResult.afterClosed().subscribe((newException) => {
			if(newException){
				if(newException.delete){
					this.exceptionsManagementService.deleteException(newException).subscribe(() => {
						this.getExceptions(table);
						this.mtcToastService.success('Exception <strong>successfully</strong> deleted');
					});
				} else if(table === 'create') {
					this.getExceptions('active');
					this.mtcToastService.success('Exception <strong>successfully</strong> created');
				} else {
					this.getExceptions(table);
					this.mtcToastService.success('Exception <strong>successfully</strong> saved');
				}
			}
		});

	}

	getExceptions(tables) {
		if(tables.indexOf('active') !== -1){
			this.exceptionsManagementService.getActiveExceptions().subscribe((activeExceptions:any[]) => {
				this.active.list = this.formatExceptions(activeExceptions);
				this.isActiveLoading = false;
			});
		}
		if(tables.indexOf('inactive') !== -1){
			this.exceptionsManagementService.getInactiveExceptions().subscribe((inactiveExceptions:any[]) => {
				this.inactive.list = this.formatExceptions(inactiveExceptions);
				this.isInactiveLoading = false;
			});
		}
	}

	formatExceptions(list){
		list.forEach(item => {
			item.concatFields = item.fields.map(field => field.name).join(', ');
		});
		return list;
	}

	deleteException(exceptions) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'delete',
			content: 'Are you sure you want to delete the selected exception(s)?'
		};
		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width:'400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				this.exceptionsManagementService.deleteException(exceptions).subscribe(() => {
					this.inactive.list = [];
					this.getExceptions('inactive');
					this.mtcToastService.success('Exception <strong>successfully</strong> deleted');
				});
			}
		});
	}

	deactivate(exceptions) {
		this.exceptionsManagementService.deactivateExceptions(exceptions).subscribe(() => {
			this.refreshData();
		});
	}

	activate(exceptions) {
		this.exceptionsManagementService.activateExceptions(exceptions).subscribe(() => {
			this.refreshData();
		});
	}

	refreshData(){
		this.active.list = [];
		this.inactive.list = [];
		this.getExceptions(['active', 'inactive']);
	}

}
