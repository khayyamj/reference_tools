import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditClassroomSizeComponent } from './edit-classroom-size';
import { ClassroomSizeManagementService } from '../../services';

@Component({
	selector: 'app-new-missionary-classroom-size',
	templateUrl: './classroom-size-management.component.html',
	styleUrls: ['./classroom-size-management.component.less']
})
export class ClassroomSizeManagementComponent implements OnInit {
	rows = [];
	filteredRows = [];
	selectedLanguages = [];
	highlightCell: any = {};
	searchText;
	loading = true;
	allSelected;
	lastSelected;
	shiftPressed = false;
	_rows;
	resultSelected;

	@ViewChild('input') private input: ElementRef;

	constructor(private dialog: MatDialog, private classroomService: ClassroomSizeManagementService) { }

	ngOnInit() {
		this.classroomService.getClassroomSizes().subscribe((classroomSizes:any[]) => {
			this.rows = classroomSizes;
			this.filteredRows = this.rows;
			this.loading = false;
		});
	}

	setFocus(capacity, inputType){
		capacity[inputType] = true;
		setTimeout(()=>{
			this.input.nativeElement.focus();
		});
	}

	clear() {
		this.selectedLanguages = [];
		this.searchText = '';
		this.updateList();
		this.setAll(false);
	}

	updateList() {
		this.filteredRows = this.rows.filter((classroom) => {
			return this.selectedLanguages.length === 0 || this.selectedLanguages.some((lang) => lang.name === classroom.name);
		});
	}

	showShiftPressed(event) {
		this.shiftPressed = event.shiftKey;
		event.stopPropagation();
	}

	selectIndex(index, event) {
		if (this.shiftPressed) {
			this.selectRowsBetweenIndexes([index, this.lastSelected], event);
		} else {
			this.filteredRows[index].selected = event.checked;
			this.resultSelected = this.filteredRows.some((row) => {
				return row.selected;
			});
		}
		this.lastSelected = index;
		this.allSelected = this.filteredRows.every((row) => {
			return row.selected;
		});
	}

	selectRowsBetweenIndexes(indexes, event) {
		indexes.sort();
		this.filteredRows.forEach((row, index) => {
			if (index >= indexes[0] && index <= indexes[1]) {
				row.selected = event.checked;
			}
		});
	}

	selectAll() {
		if (this.filteredRows.length) {
			this.allSelected = !this.allSelected;
			this.resultSelected = this.allSelected;
			this.setAll(this.allSelected);
		}
	}

	showEdit() {
		return this.filteredRows.some((row) => {
			return row.selected;
		});
	}

	setAll(bool) {
		this.filteredRows.forEach(row => {
			row.selected = bool;
		});
		this.allSelected = bool;
	}

	shouldShowEdit() {
		return this.resultSelected;
	}

	isHighlighted(row, column, type) {
		return (this.highlightCell.row === row && this.highlightCell.type === type) || (this.highlightCell.column === column);
	}

	clearHighlight(){
		this.highlightCell = {};
	}

	selectCell(row, column, type) {
		this.highlightCell = {
			row: row,
			column: column,
			type: type
		};
	}

	editClassroom() {
		const selectedClassrooms = this.filteredRows.filter(row => row.selected);
		const dialogResult = this.dialog.open(EditClassroomSizeComponent, {
			data: selectedClassrooms,
			disableClose: true,
			height: '375px',
			width: '500px'
		});
		dialogResult.afterClosed().subscribe((editedClassrooms) => {
			if (editedClassrooms) {
				this.classroomService.saveClassrooms(editedClassrooms).subscribe();
			}
		});
	}

	sizeChanged(editedCapacity){
		editedCapacity.min = editedCapacity.min || 0;
		editedCapacity.max = editedCapacity.max || 0;
		this.classroomService.saveClassrooms([{sizes:[editedCapacity]}]).subscribe();
	}

	updateCell(capacity, cellType) {
		if(cellType === 'min') {
			capacity.editMin = false;
		} else {
			capacity.editMax = false;
		}

		if (parseInt(capacity.min, 10) > parseInt(capacity.max, 10)) {
			capacity[cellType === 'min' ? 'max' : 'min'] = capacity[cellType];
		}

		this.sizeChanged(capacity);
	}
}
