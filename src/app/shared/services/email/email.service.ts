import { Injectable } from '@angular/core';
import { HostnameService } from '../hostname/hostname.service';
import { MTCEmail, MTCToastService } from 'mtc-modules';

@Injectable()
export class EmailService {

	constructor(private toastService: MTCToastService,
				private email: MTCEmail,
				private hostName: HostnameService) { }

	public sendEmail(recipients, text, subject) {
		if (this.hostName.env !== '' && this.hostName.env !== 'support') {
			recipients = 'test.mtc.byu.edu@gmail.com';
		}
		this.email.send({
			recipients: recipients,
			subject: subject,
			text: text, // Required
		}).subscribe(() => {
			this.toastService.success(`The email was <strong>successfully</strong> sent to ${recipients}`);
		}, () => {
			this.toastService.error(`The email <strong>failed</strong> to send to ${recipients}`);
		});
	}

}
