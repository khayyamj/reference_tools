import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { RolesService } from '../../../../shared';
import { SimpleConfirmationComponent } from 'mtc-modules';
import { DomSanitizer } from '@angular/platform-browser';
import { NoteService } from '../../../services/notes/notes.service';
import { MTCUser } from 'mtc-modules';

@Component({
	selector: 'app-add-note',
	templateUrl: './add-note.component.html',
	styleUrls: ['./add-note.component.less']
})
export class AddNoteComponent implements OnInit {

	editorConfig = {
		modules: {
			toolbar: '#toolbar'
		},
		placeholder: 'Note Text'
	};
	edit = true;
	canChangeVisibility = false;

	showTemplates = false;
	showInsertOptions = false;
	showColors = false;
	showVisibilities = false;
	showTags = false;

	editor;
	note;
	missionary;

	visibilities = [];
	tags = [];
	insertOptions = [];
	templates = [];

	limit = 3500;
	lastVersion;

	colors = [
		{hex:'#000000',style:false},
		{hex:'#EF5458'},
		{hex:'#F2813A'},
		{hex:'#FFC600'},
		{hex:'#51BC95'},
		{hex:'#4D6594'},
		{hex:'#7F6DB0'}
	];

	chosenColor = this.colors[0];
	user;

	constructor(@Inject(forwardRef(() => NoteService)) private noteService: NoteService,
				@Inject(MAT_DIALOG_DATA) private dialogData: any,
				private dialogRef: MatDialogRef<any>,
				private dialog: MatDialog,
				private rolesService: RolesService,
				private domSanitizer: DomSanitizer,
				private userService: MTCUser){

	}

	onEditorCreated(quill){
		this.editor = quill;
	}

	ngOnInit(){
		this.rolesService.loaded.subscribe(() => {
			this.noteService.getNoteConfig().subscribe((config:any) => {
				this.visibilities = config.visibilities;
				this.tags = config.tags;
				this.templates = config.templates;
				this.canChangeVisibility = this.rolesService.canCreateConfidentialNotes;
				if(this.visibilities.length === 1){
					this.note.visId = this.visibilities[0].visId;
					this.note.visName = this.visibilities[0].visName;
				}
			});
		});
		this.note = this.dialogData.note;
		this.missionary = this.dialogData.missionary;
		this.edit = this.dialogData.isCreate;
		this.lastVersion = this.note.noteTxt;

		this.initializeInsertOptions();

		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});
	}

	initializeInsertOptions(){
		if(this.missionary.missionInfo.missionName){
			this.insertOptions.push({name:'Mission',value:this.missionary.missionInfo.missionName});
		}
		if(this.missionary.mtcInfo.districtPresident){
			this.insertOptions.push({name:'District President',value:this.missionary.mtcInfo.districtPresident.lastName + ', ' + this.missionary.mtcInfo.districtPresident.firstName});
		}
		if(this.missionary.missionInfo.missionPresident){
			this.insertOptions.push({name:'Mission President',value:this.missionary.missionInfo.missionPresident});
		}
		if(this.missionary.unitInfoList[0].parentUnitName){
			this.insertOptions.push({name:'Stake',value:this.missionary.unitInfoList[0].parentUnitName});
		}
		if(this.missionary.unitInfoList[0].parentUnitLeaders[0].fullName){
			this.insertOptions.push({name:'Stake President',value:this.missionary.unitInfoList[0].parentUnitLeaders[0].fullName});
		}
		if(this.missionary.unitInfoList[0].unitName){
			this.insertOptions.push({name:'Ward',value:this.missionary.unitInfoList[0].unitName});
		}
		if(this.missionary.unitInfoList[0].unitLeaders[0].fullName){
			this.insertOptions.push({name:'Bishop',value:this.missionary.unitInfoList[0].unitLeaders[0].fullName});
		}
	}

	getNote(){
		return this.domSanitizer.bypassSecurityTrustHtml(this.note.noteTxt);
	}

	changeColor(color){
		const style = color.style || color.hex;
		this.editor.format('color', style);
		this.chosenColor = color;
		setTimeout(() => this.showColors = false);
	}

	insertName(text, bold = false){
		const selection = this.editor.getSelection(true);
		this.editor.insertText(selection.index, text, 'bold', bold, 'user');
		setTimeout(() => this.showInsertOptions = false);
	}

	insertTemplate(template){
		this.note.noteTxt = template.content;
		setTimeout(() => {
			this.editor.setSelection(template.cursorLocation,0,'user');
			this.editor.focus();
			this.showTemplates = false;
		});
	}

	save(){
		if(this.note.visName){
			this.dialogRef.close(this.note);
		}else{
			this.showVisibilities = true;
		}
	}

	//TODO this functionality is temporary, which includes the function below, the declaration of the lastVersion and limit variables, the change attribute on the editor, and the span tag below the editor
	noteLength(e) {
		if(e.html) {
			if (e.html.length > this.limit) {
				this.note.noteTxt = this.lastVersion.text;
			} else {
				this.lastVersion = e;
			}
		}
	}

	changeVisibility(visibility){
		setTimeout(() => {
			this.showVisibilities = false;
			this.note.visId = visibility.visId;
			this.note.visName = visibility.visName;
		});
	}

	changeTag(tag){
		const tagIndex = this.note.tags.findIndex((noteTag) => {
			return noteTag.tagId === tag.tagId;
		});
		if(tagIndex === -1){
			this.note.tags.push(tag);
		}else{
			this.note.tags.splice(tagIndex,1);
		}
	}

	close(){
		if(this.edit){
			this.dialog.open(SimpleConfirmationComponent, {
				data: {
					cancelButtonText: 'No',
					confirmationButtonText: 'Yes',
					content: 'You have not saved, would you like to close your note without saving?'
				},
				width: '500px'
			}).afterClosed().subscribe((response) => {
				if(response){
					this.dialogRef.close();
				}
			});
		}else{
			this.dialogRef.close();
		}
	}

	canEdit(){
		return this.canChangeVisibility && this.note.createdById === this.user.id;
	}

	tagIncluded(tags, tag) {
		return tags.some(choosenTag=> choosenTag.tagId === tag.tagId);
	}

}
