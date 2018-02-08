import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SimpleConfirmationComponent, MTCToastService } from 'mtc-modules';
import { NapiDataService } from '../../services';

@Component({
	selector: 'scheduling-records-napi-data',
	templateUrl: './napi-data.component.html',
	styleUrls: ['./napi-data.component.less']
})
export class NapiDataComponent implements OnInit {
	public idPlaceholder = 'Insert IDs separated by commas';
	public missionary: any;
	public lastUpdateDate = new Date(new Date().setDate(new Date().getDate()-1));
	constructor(private dialog: MatDialog,
			private mtcToastService: MTCToastService,
			private napiDataService: NapiDataService) { }

	ngOnInit() {
		this.lastUpdateDate.setHours(23,0,0,0);
		this.missionary = this.napiDataService.missionary;
	}


	downloadNapiData(ids?) {
		const config = {
			cancelButtonText: 'cancel',
			confirmationButtonText: 'download',
			content: 'Data download will occur in the background'
		};

		const toastConfigDownloading = {
			timeout:0,
			position: 'top right'
		};

		const toastConfigDownloadComplete = {
			timeout: 60000,
			position: 'top right',
			canClose: true
		};

		this.dialog.open(SimpleConfirmationComponent, {
			data: config,
			width:'400px'
		}).afterClosed().subscribe((data) => {
			if (data) {
				const toastId=this.mtcToastService.info('Salt Lake Data Download in progress',toastConfigDownloading);
				this.napiDataService.getNapiData(ids).subscribe(() => {
					this.mtcToastService.clear(toastId);
					this.mtcToastService.success('Data download completed <strong>successfully</strong>',toastConfigDownloadComplete);
				});
			}
		});
	}


	downloadNapiDataById() {
		if (this.missionary.ids) {
			this.downloadNapiData(this.missionary.ids.replace(/\s/g, ''));
		}
	}

}
