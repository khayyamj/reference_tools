import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'missingInfo'
})
export class MissingInfoPipe implements PipeTransform {

	transform(value: string): string {
		return value || 'Info Not Available';
	}

}
